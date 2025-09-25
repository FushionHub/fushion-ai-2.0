// src/app/api/generate/audio/route.ts
import { NextResponse } from 'next/server';

const MODEL_API_URL = "https://api-inference.huggingface.co/models/facebook/mms-tts-eng";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
        return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const response = await fetch(
      MODEL_API_URL,
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ inputs: text }),
      }
    );

    if (response.ok) {
      const audioBlob = await response.blob();
      const headers = new Headers();
      headers.set('Content-Type', 'audio/flac');
      return new Response(audioBlob, { status: 200, statusText: 'OK', headers });
    } else {
      const result = await response.json();
      return NextResponse.json({ error: result.error || 'Failed to generate audio' }, { status: 500 });
    }

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}