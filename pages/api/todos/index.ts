import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import Pusher from 'pusher';
import { getTodos, addTodo } from '../../../src/data/todos';
import { Todo } from '../../../src/types/todo';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const todos = getTodos();
    res.status(200).json(todos);
  } else if (req.method === 'POST') {
    const newTodo: Todo = {
      id: uuidv4(),
      text: req.body.text,
      completed: false,
      creator: req.body.creator,
      doneBy: null,
    };
    addTodo(newTodo);

    pusher.trigger('todo-channel', 'new-todo', newTodo);

    res.status(201).json(newTodo);
  } else {
    res.status(405).end();
  }
};
