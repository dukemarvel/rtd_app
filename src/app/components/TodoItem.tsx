import React from 'react';
import { Todo } from '../../types/todo';
import '../styles/TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };
  

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span className="task-text">
        {todo.text}
        <span className="meta-text">
          (Created by: {todo.creator} on {formatDate(todo.dateCreated)})
        </span>
        {todo.completed && todo.doneBy && (
          <span className="meta-text">
            {' '}
            - Completed by: {todo.doneBy} on {formatDate(todo.dateCompleted)}
          </span>
        )}
      </span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  );
};

export default TodoItem;
