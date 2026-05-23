import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get messages for a specific room
router.get('/:roomId', authenticate, async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: { name: true }
        }
      },
      take: 50 // Limit to last 50 messages for performance
    });

    res.json({
      success: true,
      data: messages.map(msg => ({
        id: msg.id,
        text: msg.content,
        sender: msg.sender.name,
        senderId: msg.senderId,
        time: msg.createdAt
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Post a new message to a room
router.post('/:roomId', authenticate, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { content } = req.body;
    // @ts-ignore
    const userId = req.user.id;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    const newMessage = await prisma.message.create({
      data: {
        content: content.trim(),
        roomId,
        senderId: userId
      },
      include: {
        sender: {
          select: { name: true }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: {
        id: newMessage.id,
        text: newMessage.content,
        sender: newMessage.sender.name,
        senderId: newMessage.senderId,
        time: newMessage.createdAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

export default router;
