import { Request, Response } from 'express';
import prisma from '../config/db';

export class AnnouncementController {
  async getAll(req: Request, res: Response) {
    try {
      const announcements = await prisma.announcement.findMany({
        orderBy: { createdAt: 'desc' }
      });
      res.status(200).json({ success: true, data: announcements });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const announcementController = new AnnouncementController();
