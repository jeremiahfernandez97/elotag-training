'use client';

import { useState } from 'react';

export default function AddTodo({ addTodo }) {
  const [todoText, setTodoText] = useState('');

  const handleChange = (e) => {
    setTodoText(e.target.value);
  }
  const handleClick = () => {
    addTodo(todoText)
    setTodoText('');
  }

  return (
    <>
        <input 
            type="text"
            value={todoText}
            onChange={handleChange}
        />
        <button onClick={handleClick}>Add todo</button>
    </>
    )
}