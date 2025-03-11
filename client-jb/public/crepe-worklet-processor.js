class CrepeWorkletProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super(options);
    this.originalSampleRate = options.processorOptions.originalSampleRate;
    this.targetSampleRate = 16000;
    this.buffer = new Float32Array(0);
    this.HOP_SIZE = 512; // Process frames every 512 resampled samples (50% overlap)
  }

  resample(input, originalSR) {
    const ratio = originalSR / this.targetSampleRate;
    const outputLength = Math.floor(input.length / ratio);
    const output = new Float32Array(outputLength);

    for (let i = 0; i < outputLength; i++) {
      const index = i * ratio;
      const left = Math.floor(index);
      const right = Math.min(left + 1, input.length - 1);
      const frac = index - left;
      output[i] = input[left] * (1 - frac) + input[right] * frac; // Linear interpolation
    }

    return output;
  }

  process(inputs) {
    const input = inputs[0][0];
    if (!input) return true;

    const resampled = this.resample(input, this.originalSampleRate);

    // Accumulate samples
    this.buffer = this.concat(this.buffer, resampled);

    while (this.buffer.length >= 1024) {
      const chunk = this.buffer.slice(0, 1024);
      this.port.postMessage(chunk.buffer); // Send to main thread
      this.buffer = this.buffer.slice(this.HOP_SIZE);
    }

    return true;
  }

  concat(a, b) {
    const result = new Float32Array(a.length + b.length);
    result.set(a);
    result.set(b, a.length);
    return result;
  }
}

registerProcessor('crepe-worklet-processor', CrepeWorkletProcessor);
