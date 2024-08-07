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

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const todos = await db.select().from(todo);
      res.status(200).json(todos);
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
        dateCreated: new Date().toISOString(),
        dateCompleted: null,
      };

      await db.insert(todo).values(newTodo);

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
