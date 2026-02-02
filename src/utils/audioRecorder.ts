/**
 * audioRecorder.ts
 * 
 * HARDWARE MICROPHONE HANDLER
 * 
 * This class manages the low-level capture of audio data from the browser's 
 * MediaDevices API. It is tailored specifically for the requirements of 
 * the Gemini Live API.
 * 
 * KEY CONSTRAINTS:
 * 1. Mono Audio: Multi-channel data is unnecessary for speech-to-text.
 * 2. 16kHz Sample Rate: Gemini Live strictly requires PCM 16-bit at 16,000Hz.
 * 3. Browser Variance: Modern browsers often force hardware to 44.1kHz or 48kHz.
 *    This class performs manual linear interpolation downsampling to ensure 
 *    the model receives audio at the correct pitch and speed.
 * 
 * ARCHITECTURE:
 * Uses a `ScriptProcessorNode` to pipe audio chunks from the `AudioContext` 
 * to a processing callback. In production, this should ideally move to an 
 * `AudioWorklet` to prevent main-thread UI jank.
 */

import { createPcmBlob, downsampleBuffer } from './audioUtils';

export class AudioRecorder {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private onData: (base64: string) => void;
  private onStream: (stream: MediaStream) => void;

  /**
   * @param onData Callback for processed PCM base64 chunks.
   * @param onStream Callback to provide the raw MediaStream for visualization.
   */
  constructor(onData: (base64: string) => void, onStream: (stream: MediaStream) => void) {
    this.onData = onData;
    this.onStream = onStream;
  }

  /**
   * Initializes hardware and starts the processing loop.
   * MUST be called from a user gesture stack for best results on mobile.
   */
  async start() {
    try {
      // 1. Request microphone access immediately (User Gesture)
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          autoGainControl: true,
          noiseSuppression: true,
        }
      });

      this.onStream(this.mediaStream);

      // 2. Initialize AudioContext (User Gesture)
      // We use the standard constructor and handle the webkit prefix safely.
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContextClass({ sampleRate: 16000 });

      // 3. Force Resume (Crucial for Mobile Safari/Chrome)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // 4. Load the Worklet
      await this.audioContext.audioWorklet.addModule(
        new URL('./capture.worklet.ts', import.meta.url)
      );

      const targetRate = 16000;
      const contextRate = this.audioContext.sampleRate;

      this.source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.workletNode = new AudioWorkletNode(this.audioContext, 'capture-processor');

      this.workletNode.port.onmessage = (e) => {
        if (this.audioContext?.state !== 'running') return;

        const inputData = e.data as Float32Array;
        let processedData = inputData;
        if (contextRate !== targetRate) {
            processedData = downsampleBuffer(inputData, contextRate, targetRate);
        }

        const pcmBlob = createPcmBlob(processedData);
        if (pcmBlob.data) {
          this.onData(pcmBlob.data);
        }
      };

      this.source.connect(this.workletNode);
      this.workletNode.connect(this.audioContext.destination);

    } catch (error) {
      console.error("AudioRecorder Start Failed:", error);
      this.stop(); // Clean up on failure
      throw error;
    }
  }

  /**
   * Suspends hardware input.
   */
  async pause() {
    if (this.audioContext && this.audioContext.state === 'running') {
      await this.audioContext.suspend();
    }
  }

  /**
   * Resumes hardware input.
   */
  async resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  /**
   * Stops tracks and closes contexts.
   */
  stop() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    if (this.workletNode) {
      this.workletNode.disconnect();
      this.workletNode = null;
    }
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}