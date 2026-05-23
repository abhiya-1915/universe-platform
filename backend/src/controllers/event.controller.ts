import { Request, Response } from 'express';
import { eventService } from '../services/event.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class EventController {
  async createEvent(req: Request, res: Response) {
    try {
      const result = await eventService.createEvent(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAllEvents(req: Request, res: Response) {
    try {
      const result = await eventService.getAllEvents();
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getEventById(req: Request, res: Response) {
    try {
      const result = await eventService.getEventById(req.params.id);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async registerForEvent(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Not authorized' });
      const result = await eventService.registerForEvent(req.user.id, req.params.id);
      res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

export const eventController = new EventController();
