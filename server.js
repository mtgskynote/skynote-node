import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cron from 'node-cron'; // Import node-cron
import { updateRecordings } from './utils/recordingUpdater.js'; // Import the cron job logic

dotenv.config();
import 'express-async-errors'; // this is a package that allows us to use async await in express
import morgan from 'morgan'; // this is a package that allows us to log the requests in the console

// db and authenticate user
import connectDB from './db/connect.js';

//routers
import authRouter from './routes/authRoutes.js';
import scoreRouter from './routes/scoreRoutes.js';
import recordingRouter from './routes/recordingRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import assignmentRouter from './routes/assignmentRoutes.js';
import profileRouter from './routes/profileRoutes.js';

// pitch tracking
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import * as tf from '@tensorflow/tfjs-node';

// middleware
import notFoundMiddleWare from './middleware-jb/not-found.js';
import errorHandlerMiddleWare from './middleware-jb/error-handler.js'; // best practice to import it at the last

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
const server = createServer(app);

const wss = new WebSocketServer({
  server,
  path: '/crepe',
});

const modelPath = 'file://./crepeModel/model.json';
let model;

async function loadModel() {
  try {
    model = await tf.loadLayersModel(modelPath);
    console.log('Model loaded successfully');
  } catch (err) {
    console.error('Error loading model:', err);
  }
}

loadModel();

const cent_mapping = tf.add(
  tf.linspace(0, 7180, 360),
  tf.tensor(1997.3794084376191)
);

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  ws.on('message', async (audioChunk) => {
    try {
      // console.log('Audio chunk received byteLength: ', audioChunk.byteLength);
      // console.log('Audio chunk type: ', audioChunk.constructor.name);
      const arrayBuffer = audioChunk.buffer.slice(
        audioChunk.byteOffset,
        audioChunk.byteOffset + audioChunk.length
      );
      const frame = new Float32Array(arrayBuffer);

      // Zero-mean normalization (same as your old code)
      const zeromean = tf.sub(frame, tf.mean(frame));
      const framestd = tf.tensor(
        tf.norm(zeromean).dataSync() / Math.sqrt(1024)
      ); // Use the norm for standard deviation
      const normalized = tf.div(zeromean, framestd);

      // Reshape the normalized frame to match the input shape of your model
      const input = normalized.reshape([1, 1024]);
      const activation = model.predict(input).reshape([360]);

      // The confidence of voicing activity and the argmax bin (same as your old code)
      const confidence = activation.max().dataSync()[0];
      const center = activation.argMax().dataSync()[0];

      // Slice the local neighborhood around the argmax bin
      const start = Math.max(0, center - 4);
      const end = Math.min(360, center + 5);
      const weights = activation.slice([start], [end - start]);
      const cents = cent_mapping.slice([start], [end - start]);

      // Take the local weighted average to get the predicted pitch
      const products = tf.mul(weights, cents);
      const productSum = products.dataSync().reduce((a, b) => a + b, 0);
      const weightSum = weights.dataSync().reduce((a, b) => a + b, 0);
      const predicted_cent = productSum / weightSum;

      // Convert cents to Hz (same as your old code)
      const predicted_hz = 10 * Math.pow(2, predicted_cent / 1200.0);

      // console.log('Predicted pitch:', predicted_hz, 'Hz');

      ws.send(
        JSON.stringify({
          pitch: predicted_hz,
          confidence: confidence,
          vector: Array.from(activation.dataSync()),
        })
      );
    } catch (error) {
      console.error('Error processing audio:', error);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

app.use(express.json({ limit: '16mb' })); // For JSON payloads
app.use(express.urlencoded({ limit: '16mb', extended: true })); // For URL-encoded data

// Middleware to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Middleware to parse application/json
app.use(bodyParser.json());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev')); // morgan is a middleware that allows us to log the requests in the console
}

// since authrouter contains routes that are post methods
// as json we can use a built-in method from express we can invoke it
// to make json values available in the code.

// app.use is a method that allows us to use middleware
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, './client-jb/build')));

app.get('/api/v1', (req, res) => {
  res.send({ msg: 'API' });
});

// app.use is a method that allows us to use middleware
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/scores', scoreRouter);
app.use('/api/v1/recordings', recordingRouter);
app.use('/api/v1/assignments', assignmentRouter);
app.use('/api/v1/messages', messageRouter);
app.use('/api/v1/profile', profileRouter);

// only when ready to deploy
app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, './client-jb/build', 'index.html'));
});

app.use(notFoundMiddleWare);
app.use(errorHandlerMiddleWare);

// Schedule the task to run every day at midnight
cron.schedule('0 0 * * *', updateRecordings);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    server.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log('error in start', error);
  }
};

start();
