// server.ts
import express from 'express';
import { db } from './src/db/drizzle';
import { todosTable } from '/models/Todo';
import { eq } from 'drizzle-orm';
import { Todo } from '@/types/Todo';

const app = express();
app.use(express.json());

app.get('/api/todos', async (req, res) => {
  const todos = await db.select().from(todosTable).all();
  res.json(todos);
});

app.post('/api/todos', async (req, res) => {
  const newTodo: Todo = req.body;
  await db.insert(todosTable).values(newTodo).run();
  res.status(201).json(newTodo);
});

app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const updatedTodo: Todo = req.body;
  await db.update(todosTable).set(updatedTodo).where(eq(todosTable.id, Number(id))).run();
  res.json(updatedTodo);
});

app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  await db.delete(todosTable).where(eq(todosTable.id, Number(id))).run();
  res.status(204).send();
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
