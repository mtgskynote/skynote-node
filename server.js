import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import chalk from 'chalk';
import cron from 'node-cron';
import 'express-async-errors';
import { setupWebSocketServer } from './utils/websocket.js';
import { setupMiddleware } from './utils/middleware.js';
import { setupRoutes } from './utils/routes.js';
import { updateRecordings } from './utils/recordingUpdater.js';
import connectDB from './db/connect.js';

// Not part of middleware.js because they need to be imported last
import notFoundMiddleWare from './middleware-jb/not-found.js';
import errorHandlerMiddleWare from './middleware-jb/error-handler.js';

dotenv.config();
const app = express();
const server = createServer(app);

setupWebSocketServer(server);
setupMiddleware(app);
setupRoutes(app);

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, './client-jb/build')));

app.get('*', function (_, response) {
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
      console.log(chalk.green.bold(`Server is listening on port ${port}...\n`))
    );
  } catch (error) {
    console.log(chalk.red.bold('Error starting server: '), error);
  }
};

start();
