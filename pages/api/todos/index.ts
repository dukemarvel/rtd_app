import { NextApiRequest, NextApiResponse } from 'next';
import Pusher from 'pusher';
import { db } from '@/db/drizzle';
import { todo } from '@/db/schema';
import { v4 as uuidv4 } from 'uuid';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

const isValidDate = (date: any): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

const logTodos = async () => {
  const todos = await db.select().from(todo);
  console.log('Raw todos from the database:', todos);
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      await logTodos(); // Log raw todos

      const todos = await db.select().from(todo);

      // Log raw data before formatting
      console.log('Raw todos before formatting:', todos);

      // Validate and format date fields
      const formattedTodos = todos.map(todo => {
        return {
          ...todo,
          dateCreated: isValidDate(new Date(todo.dateCreated)) ? new Date(todo.dateCreated).toISOString() : null,
          dateCompleted: todo.dateCompleted ? (isValidDate(new Date(todo.dateCompleted)) ? new Date(todo.dateCompleted).toISOString() : null) : null,
        };
      });

      // Log formatted todos
      console.log('Formatted todos:', formattedTodos);

      res.status(200).json(formattedTodos);
    } catch (error) {
      console.error('Error fetching todos:', error);
      res.status(500).json({ error: 'Error fetching todos' });
    }
  } else if (req.method === 'POST') {
    try {
      const { text, creator } = req.body;

      if (!text || !creator) {
        return res.status(400).json({ error: 'Invalid request data' });
      }

      const newTodo = {
        id: uuidv4(),
        text,
        completed: false,
        creator,
        doneBy: null,
        dateCreated: new Date(), // Ensure this is a Date object
        dateCompleted: null,
      };

      // Log the new todo before inserting
      console.log('New todo before insertion:', newTodo);

      // Insert into the database with proper date handling
      await db.insert(todo).values({
        ...newTodo,
      });

      pusher.trigger('todo-channel', 'new-todo', newTodo);

      res.status(201).json(newTodo);
    } catch (error) {
      console.error('Error inserting new todo:', error);
      res.status(500).json({ error: 'Error inserting new todo' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};
