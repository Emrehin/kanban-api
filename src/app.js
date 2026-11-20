import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes.js';
import boardRoutes from './routes/boardRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { authenticateToken } from './middlewares/authMiddleware.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' },
});

app.set('io', io);
app.use(express.json());
app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log(`WebSocket istemcisi bağlandı: ${socket.id}`);
});

app.use('/api/auth', authRoutes);
app.use('/api/boards', authenticateToken, boardRoutes);
app.use('/api/tasks', authenticateToken, taskRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde aktif.`);
});