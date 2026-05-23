import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing (optional, careful in prod)
  await prisma.registration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.announcement.deleteMany();

  // Create some Announcements
  await prisma.announcement.createMany({
    data: [
      {
        title: 'Welcome to UniVerse! 🚀',
        content: 'We are thrilled to launch the new campus event platform. Explore events, join clubs, and connect with peers!',
      },
      {
        title: 'Hackathon 2026 Registrations Open',
        content: 'The annual campus hackathon is back! Form a team of 4 and build the future. Prizes worth $10,000.',
      },
      {
        title: 'Campus Maintenance Notice',
        content: 'The main library will be closed this weekend for electrical maintenance. Plan your study sessions accordingly.',
      }
    ]
  });

  // Create some Events
  const events = [
    {
      title: 'Tech Symposium 2026',
      description: 'Join industry leaders for a day of talks on AI, Web3, and the future of software engineering. Lunch provided.',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      location: 'Main Auditorium',
    },
    {
      title: 'Startup Pitch Night',
      description: 'Watch 10 student startups pitch their ideas to real venture capitalists. Network with founders afterwards.',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      location: 'Innovation Hub',
    },
    {
      title: 'Midnight Coding & Pizza',
      description: 'A casual meetup for developers to work on side projects, eat pizza, and hang out. All skill levels welcome!',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      location: 'CS Building, Room 402',
    },
    {
      title: 'Career Fair Prep Workshop',
      description: 'Learn how to craft the perfect resume and ace your technical interviews. Hosted by the Career Center.',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      location: 'Virtual (Zoom)',
    }
  ];

  for (const event of events) {
    await prisma.event.create({ data: event });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
