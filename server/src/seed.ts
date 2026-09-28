import 'dotenv/config';

import { connectDB } from './config/db.js';
import { Task } from './models/task.js';

const tasks = [
  {
    title: 'FinTech Website Update',
    description:
      'Update the landing page and improve the responsiveness across different screen sizes.',
    priority: 'Urgent',
    completed: false,
  },
  {
    title: 'Agro Website Update',
    description:
      'Review the Agro website and implement the remaining UI improvements.',
    priority: 'Important',
    completed: false,
  },
  {
    title: 'Fix Authentication Flow',
    description:
      'Review the login and registration flow and handle validation errors.',
    priority: 'Urgent',
    completed: false,
  },
  {
    title: 'Update Dashboard',
    description: 'Add the latest statistics and improve the dashboard layout.',
    priority: 'Important',
    completed: true,
  },
];

async function seedDatabase() {
  try {
    await connectDB();

    await Task.deleteMany();

    await Task.insertMany(tasks);

    console.log('Mock tasks seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Failed to seed database:', error);

    process.exit(1);
  }
}

seedDatabase();
