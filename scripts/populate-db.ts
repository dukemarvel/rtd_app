const { drizzle } = require('drizzle-orm/node-postgres');
const { Client } = require('pg');
const { todo } = require('../src/db/schema');

const client = new Client({
  connectionString: process.env.NEON_DATABASE_URL,
});

const db = drizzle(client);

const sampleTodos = [
  {
    text: 'Task 1',
    completed: false,
    creator: 'user1',
    doneBy: null,
    dateCreated: new Date().toISOString(),
    dateCompleted: null,
  },
  {
    text: 'Task 2',
    completed: false,
    creator: 'user2',
    doneBy: null,
    dateCreated: new Date().toISOString(),
    dateCompleted: null,
  },
  {
    text: 'Task 3',
    completed: true,
    creator: 'user3',
    doneBy: 'user3',
    dateCreated: new Date().toISOString(),
    dateCompleted: new Date().toISOString(),
  },
  {
    text: 'Task 4',
    completed: true,
    creator: 'user4',
    doneBy: 'user4',
    dateCreated: new Date().toISOString(),
    dateCompleted: new Date().toISOString(),
  },
];

async function populateDB() {
  try {
    await client.connect();

    const existingTodos = await db.select().from(todo);

    if (existingTodos.length === 0) {
      for (const todoItem of sampleTodos) {
        await db.insert(todo).values(todoItem);
      }

      console.log('Database populated with sample tasks');
    } else {
      console.log('Database already contains tasks. Skipping population.');
    }
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    await client.end();
  }
}

populateDB();
