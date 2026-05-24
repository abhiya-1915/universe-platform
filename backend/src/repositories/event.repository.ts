import prisma from '../config/db';
import { Prisma } from '@prisma/client';

export class EventRepository {
  async create(data: Prisma.EventUncheckedCreateInput) {
    return prisma.event.create({ data });
  }

  async findAll() {
    return prisma.event.findMany({
      orderBy: { date: 'asc' },
    });
  }

  async findById(id: string) {
    return prisma.event.findUnique({
      where: { id },
      include: { registrations: true },
    });
  }

  async registerUser(userId: string, eventId: string) {
    return prisma.registration.create({
      data: {
        userId,
        eventId,
      },
    });
  }

  async findRegistration(userId: string, eventId: string) {
    return prisma.registration.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });
  }
}

export const eventRepository = new EventRepository();
