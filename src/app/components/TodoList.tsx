"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';
import TodoItem from './TodoItem';
import { Todo } from '../../types/todo';
import Login from './Login';
import '../styles/TodoList.css';

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (username) {
      const fetchTodos = async () => {
        const response = await axios.get('/api/todos');
        setTodos(response.data);
      };

      fetchTodos();

      const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      });

      const channel = pusher.subscribe('todo-channel');
      channel.bind('new-todo', (newTodo: Todo) => {
        setTodos((prevTodos) => [...prevTodos, newTodo]);
      });

      channel.bind('updated-todo', (updatedTodo: Todo) => {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === updatedTodo.id ? updatedTodo : todo
          )
        );
      });

      channel.bind('deleted-todo', (deletedTodo: Todo) => {
        setTodos((prevTodos) =>
          prevTodos.filter((todo) => todo.id !== deletedTodo.id)
        );
      });

      return () => {
        pusher.unsubscribe('todo-channel');
      };
    }
  }, [username]);

  const handleAddTodo = async () => {
    if (newTodoText && username) {
      await axios.post('/api/todos', {
        text: newTodoText,
        creator: username,
      });
      setNewTodoText('');
    }
  };

  const handleToggle = async (id: string) => {
    const todo = todos.find((todo) => todo.id === id);
    if (todo && username) {
      await axios.put(`/api/todos/${id}`, {
        completed: !todo.completed,
        doneBy: !todo.completed ? username : null,
      });
    }
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`/api/todos/${id}`);
  };

  if (!username) {
    return <Login onLogin={setUsername} />;
  }

  const completedTasks = todos.filter((todo) => todo.completed).length;

  
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  return (
    <div className="container">
      <header>
        <h1>To-Do</h1>
      </header>
      <input
        type="text"
        placeholder="Add a new task"
        value={newTodoText}
        onChange={(e) => setNewTodoText(e.target.value)}
      />
      <button onClick={handleAddTodo}>Add Task</button>
      <div>
        {sortedTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <footer>
        {completedTasks}/{todos.length} tasks completed
      </footer>
    </div>
  );
};

export default TodoList;
