# Image Generation Feature: Implementation Plan

This document outlines the plan for implementing real AI image generation capabilities, replacing the current canvas-based simulation.

## 1. Model Selection

We have researched two primary approaches for integrating a text-to-image model.

### Approach 1: Local, In-browser Model with `Web Stable Diffusion`

-   **Description:** This approach uses the `Web Stable Diffusion` library to run a version of the Stable Diffusion model directly in the browser, leveraging WebGPU for hardware acceleration.
-   **Pros:**
    -   **Ultimate Privacy:** Fulfills the "local processing" goal completely.
    -   **No Server Costs:** All computation is performed on the user's device.
-   **Cons:**
    -   **High Client-side Requirements:** Requires a modern browser and a powerful GPU.
    -   **Large Initial Download:** Model files are very large.
    -   **Slower Generation Speed:** Noticeably slower than server-based alternatives.
    -   **Experimental Technology:** WebGPU is still evolving.

### Approach 2: Server-based Model with Hugging Face Inference API

-   **Description:** This approach involves making an API call to a powerful, server-hosted image generation model (like Stable Diffusion XL) via the Hugging Face Inference API.
-   **Pros:**
    -   **High Quality & Speed:** Access to state-of-the-art models on optimized hardware.
    -   **Universal Compatibility:** Works for all users, regardless of their device.
    -   **Reliable and Mature:** A stable, production-ready service.
-   **Cons:**
    -   **API Costs:** This is a paid service.
    -   **Data Privacy:** User prompts are sent to Hugging Face servers.
    -   **Requires Internet:** The feature is online-only.

### Recommendation

We recommend **Approach 2: Hugging Face Inference API** for the initial implementation.

**Reasoning:** This path provides a high-quality, fast, and reliable user experience, which is crucial for a core feature. It avoids the significant technical hurdles and user-side requirements of the in-browser approach, allowing for a quicker and more robust implementation.

## 2. Implementation Steps

### Step 2.1: Create a Server-side API Route

We will create a new API route to handle the request to the Hugging Face API, protecting our API key.

**File:** `src/app/api/generate/image/route.ts`

```typescript
// src/app/api/generate/image/route.ts
import { NextResponse } from 'next/server';

// A popular and powerful model for image generation
const MODEL_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const response = await fetch(
      MODEL_API_URL,
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (response.ok) {
      // The image is returned as a binary blob
      const imageBlob = await response.blob();
      // We can return the image directly, or convert it to a data URL
      const headers = new Headers();
      headers.set('Content-Type', 'image/png');
      return new Response(imageBlob, { status: 200, statusText: 'OK', headers });
    } else {
      const result = await response.json();
      return NextResponse.json({ error: result.error || 'Failed to generate image' }, { status: 500 });
    }

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
```

### Step 2.2: Update the AI Engine

We will update `ai-engine.ts` to call our new image generation API route.

**File:** `src/lib/ai-engine.ts` (new implementation for `loadImageModel`)

```typescript
// ... inside FusionAIEngine class ...

  private async loadImageModel() {
    return {
      generate: async (prompt: string, options: any = {}) => {
        const response = await fetch('/api/generate/image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        });

        if (response.ok) {
          const imageBlob = await response.blob();
          // Convert the blob to a data URL to be easily used in an <img> tag
          return URL.createObjectURL(imageBlob);
        } else {
          const result = await response.json();
          throw new Error(result.error || 'Failed to generate image from API');
        }
      },
    };
  }

// ... rest of the file ...
```

### Step 2.3: Update the Image Generator Component

The `ImageGenerator.tsx` component will need a minor adjustment to handle the new data URL response from the AI engine.

**File:** `src/components/generators/ImageGenerator.tsx`

The component will call `fusionAI.generateImage(prompt)` and set the returned data URL to the `src` of an `<img>` element to display the generated image. The existing logic for handling loading states can be reused.