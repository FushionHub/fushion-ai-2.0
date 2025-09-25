import { POST } from '../route';
import { NextResponse } from 'next/server';

// Mock the global fetch function
global.fetch = jest.fn();

// Mock environment variables
const OLD_ENV = process.env;
beforeEach(() => {
  jest.resetModules(); // Most important - it clears the cache
  process.env = { ...OLD_ENV, HUGGING_FACE_API_KEY: 'test-api-key' }; // Make a copy
});

afterAll(() => {
  process.env = OLD_ENV; // Restore old environment
});

describe('POST /api/generate/text', () => {

  it('should return generated text on a successful API call', async () => {
    // Arrange: Mock a successful response from the Hugging Face API
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ([{ generated_text: 'This is a test response.' }]),
    });

    const request = new Request('http://localhost/api/generate/text', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'This is a test prompt' }),
      headers: { 'Content-Type': 'application/json' },
    });

    // Act: Call the POST handler
    const response = await POST(request);
    const body = await response.json();

    // Assert: Check that the response is correct
    expect(response.status).toBe(200);
    expect(body).toEqual({ text: 'This is a test response.' });
  });

  it('should return an error when the Hugging Face API fails', async () => {
    // Arrange: Mock a failed response from the Hugging Face API
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Model is currently loading' }),
    });

    const request = new Request('http://localhost/api/generate/text', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'This is a test prompt' }),
      headers: { 'Content-Type': 'application/json' },
    });

    // Act: Call the POST handler
    const response = await POST(request);
    const body = await response.json();

    // Assert: Check that the error response is correct
    expect(response.status).toBe(500);
    expect(body).toEqual({ error: 'Model is currently loading' });
  });

  it('should return a 400 error if the prompt is missing', async () => {
    // Arrange: Create a request with no prompt in the body
    const request = new Request('http://localhost/api/generate/text', {
      method: 'POST',
      body: JSON.stringify({}), // Missing prompt
      headers: { 'Content-Type': 'application/json' },
    });

    // Act: Call the POST handler
    const response = await POST(request);
    const body = await response.json();

    // Assert: Check that the response is a 400 Bad Request
    expect(response.status).toBe(400);
    expect(body).toEqual({ error: 'Prompt is required' });
  });

  it('should return a 500 error if the API key is not configured', async () => {
    // Arrange: Unset the environment variable
    delete process.env.HUGGING_FACE_API_KEY;

    const request = new Request('http://localhost/api/generate/text', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'This is a test prompt' }),
      headers: { 'Content-Type': 'application/json' },
    });

    // Act: Call the POST handler
    const response = await POST(request);
    const body = await response.json();

    // Assert: Check that the response is a 500 Internal Server Error
    expect(response.status).toBe(500);
    expect(body).toEqual({ error: 'Hugging Face API key is not configured' });
  });

});