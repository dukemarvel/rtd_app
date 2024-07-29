import { useState, useEffect } from 'react';
import axios from 'axios';
import { Todo } from '../types/todo';
import usePusherChannel from '../hooks/usePusherChannel';

const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  
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
    if (newTodo) {
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

  
  const addTodo = (text: string, creator: string) => {
    axios.post('/api/todos', { text, creator })
      .then(response => {
        setTodos(prevTodos => [...prevTodos, response.data]);
      })
      .catch(error => {
        console.error('Failed to add todo:', error);
      });
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
