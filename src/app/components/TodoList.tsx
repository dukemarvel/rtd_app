"use client";
import React, { useState } from 'react';
import TodoItem from './TodoItem';
import useTodos  from '@/hooks/useTodos';
import Login from './Login';
import '../styles/TodoList.css';

const TodoList = () => {
  const { todos, addTodo, updateTodo, deleteTodo } = useTodos();
  const [newTodoText, setNewTodoText] = useState('');
  const [username, setUsername] = useState<string | null>(null);

  const handleAddTodo = () => {
    if (newTodoText && username) {
      addTodo(newTodoText, username);
      setNewTodoText('');
    }
  };

  const handleToggle = (id: string) => {
    const todo = todos.find((todo) => todo.id === id);
    if (todo && username) {
      updateTodo(id, {
        completed: !todo.completed,
        doneBy: !todo.completed ? username : null,
        dateCompleted: !todo.completed ? new Date().toISOString() : null,
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteTodo(id);
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
