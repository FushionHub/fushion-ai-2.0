// This file defines the API route for image generation.
// It receives a prompt from the client, securely calls the Hugging Face Inference API,
// and returns the generated image as a binary blob.

import { NextResponse } from 'next/server';

// Recommended: A powerful, popular model for high-quality image generation.
const MODEL_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

export async function POST(request: Request) {
  try {
    // 1. Extract the user's prompt from the request body.
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // 2. Fetch the Hugging Face API Key from environment variables.
    const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
    if (!HUGGING_FACE_API_KEY) {
      return NextResponse.json({ error: 'Hugging Face API key is not configured' }, { status: 500 });
    }

    // 3. Call the Hugging Face Inference API for image generation.
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

    // 4. Process the response.
    if (response.ok) {
      // If the request was successful, the image is returned as a binary blob.
      const imageBlob = await response.blob();
      // We can stream this blob back to the client.
      const headers = new Headers();
      headers.set('Content-Type', 'image/png'); // Assuming PNG, but it could be JPEG
      return new Response(imageBlob, { status: 200, statusText: 'OK', headers });
    } else {
      // Handle errors from the Hugging Face API.
      const result = await response.json();
      console.error('Hugging Face API Error:', result.error);
      return NextResponse.json({ error: result.error || 'Failed to generate image due to an API error.' }, { status: response.status });
    }

  } catch (error) {
    // Handle unexpected server-side errors.
    console.error('Internal Server Error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}