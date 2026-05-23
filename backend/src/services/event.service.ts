import { eventRepository } from '../repositories/event.repository';

export class EventService {
  async createEvent(data: { title: string; description: string; date: string; location?: string }) {
    if (!data.title || !data.description || !data.date) {
      throw new Error('Title, description, and date are required.');
    }
    
    return eventRepository.create({
      ...data,
      date: new Date(data.date),
    });
  }

  async getAllEvents() {
    return eventRepository.findAll();
  }

  async getEventById(id: string) {
    const event = await eventRepository.findById(id);
    if (!event) throw new Error('Event not found.');
    return event;
  }

  async registerForEvent(userId: string, eventId: string) {
    const event = await eventRepository.findById(eventId);
    if (!event) throw new Error('Event not found.');

    const existingReg = await eventRepository.findRegistration(userId, eventId);
    if (existingReg) throw new Error('Already registered for this event.');

    return eventRepository.registerUser(userId, eventId);
  }
}

export const eventService = new EventService();
