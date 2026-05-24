import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Routes
import authRoutes from './routes/auth.routes';
import eventRoutes from './routes/event.routes';
import announcementRoutes from './routes/announcement.routes';
import chatRoutes from './routes/chat';
import notificationRoutes from './routes/notification.routes';

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);

export default app;
