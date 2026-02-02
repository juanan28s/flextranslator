/**
 * capture.worklet.ts
 * 
 * AUDIO WORKLET PROCESSOR
 */

// Define the required interfaces for the Worklet global scope
interface AudioWorkletProcessor {
  readonly port: MessagePort;
  process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean;
}

declare const AudioWorkletProcessor: {
  prototype: AudioWorkletProcessor;
  new (options?: AudioWorkletNodeOptions): AudioWorkletProcessor;
};

declare function registerProcessor(
  name: string,
  processorCtor: (new (options?: AudioWorkletNodeOptions) => AudioWorkletProcessor) & {
    parameterDescriptors?: unknown[];
  }
): void;

class CaptureProcessor extends AudioWorkletProcessor {
  process(inputs: Float32Array[][]) {
    const input = inputs[0];
    if (input && input.length > 0) {
      const channelData = input[0];
      if (channelData.length > 0) {
        this.port.postMessage(channelData);
      }
    }
    return true;
  }
}

registerProcessor('capture-processor', CaptureProcessor);
