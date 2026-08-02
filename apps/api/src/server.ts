import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/db';
import { DEFAULT_PORT, DEFAULT_CLIENT_URL } from './constants';

declare global {
  var io: Server | undefined;
}

dotenv.config();

const PORT = process.env.PORT || DEFAULT_PORT;

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || DEFAULT_CLIENT_URL,
    credentials: true,
  },
});

globalThis.io = io;

io.on('connection', (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);

  socket.on('join-kitchen', () => {
    socket.join('kitchen');
    console.log(`${socket.id} joined kitchen room`);
  });

  socket.on('leave-kitchen', () => {
    socket.leave('kitchen');
    console.log(`${socket.id} left kitchen room`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

const startServer = async () => {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
    return { httpServer, io };
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

export { httpServer, io, startServer };
