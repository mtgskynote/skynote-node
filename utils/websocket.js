import { WebSocketServer } from 'ws';
import { initializeModel, processAudioFrame } from './pitchService.js';
import chalk from 'chalk';

export function setupWebSocketServer(server) {
  const wss = new WebSocketServer({
    server,
    path: '/crepe',
  });

  initializeModel()
    .then(() => {
      console.log(chalk.blue('Model initialized successfully'));
    })
    .catch((err) => {
      console.error(chalk.red('Model initialization failed:'), err);
      process.exit(1);
    });

  wss.on('connection', (ws) => {
    console.log(chalk.blue.bold('New WebSocket connection'));

    ws.on('message', async (audioChunk) => {
      try {
        const result = await processAudioFrame(audioChunk);
        ws.send(JSON.stringify(result));
      } catch (error) {
        console.error(
          chalk.bgRed.white.bold(' Error processing audio: '),
          error
        );
        ws.send(JSON.stringify({ error: 'Audio processing failed' }));
      }
    });

    ws.on('close', () => {
      console.log(chalk.yellow.bold('WebSocket connection closed'));
    });
  });
}
