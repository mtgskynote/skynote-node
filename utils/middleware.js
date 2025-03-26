import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';

export function setupMiddleware(app) {
  app.use(express.json({ limit: '16mb' })); // For JSON payloads
  app.use(express.urlencoded({ limit: '16mb', extended: true })); // For URL-encoded data

  // Middleware to parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));
  // Middleware to parse application/json
  app.use(bodyParser.json());

  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev')); // morgan is a middleware that allows us to log the requests in the console
  }
}
