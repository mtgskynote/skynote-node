import authRouter from '../routes/authRoutes.js';
import scoreRouter from '../routes/scoreRoutes.js';
import recordingRouter from '../routes/recordingRoutes.js';
import messageRouter from '../routes/messageRoutes.js';
import assignmentRouter from '../routes/assignmentRoutes.js';
import profileRouter from '../routes/profileRoutes.js';

export function setupRoutes(app) {
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/scores', scoreRouter);
  app.use('/api/v1/recordings', recordingRouter);
  app.use('/api/v1/assignments', assignmentRouter);
  app.use('/api/v1/messages', messageRouter);
  app.use('/api/v1/profile', profileRouter);

  app.get('/api/v1', (_, res) => {
    res.send({ msg: 'API' });
  });
}
