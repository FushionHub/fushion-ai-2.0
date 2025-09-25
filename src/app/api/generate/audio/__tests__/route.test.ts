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

describe('POST /api/generate/audio', () => {

  it('should return an audio blob on a successful API call', async () => {
    // Arrange: Mock a successful response with a fake audio blob
    const mockAudioBlob = new Blob(['fake-audio-data'], { type: 'audio/flac' });
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: async () => mockAudioBlob,
    });

    const request = new Request('http://localhost/api/generate/audio', {
      method: 'POST',
      body: JSON.stringify({ text: 'Hello world' }),
      headers: { 'Content-Type': 'application/json' },
    });

    // Act: Call the POST handler
    const response = await POST(request);
    const responseBlob = await response.blob();

    // Assert: Check that the response is correct
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toEqual('audio/flac');
    expect(await responseBlob.text()).toEqual('fake-audio-data');
  });

  it('should return an error when the Hugging Face API fails', async () => {
    // Arrange: Mock a failed response from the Hugging Face API
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 503,
      json: async () => ({ error: 'Model is currently loading' }),
    });

    const request = new Request('http://localhost/api/generate/audio', {
      method: 'POST',
      body: JSON.stringify({ text: 'Hello world' }),
      headers: { 'Content-Type': 'application/json' },
    });

    // Act: Call the POST handler
    const response = await POST(request);
    const body = await response.json();

    // Assert: Check that the error response is correct
    expect(response.status).toBe(500);
    expect(body).toEqual({ error: 'Model is currently loading' });
  });

  it('should return a 400 error if the text is missing', async () => {
    // Arrange: Create a request with no text
    const request = new Request('http://localhost/api/generate/audio', {
      method: 'POST',
      body: JSON.stringify({}), // Missing text
      headers: { 'Content-Type': 'application/json' },
    });

    // Act: Call the POST handler
    const response = await POST(request);
    const body = await response.json();

    // Assert: Check for 400 Bad Request
    expect(response.status).toBe(400);
    expect(body).toEqual({ error: 'Text is required' });
  });

});