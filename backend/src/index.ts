import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { prisma } from './lib/prisma';
import authRouter from './routes/auth';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Authentication Routes
app.use('/api/auth', authRouter);

// Import route handlers
import usersRouter from './routes/users';
import showsRouter from './routes/shows';
import messagesRouter from './routes/messages';
import commentsRouter from './routes/comments';
import subscriptionsRouter from './routes/subscriptions';
import transactionsRouter from './routes/transactions';

// Register route handlers
app.use('/api/users', usersRouter);
app.use('/api/shows', showsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/subscriptions', subscriptionsRouter);
app.use('/api/transactions', transactionsRouter);

// Start server
const port = typeof PORT === 'string' ? parseInt(PORT, 10) : PORT;
app.listen(port, '0.0.0.0', () => {
  console.log(`📡 VERTIKAL Backend live at http://localhost:${port}`);
});
