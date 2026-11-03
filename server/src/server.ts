import 'dotenv/config';

import cors from 'cors';
import express, { Request, Response } from 'express'; //import express from package

import { connectDB } from './config/db.js';
import taskRoutes from './modules/tasks/task.routes';
import authRoutes from './modules/auth/auth.routes';
import cookieParser from 'cookie-parser';

const app = express();

const PORT = process.env.PORT || 5001;

const allowedOrigins = ['http://localhost:5173'];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(cookieParser());

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    message: 'API is running',
  });
});
app.use('/api', taskRoutes);
app.use('/api/auth', authRoutes);

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

//error route: error route doesn't use any url path and is always defined after the server
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'ERROR 404, ROUTE NOT FOUND',
  });
});
