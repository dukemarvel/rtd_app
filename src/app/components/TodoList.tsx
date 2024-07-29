"use client";
import React, { useState } from 'react';
import TodoItem from './TodoItem';
import useTodos from '../../hooks/useTodos';

const TodoList: React.FC = () => {
  const { todos, addTodo, updateTodo, deleteTodo } = useTodos();
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoUser, setNewTodoUser] = useState('');

  const handleAddTodo = () => {
    if (newTodoText.trim() !== '' && newTodoUser.trim() !== '') {
      addTodo(newTodoText, newTodoUser);
      setNewTodoText('');
      setNewTodoUser(''); 
    }
  };

  const handleToggleTodo = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      const doneBy = !todo.completed ? newTodoUser : undefined;
      updateTodo(id, { completed: !todo.completed, doneBy });
    }
  };

  const handleDeleteTodo = (id: string) => {
    deleteTodo(id);
  };

  return (
    <div>
      <h1>Real-Time To-Do List</h1>
      <input
        type="text"
        value={newTodoText}
        onChange={(e) => setNewTodoText(e.target.value)}
        placeholder="Add a new task"
      />
      <input
        type="text"
        value={newTodoUser}
        onChange={(e) => setNewTodoUser(e.target.value)}
        placeholder="Enter your username"
      />
      <button onClick={handleAddTodo}>Add Task</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <TodoItem todo={todo} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
