import http from 'http';
import app from './app';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize Socket.io
import { setupSockets } from './sockets';

export const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

setupSockets(io);


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
