import { Todo } from '../types/todo';

let todos: Todo[] = [
  { id: '1', text: 'Sample Task 1', completed: false, creator: 'User1' },
  { id: '2', text: 'Sample Task 2', completed: false, creator: 'User2' },
  { id: '3', text: 'Sample Task 3', completed: false, creator: 'User1' },
  { id: '4', text: 'Sample Task 4', completed: false, creator: 'User2' },
];

export const getTodos = () => todos;

export const addTodo = (todo: Todo) => {
  todos.push(todo);
};

export const updateTodo = (id: string, updatedFields: Partial<Todo>) => {
  const todoIndex = todos.findIndex(todo => todo.id === id);
  if (todoIndex !== -1) {
    todos[todoIndex] = { ...todos[todoIndex], ...updatedFields };
  }
};

export const deleteTodo = (id: string) => {
  todos = todos.filter(todo => todo.id !== id);
};
