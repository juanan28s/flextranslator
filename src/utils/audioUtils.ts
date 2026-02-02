/**
 * audioUtils.ts
 * 
 * AUDIO DATA TRANSFORMATION UTILITIES
 * Provides low-level functions for converting raw audio buffers between
 * browser-native formats (Float32) and Gemini-required formats (PCM16).
 */

import { Blob } from '@google/genai';

/**
 * Converts a base64 string (binary audio) into a Float32Array.
 * Used when receiving audio bytes from the API for playback.
 */
export function base64ToFloat32Array(base64: string): Float32Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  const float32 = new Float32Array(bytes.buffer);
  return float32;
}

/**
 * Encodes Float32 audio samples into a PCM 16-bit little-endian Blob.
 * This is the specific format expected by the Gemini Live API.
 * Includes volume clamping to prevent digital clipping.
 */
export function createPcmBlob(data: Float32Array<ArrayBufferLike>): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    // Clamp values to [-1, 1] range before converting to PCM16
    const s = Math.max(-1, Math.min(1, data[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  
  // Convert array buffer to base64 string manually
  let binary = '';
  const bytes = new Uint8Array(int16.buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  
  return {
    data: btoa(binary),
    mimeType: 'audio/pcm;rate=16000',
  };
}

/**
 * Downsamples a Float32Buffer to a lower sample rate.
 * Critical for high-res microphones that the browser forces to 48kHz+
 * when the AI model strictly requires 16kHz.
 */
export const downsampleBuffer = (buffer: Float32Array<ArrayBufferLike>, sampleRate: number, outSampleRate: number): Float32Array => {
    if (outSampleRate === sampleRate) return buffer as Float32Array;
    if (outSampleRate > sampleRate) throw new Error("Downsampling rate must be smaller than original");

    const sampleRateRatio = sampleRate / outSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;

    while (offsetResult < result.length) {
        const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
        let accum = 0, count = 0;
        for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
            accum += buffer[i];
            count++;
        }
        result[offsetResult] = accum / count;
        offsetResult++;
        offsetBuffer = nextOffsetBuffer;
    }
    return result;
}