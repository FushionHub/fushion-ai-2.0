import { POST } from '../route';
import { NextResponse } from 'next/server';

// Mock the global fetch function
global.fetch = jest.fn();

// Mock environment variables
const OLD_ENV = process.env;
beforeEach(() => {
  jest.resetModules();
  process.env = { ...OLD_ENV, HUGGING_FACE_API_KEY: 'test-api-key' };
});

afterAll(() => {
  process.env = OLD_ENV;
});

describe('POST /api/generate/image', () => {

  it('should return an image blob on a successful API call', async () => {
    // Arrange: Mock a successful response with a fake image blob
    const mockImageBlob = new Blob(['fake-image-data'], { type: 'image/png' });
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: async () => mockImageBlob,
    });

    const request = new Request('http://localhost/api/generate/image', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'A beautiful sunset' }),
      headers: { 'Content-Type': 'application/json' },
    });

    // Act: Call the POST handler
    const response = await POST(request);
    const responseBlob = await response.blob();

    // Assert: Check that the response is correct
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toEqual('image/png');
    expect(await responseBlob.text()).toEqual('fake-image-data');
  });

  it('should return an error when the Hugging Face API fails', async () => {
    // Arrange: Mock a failed response from the Hugging Face API
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 503,
      json: async () => ({ error: 'Model is currently loading' }),
    });

    const request = new Request('http://localhost/api/generate/image', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'A beautiful sunset' }),
      headers: { 'Content-Type': 'application/json' },
    });

    // Act: Call the POST handler
    const response = await POST(request);
    const body = await response.json();

    // Assert: Check that the error response is correct
    expect(response.status).toBe(500); // Our route returns 500
    expect(body).toEqual({ error: 'Model is currently loading' });
  });

  it('should return a 400 error if the prompt is missing', async () => {
    // Arrange: Create a request with no prompt
    const request = new Request('http://localhost/api/generate/image', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    });

    // Act: Call the POST handler
    const response = await POST(request);
    const body = await response.json();

    // Assert: Check for 400 Bad Request
    expect(response.status).toBe(400);
    expect(body).toEqual({ error: 'Prompt is required' });
  });

});