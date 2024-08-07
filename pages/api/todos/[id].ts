import { NextApiRequest, NextApiResponse } from 'next';
import Pusher from 'pusher';
import { db } from '@/db/drizzle';
import { todo } from '@/db/schema';
import { eq } from 'drizzle-orm';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query as { id: string };

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  if (req.method === 'GET') {
    try {
      const todos = await db.select().from(todo).where(eq(todo.id, id));
      const todoItem = todos[0];

      if (!todoItem) {
        return res.status(404).json({ error: 'Todo not found' });
      }

      res.status(200).json(todoItem);
    } catch (error) {
      console.error('Error fetching todo:', error);
      res.status(500).json({ error: 'Error fetching todo' });
    }
  } else if (req.method === 'PUT') {
    try {
      const updates = req.body;

      await db.update(todo).set(updates).where(eq(todo.id, id));

      const updatedTodo = await db.select().from(todo).where(eq(todo.id, id));
      const updatedTodoItem = updatedTodo[0];

      pusher.trigger('todo-channel', 'updated-todo', updatedTodoItem);

      res.status(200).json(updatedTodoItem);
    } catch (error) {
      console.error('Error updating todo:', error);
      res.status(500).json({ error: 'Error updating todo' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await db.delete(todo).where(eq(todo.id, id));

      pusher.trigger('todo-channel', 'deleted-todo', { id });

      res.status(204).end();
    } catch (error) {
      console.error('Error deleting todo:', error);
      res.status(500).json({ error: 'Error deleting todo' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};
