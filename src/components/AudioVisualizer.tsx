/**
 * AudioVisualizer.tsx
 * 
 * REAL-TIME AUDIO FEEDBACK COMPONENT
 * 
 * Architectural Purpose:
 * Provides a low-latency visual representation of the microphone input.
 * This confirms to the user that the app is "hearing" them even before 
 * a transcript appears.
 * 
 * Implementation Details:
 * 1. AnalyserNode: Uses Web Audio API to extract Fast Fourier Transform (FFT) data.
 * 2. Canvas Rendering: Uses requestAnimationFrame for high-performance (60fps) rendering.
 * 3. Dynamic States:
 *    - Idle: A gentle sine wave pulse when silence is detected or the app is paused.
 *    - Active: High-energy reactive bars that follow frequency intensity.
 * 4. High-DPI Support: Automatically scales for Retina/high-res displays to prevent blurring.
 */

import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  stream: MediaStream | null;
  isPaused?: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ stream, isPaused = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!stream || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    /**
     * Ensures the canvas resolution matches the device pixel ratio.
     */
    const resizeCanvas = () => {
      const { width, height } = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(() => resizeCanvas());
    resizeObserver.observe(container);

    let audioCtx: AudioContext | null = null;
    let source: MediaStreamAudioSourceNode | null = null;
    let analyser: AnalyserNode | null = null;

    try {
      // Create a local AudioContext just for visualization to avoid disrupting the main interpretation Context.
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioContextClass();
      source = audioCtx.createMediaStreamSource(stream);
      analyser = audioCtx.createAnalyser();
      
      analyser.fftSize = 64; // Low FFT size for simple, broad frequency bars
      analyser.smoothingTimeConstant = 0.5;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      let phase = 0; // Animation phase for the "Idle" wave effect

      /**
       * Primary draw loop.
       */
      const draw = () => {
        if (!ctx || !analyser) return;

        animationRef.current = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        const width = parseFloat(canvas.style.width);
        const height = parseFloat(canvas.style.height);
        
        ctx.clearRect(0, 0, width, height);

        // Visual Gradient Theme: Blue -> Purple -> Rose (matches branding)
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, '#60a5fa');
        gradient.addColorStop(0.5, '#c084fc');
        gradient.addColorStop(1, '#fb7185');
        ctx.fillStyle = gradient;

        // Determine activity level to toggle between Active and Idle animation modes.
        let sum = 0;
        for(let i = 0; i < bufferLength; i++) sum += dataArray[i];
        const average = sum / bufferLength;
        const isIdle = average < 5 || isPaused;

        const usableBins = Math.floor(bufferLength * 0.7); // Focus on mid-to-low frequencies where speech lives.
        const barGap = 4;
        const barWidth = (width / usableBins) - barGap;

        phase += 0.08;

        for (let i = 0; i < usableBins; i++) {
          let barHeight;
          if (isIdle) {
            // IDLE ANIMATION: Calculated using a sine wave based on horizontal position and time.
            const wave = Math.sin(phase + (i * 0.5));
            const amplitude = isPaused ? 2 : 4;
            barHeight = 8 + (wave * amplitude);
          } else {
            // ACTIVE ANIMATION: Maps frequency data (0-255) to bar height.
            const value = dataArray[i];
            const percent = value / 255;
            barHeight = Math.max(4, percent * height * 1.5); 
            barHeight = Math.min(height, barHeight);
          }
          
          const x = i * (barWidth + barGap);
          const y = (height - barHeight) / 2; // Vertical centering

          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(x, y, barWidth, barHeight, 50);
          } else {
            ctx.rect(x, y, barWidth, barHeight);
          }
          ctx.fill();
        }
      };

      draw();

    } catch (e) {
      console.error("Visualizer Error:", e);
    }

    return () => {
      resizeObserver.disconnect();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (source) source.disconnect();
      if (analyser) analyser.disconnect();
      if (audioCtx && audioCtx.state !== 'closed') audioCtx.close();
    };
  }, [stream, isPaused]);

  if (!stream) return null;

  return (
    <div ref={containerRef} className={`w-full max-w-lg mx-auto h-20 flex items-center justify-center transition-all duration-500 ${isPaused ? 'opacity-50 grayscale' : 'opacity-90'}`}>
       <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};