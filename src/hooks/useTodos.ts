import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Todo } from '../types/todo';
import usePusherChannel from './usePusherChannel';

const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const localTodoIds = useRef<string[]>([]);

  useEffect(() => {
    axios.get('/api/todos')
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => {
        console.error('Failed to fetch todos:', error);
      });
  }, []);

  const newTodo = usePusherChannel('todo-channel', 'new-todo');
  const updatedTodo = usePusherChannel('todo-channel', 'updated-todo');
  const deletedTodo = usePusherChannel('todo-channel', 'deleted-todo');

  useEffect(() => {
    if (newTodo && !localTodoIds.current.includes(newTodo.id)) {
      setTodos(prevTodos => [...prevTodos, newTodo]);
    }
  }, [newTodo]);

  useEffect(() => {
    if (updatedTodo) {
      setTodos(prevTodos => prevTodos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo));
    }
  }, [updatedTodo]);

  useEffect(() => {
    if (deletedTodo) {
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== deletedTodo.id));
    }
  }, [deletedTodo]);

  const addTodo = async (text: string, creator: string) => {
    const tempId = uuidv4(); // Generate a temporary UUID for the new task
    const newTodoData = {
      id: tempId,
      text,
      creator,
      dateCreated: new Date().toISOString(),
    };

    try {
      const response = await axios.post('/api/todos', newTodoData);
      setTodos(prevTodos => [...prevTodos, response.data]);

      // Track the local task by adding its ID to the localTodoIds array
      localTodoIds.current.push(response.data.id);
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    axios.put(`/api/todos/${id}`, updates)
      .then(response => {
        setTodos(prevTodos => prevTodos.map(todo => todo.id === id ? response.data : todo));
      })
      .catch(error => {
        console.error('Failed to update todo:', error);
      });
  };

  const deleteTodo = (id: string) => {
    axios.delete(`/api/todos/${id}`)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(error => {
        console.error('Failed to delete todo:', error);
      });
  };

  return { todos, addTodo, updateTodo, deleteTodo };
};

export default useTodos;
