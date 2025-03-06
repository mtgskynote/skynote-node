import WebSocket from 'ws';

const ws = new WebSocket('http://localhost:8001/crepe');

ws.on('open', () => {
  console.log('Connected to WebSocket server');

  // Send dummy audio data (1024 random floats)
  const dummyAudio = new Float32Array(1024).fill(Math.random());
  ws.send(dummyAudio);
});

ws.on('message', (data) => {
  console.log('Received:', data.toString());
});

ws.on('close', () => {
  console.log('WebSocket closed');
});

ws.on('error', (err) => {
  console.error('WebSocket error:', err);
});
