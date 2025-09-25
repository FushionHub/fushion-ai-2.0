# Audio Generation Feature: Implementation Plan

This document outlines the plan for implementing real text-to-speech (TTS) capabilities, replacing the current simulation.

## 1. Model Selection

We have researched two primary approaches for integrating a TTS model.

### Approach 1: Local, In-browser Synthesis with Web Speech API

-   **Description:** This approach uses the browser's built-in `SpeechSynthesis` interface to generate audio locally.
-   **Pros:**
    -   **True Local Processing:** Generation happens on the user's device.
    -   **Zero Cost & No Setup:** It's a free, built-in browser feature.
    -   **Extremely Fast:** Near-instantaneous audio generation.
-   **Cons:**
    -   **Inconsistent Voice Quality:** Voice quality and availability vary greatly between browsers and operating systems.
    -   **Limited Control:** Very little control over the voice's style or emotion.
    -   **Standard Voices Only:** Limited to the user's default system voices.

### Approach 2: Server-based Synthesis with Hugging Face Inference API

-   **Description:** This approach involves making an API call to a powerful, server-hosted TTS model.
-   **Pros:**
    -   **High-Quality, Consistent Voices:** Access to state-of-the-art models that produce natural-sounding speech for all users.
    -   **Wide Variety of Voices:** Many models offer different speakers and styles.
    -   **Reliable and Predictable:** The output is not dependent on the user's setup.
-   **Cons:**
    -   **API Costs:** This is a paid service.
    -   **Data Privacy:** The text is sent to a third-party server.
    -   **Network Latency:** Slower than the instant generation of the Web Speech API.

### Recommendation

We recommend **Approach 2: Hugging Face Inference API**. The inconsistent and often robotic-sounding voices of the Web Speech API do not align with the "Advanced AI" branding of the application. The Hugging Face API provides the high-quality, professional-grade audio output that users would expect.

## 2. Implementation Steps

### Step 2.1: Create a Server-side API Route

We will create a new API route to handle the request to the Hugging Face TTS API, protecting our API key.

**File:** `src/app/api/generate/audio/route.ts`

```typescript
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
```

### Step 2.2: Update the AI Engine

We will update `ai-engine.ts` to call our new audio generation API route.

**File:** `src/lib/ai-engine.ts` (new implementation for `loadAudioModel`)

```typescript
// ... inside FusionAIEngine class ...

  private async loadAudioModel() {
    return {
      generate: async (text: string, options: any = {}) => {
        const response = await fetch('/api/generate/audio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        });

        if (response.ok) {
          const audioBlob = await response.blob();
          return {
            url: URL.createObjectURL(audioBlob),
            duration: 0,
            format: 'flac'
          };
        } else {
          const result = await response.json();
          throw new Error(result.error || 'Failed to generate audio from API');
        }
      },
    };
  }

// ... rest of the file ...
```

### Step 2.3: Update the UI Components

The `ChatInterface.tsx` component needs to be updated to handle the audio playback. An `<audio>` element should be added, and its `src` should be set to the `url` from the `generateAudio` response. A new state variable will be needed to manage the currently playing audio URL.