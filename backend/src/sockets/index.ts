import { Server, Socket } from 'socket.io';
import prisma from '../config/db';
import { verifyToken } from '../utils/jwt';

export const setupSockets = (io: Server) => {
  // Middleware to authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));
    try {
      const decoded = verifyToken(token);
      socket.data.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}, UserID: ${socket.data.user.id}`);

    // Join personal room for private notifications
    socket.join(socket.data.user.id);

    // Chat Events
    socket.on('join_event_chat', (eventId: string) => {
      socket.join(`event_${eventId}`);
      console.log(`User ${socket.data.user.id} joined chat for event ${eventId}`);
    });

    socket.on('send_message', async (data: { eventId: string; content: string }) => {
      try {
        // Save to DB
        const message = await prisma.message.create({
          data: {
            content: data.content,
            roomId: data.eventId,
            senderId: socket.data.user.id,
          },
          include: { sender: { select: { name: true, username: true } } },
        });

        // Broadcast to event room
        io.to(`event_${data.eventId}`).emit('new_message', { ...message, eventId: data.eventId });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
