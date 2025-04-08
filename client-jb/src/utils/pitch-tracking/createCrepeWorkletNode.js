export async function createCrepeWorkletNode(
  audioContext,
  pitchCallback,
  pitchVectorCallback
) {
  try {
    await audioContext.audioWorklet.addModule('/crepe-worklet-processor.js');
  } catch (error) {
    console.error('Failed to load worklet module:', error);
    return null;
  }

  const workletNode = new AudioWorkletNode(
    audioContext,
    'crepe-worklet-processor',
    {
      processorOptions: {
        originalSampleRate: audioContext.sampleRate,
      },
    }
  );

  // Create WebSocket in main thread
  const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

  ws.onopen = () => console.log('WebSocket connected');
  ws.onerror = (err) => console.error('WebSocket error:', err);
  ws.onmessage = (event) => {
    const { pitch, confidence, vector } = JSON.parse(event.data);
    pitchCallback?.({ pitch, confidence });
    pitchVectorCallback?.(new Float32Array(vector));
  };

  // Receive resampled audio data from the worklet and send to WebSocket
  workletNode.port.onmessage = (event) => {
    ws.send(event.data);
  };

  return workletNode;
}
