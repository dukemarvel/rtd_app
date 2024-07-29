import { NextApiRequest, NextApiResponse } from 'next';
import Pusher from 'pusher';
import { getTodos, updateTodo, deleteTodo } from '../../../src/data/todos';
import { Todo } from '../../../src/types/todo';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export default (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const todos = getTodos();
    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (todoIndex !== -1) {
      const updatedFields = req.body;
      if (updatedFields.completed === true) {
        updatedFields.doneBy = req.body.doneBy; 
      }
      const updatedTodo = { ...todos[todoIndex], ...updatedFields };
      updateTodo(id as string, updatedFields);
      pusher.trigger('todo-channel', 'updated-todo', updatedTodo);
      res.status(200).json(updatedTodo);
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } else if (req.method === 'DELETE') {
    const todos = getTodos();
    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (todoIndex !== -1) {
      deleteTodo(id as string);
      const deletedTodo = todos[todoIndex];
      pusher.trigger('todo-channel', 'deleted-todo', deletedTodo);
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
