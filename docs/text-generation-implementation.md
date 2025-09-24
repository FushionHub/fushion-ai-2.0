# Text Generation Feature: Implementation Plan

This document outlines the plan for implementing real text generation capabilities in the Fusion AI 2.0 platform, replacing the current simulation.

## 1. Model Selection

We have researched two primary approaches for integrating a Large Language Model (LLM).

### Approach 1: Local, In-browser Model with `transformers.js`

-   **Description:** This approach involves loading a pre-trained language model directly into the user's browser. The `transformers.js` library handles the model download and execution on the user's device.
-   **Pros:**
    -   **Privacy:** User data never leaves their device, fulfilling the "100% Local Processing" promise.
    -   **No Server Costs:** Inference is performed client-side.
    -   **Offline Capability:** Can potentially run offline once the model is cached.
-   **Cons:**
    -   **Performance:** Heavily dependent on the user's hardware.
    -   **Model Size:** Large models lead to long initial load times and high bandwidth usage.
    -   **Limited Model Choice:** Not all models are optimized for in-browser use.

### Approach 2: Server-based Model with Hugging Face Inference API

-   **Description:** This approach involves making an API call from our application to a model hosted on Hugging Face's infrastructure.
-   **Pros:**
    -   **High Performance:** Access to powerful models on optimized hardware.
    -   **Vast Model Choice:** Almost any model on the Hugging Face Hub is available.
    -   **Lightweight Client:** No large downloads are required for the user.
-   **Cons:**
    -   **Server Costs:** The Inference API is a paid service.
    -   **Privacy Concerns:** User data is sent to a third-party server.
    -   **Requires Internet:** The feature is online-only.

### Recommendation

For the initial implementation, we recommend **Approach 2: Hugging Face Inference API**.

**Reasoning:** This approach provides the best user experience in terms of performance and quality of results. It is also significantly faster to implement and validate. While it deviates from the "local processing" goal, it allows us to deliver a high-quality, functional feature quickly. The local processing aspect can be revisited as a future enhancement or an optional mode for users.

## 2. Implementation Steps

### Step 2.1: Obtain Hugging Face API Key

1.  Create an account on [Hugging Face](https://huggingface.co/).
2.  Navigate to your profile settings and generate an API token.
3.  Add this token to the `.env.local` file:
    ```
    HUGGING_FACE_API_KEY=your_hf_api_key_here
    ```

### Step 2.2: Create a Server-side API Route

To avoid exposing the API key to the client, we will create a new API route in our Next.js application that will proxy the requests to the Hugging Face API.

**File:** `src/app/api/generate/text/route.ts`

```typescript
// src/app/api/generate/text/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/gemma-7b",
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    const result = await response.json();

    if (response.ok) {
      // The API returns an array with the generated text
      const generatedText = result[0]?.generated_text || "Sorry, I couldn't generate a response.";
      return NextResponse.json({ text: generatedText });
    } else {
      return NextResponse.json({ error: result.error || 'Failed to generate text' }, { status: 500 });
    }

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
```

### Step 2.3: Update the AI Engine

Next, we will update the `ai-engine.ts` to call our new API route instead of returning a simulated response.

**File:** `src/lib/ai-engine.ts`

```typescript
// ... existing class ...

  private async loadTextModel() {
    // This model now represents our connection to the backend API
    return {
      generate: async (prompt: string, options: any = {}) => {
        const response = await fetch('/api/generate/text', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        });

        const result = await response.json();

        if (response.ok) {
          return result.text;
        } else {
          throw new Error(result.error || 'Failed to generate text from API');
        }
      }
    };
  }

// ... rest of the file ...
```

### Step 2.4: Verify in the Chat Interface

No changes should be needed in `src/components/chat/ChatInterface.tsx` initially, as it already calls the `fusionAI.generateText` method. The update to the AI engine should be seamless. We will simply need to test the interface to ensure it correctly sends the prompt and displays the real response from the API.