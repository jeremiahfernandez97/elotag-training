'use client';

import { useState } from 'react';

export default function AddTodo({ addTodo, todosLength }) {
  const [todoText, setTodoText] = useState('');

  const handleChange = (e) => {
    setTodoText(e.target.value);
  }
  const handleClick = () => {
    if (todoText.trim() != "") {
        addTodo({"id": todosLength, "title": todoText.trim(), "done" : false})
        setTodoText('');
    }
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