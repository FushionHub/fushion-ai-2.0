// This file defines the API route for text generation.
// It receives a prompt from the client, securely calls the Hugging Face Inference API,
// and streams the response back to the client.

import { NextResponse } from 'next/server';

// Recommended: Use a specific, smaller model for initial testing, like gpt2 or distilgpt2.
// Larger models like gemma-7b can be slow or may require a Pro subscription on Hugging Face.
const MODEL_API_URL = "https://api-inference.huggingface.co/models/gpt2";

export async function POST(request: Request) {
  try {
    // 1. Extract the user's prompt from the request body.
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // 2. Fetch the Hugging Face API Key from environment variables.
    //    This key should be set in your .env.local file.
    const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
    if (!HUGGING_FACE_API_KEY) {
      return NextResponse.json({ error: 'Hugging Face API key is not configured' }, { status: 500 });
    }

    // 3. Call the Hugging Face Inference API.
    const response = await fetch(
      MODEL_API_URL,
      {
        headers: {
          'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    // 4. Process the response from the API.
    const result = await response.json();

    if (response.ok) {
      // The API typically returns an array with the generated text.
      const generatedText = result[0]?.generated_text || "Sorry, I couldn't generate a response at this time.";
      return NextResponse.json({ text: generatedText });
    } else {
      // Handle errors from the Hugging Face API.
      console.error('Hugging Face API Error:', result.error);
      return NextResponse.json({ error: result.error || 'Failed to generate text due to an API error.' }, { status: response.status });
    }

  } catch (error) {
    // Handle unexpected server-side errors.
    console.error('Internal Server Error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}