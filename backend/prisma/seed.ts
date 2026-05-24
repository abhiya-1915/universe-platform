import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Synthetic Data Generation for ML...');

  // Clear existing data (in order of relations)
  await prisma.message.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
  await prisma.announcement.deleteMany();

  // 1. Generate Fake Users
  console.log('👥 Generating users...');
  const users = [];
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  for (let i = 1; i <= 20; i++) {
    const user = await prisma.user.create({
      data: {
        name: `Student ${i}`,
        email: `student${i}@presidency.edu`,
        username: `student${i}`,
        passwordHash: hashedPassword,
        role: 'USER',
      }
    });
    users.push(user);
  }

  // Add an admin
  const admin = await prisma.user.create({
    data: {
      name: 'DSA Admin',
      email: 'admin@presidency.edu',
      username: 'dsa_admin',
      passwordHash: hashedPassword,
      role: 'ADMIN',
    }
  });

  // 2. Generate Events for DSA Clubs
  console.log('📅 Generating Presidency DSA events...');
  
  const clubCategories = [
    {
      name: 'Photography',
      tags: ['photography', 'art', 'creative', 'camera'],
      events: [
        { title: 'Campus Golden Hour Walk', desc: 'Join us for an evening walk around campus to capture the perfect golden hour shots. Bring your DSLR or just your phone!' },
        { title: 'Portrait Lighting Workshop', desc: 'Learn the fundamentals of studio lighting and portrait photography. We will cover key, fill, and rim lighting.' },
        { title: 'Annual Photo Exhibition', desc: 'Showcase your best shots from the semester. Open gallery for all students and faculty to attend.' },
        { title: 'Street Photography Basics', desc: 'A hands-on session focusing on candid street photography techniques and ethics in urban environments.' },
      ]
    },
    {
      name: 'Dance',
      tags: ['dance', 'music', 'fitness', 'performance'],
      events: [
        { title: 'Hip Hop Fundamentals', desc: 'Beginner-friendly hip hop workshop. Learn basic grooves, isolations, and a short choreography routine.' },
        { title: 'Classical Fusion Night', desc: 'A beautiful evening showcasing Indian classical dance blended with contemporary styles.' },
        { title: 'Flash Mob Rehearsal', desc: 'Secret rehearsal for the upcoming campus fest flash mob. Only registered members get the location!' },
        { title: 'Salsa Bootcamp', desc: 'Partner up and learn the basics of Salsa dancing. No prior experience required.' },
      ]
    },
    {
      name: 'Multimedia',
      tags: ['design', 'video', 'editing', 'creative', 'multimedia'],
      events: [
        { title: 'Premiere Pro Masterclass', desc: 'Deep dive into video editing workflows, color grading, and audio mixing using Adobe Premiere Pro.' },
        { title: 'UI/UX Design Sprint', desc: 'A 4-hour design sprint where we will prototype a new campus app using Figma.' },
        { title: 'VFX for Beginners', desc: 'Learn how to create stunning visual effects and motion graphics using After Effects.' },
        { title: 'Podcast Creation 101', desc: 'Everything you need to know about starting a podcast: scripting, recording, and publishing.' },
      ]
    },
    {
      name: 'Robotics',
      tags: ['robotics', 'engineering', 'tech', 'coding', 'hardware'],
      events: [
        { title: 'Arduino Basics', desc: 'Introduction to microcontrollers. We will build a simple line-following robot prototype.' },
        { title: 'Drone Racing League', desc: 'Campus drone racing competition. Build, program, and fly your custom drones on our obstacle course.' },
        { title: 'AI in Robotics Seminar', desc: 'Guest lecture on how Machine Learning and Computer Vision are shaping modern autonomous robots.' },
        { title: 'IoT Hackathon', desc: '24-hour hardware hackathon. Build smart devices to solve real campus problems using IoT sensors.' },
      ]
    }
  ];

  const createdEvents = [];
  
  for (const category of clubCategories) {
    for (let i = 0; i < category.events.length; i++) {
      const eventData = category.events[i];
      const event = await prisma.event.create({
        data: {
          title: eventData.title,
          description: eventData.desc,
          summary: eventData.desc.substring(0, 50) + '...', // Simple summary for seeded data
          tags: category.tags,
          date: new Date(Date.now() + (i + 1) * 3 * 24 * 60 * 60 * 1000), // Spread dates out
          location: `${category.name} Lab`,
        }
      });
      createdEvents.push({ ...event, category: category.name });
    }
  }

  // 3. Generate Correlated Registrations (The ML Data Pattern)
  console.log('🔗 Generating correlated registration patterns for ML...');
  
  // Pattern 1: Techies (Like Robotics + Multimedia)
  const techies = users.slice(0, 8);
  for (const user of techies) {
    const techEvents = createdEvents.filter(e => e.category === 'Robotics' || e.category === 'Multimedia');
    // Register for 3-5 random tech events
    const numToRegister = Math.floor(Math.random() * 3) + 3;
    const shuffled = techEvents.sort(() => 0.5 - Math.random()).slice(0, numToRegister);
    
    for (const event of shuffled) {
      await prisma.registration.create({
        data: { userId: user.id, eventId: event.id }
      });
    }
  }

  // Pattern 2: Creatives (Like Photography + Dance + Multimedia)
  const creatives = users.slice(8, 16);
  for (const user of creatives) {
    const creativeEvents = createdEvents.filter(e => e.category === 'Photography' || e.category === 'Dance' || e.category === 'Multimedia');
    const numToRegister = Math.floor(Math.random() * 4) + 3;
    const shuffled = creativeEvents.sort(() => 0.5 - Math.random()).slice(0, numToRegister);
    
    for (const event of shuffled) {
      await prisma.registration.create({
        data: { userId: user.id, eventId: event.id }
      });
    }
  }

  // Pattern 3: Random Explorers (Like a bit of everything)
  const explorers = users.slice(16, 20);
  for (const user of explorers) {
    const numToRegister = Math.floor(Math.random() * 5) + 2;
    const shuffled = createdEvents.sort(() => 0.5 - Math.random()).slice(0, numToRegister);
    
    for (const event of shuffled) {
      await prisma.registration.create({
        data: { userId: user.id, eventId: event.id }
      });
    }
  }

  console.log('✅ Synthetic Data Generation Complete!');
  console.log(`Created 21 users, ${createdEvents.length} events, and rich registration patterns.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
