/**
 * audioStreamPlayer.ts
 * 
 * SIMULTANEOUS INTERPRETATION PLAYBACK ENGINE
 * 
 * This class handles the real-time playback of audio bytes received from 
 * the Gemini Live API. 
 * 
 * CHALLENGES:
 * 1. Binary Formats: The API returns raw 16-bit PCM little-endian audio. 
 *    Browsers require Float32 buffers for the AudioContext.
 * 2. Sample Rates: Gemini Live output is fixed at 24,000Hz.
 * 3. Network Jitter & Gapless Playback: Audio arrives in small chunks. 
 *    Standard playback methods would cause "clicking" or "stuttering". 
 *    This class uses a running timestamp cursor (`nextStartTime`) to 
 *    perfectly sequence chunks without gaps.
 */

export class AudioStreamPlayer {
  private audioContext: AudioContext | null = null;
  private nextStartTime: number = 0;
  private isEnabled: boolean = false;
  private gainNode: GainNode | null = null;

  constructor() {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.audioContext = new AudioContextClass();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
    
    // Initialize the cursor at the current context time.
    this.nextStartTime = this.audioContext.currentTime;
  }

  /**
   * Processes and schedules a single audio chunk for playback.
   * @param base64Data Raw PCM16 base64 string from the API.
   */
  async playChunk(base64Data: string) {
    if (!this.audioContext || !this.isEnabled || !this.gainNode) return;

    // Browsers often suspend the context until a user gesture occurs.
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    try {
      // Decode Base64 string to a binary array buffer.
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // --- PCM16 TO FLOAT32 CONVERSION ---
      // We interpret the raw bytes as signed 16-bit integers and 
      // normalize them to a [-1.0, 1.0] float range.
      const int16Data = new Int16Array(bytes.buffer);
      const float32Data = new Float32Array(int16Data.length);
      for (let i = 0; i < int16Data.length; i++) {
        float32Data[i] = int16Data[i] / 32768.0;
      }

      // Create a native browser AudioBuffer.
      const buffer = this.audioContext.createBuffer(1, float32Data.length, 24000);
      buffer.getChannelData(0).set(float32Data);

      // --- GAPLESS PLAYBACK SCHEDULING ---
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(this.gainNode);

      const now = this.audioContext.currentTime;
      // If our playback queue has finished or fallen behind, we reset 
      // the cursor to 'now' with a very slight safety buffer (50ms).
      if (this.nextStartTime < now) {
        this.nextStartTime = now + 0.05; 
      }

      // Schedule the buffer to start exactly where the previous one ends.
      source.start(this.nextStartTime);
      this.nextStartTime += buffer.duration;

    } catch (e) {
      console.error("Error playing audio chunk", e);
    }
  }

  /**
   * Enables or disables vocal playback (mute/unmute).
   */
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (enabled && this.audioContext) {
        this.audioContext.resume();
    }
  }

  /**
   * Final cleanup.
   */
  stop() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}