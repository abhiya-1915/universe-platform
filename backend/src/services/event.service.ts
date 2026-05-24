import { eventRepository } from '../repositories/event.repository';
import { extractTags, generateSummary } from '../utils/nlp';
import { getRecommendedEvents } from '../utils/ml';
import prisma from '../config/db';

export class EventService {
  async getRecommendations(userId: string) {
    // 1. Get user's registered events with their tags AND user's conversational interests
    const [registrations, user] = await Promise.all([
      prisma.registration.findMany({
        where: { userId },
        include: { event: { select: { tags: true } } }
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { interests: true }
      })
    ]);
    
    const userEvents = registrations.map(reg => reg.event);
    
    // Inject conversational interests as a virtual event
    if (user && user.interests && user.interests.length > 0) {
      userEvents.push({ tags: user.interests } as any);
    }

    // 2. Get all upcoming events (or just all events for now)
    const allEvents = await prisma.event.findMany({
      where: {
        date: { gte: new Date() } // Only future events
      },
      select: { id: true, tags: true, title: true, description: true, summary: true, date: true, location: true }
    });

    // 3. Filter out events the user is already registered for
    const registeredEventIds = new Set(registrations.map(r => r.eventId));
    const availableEvents = allEvents.filter(e => !registeredEventIds.has(e.id));

    // 4. Run ML Cosine Similarity
    return getRecommendedEvents(userEvents, availableEvents, 3);
  }

  async createEvent(data: { title: string; description: string; date: string; location?: string }) {
    if (!data.title || !data.description || !data.date) {
      throw new Error('Title, description, and date are required.');
    }
    
    const summary = generateSummary(data.description);
    const tags = extractTags(data.description);

    return eventRepository.create({
      ...data,
      summary,
      tags,
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
