'use client';

import { useState } from 'react';

export default function AddTodo({ todos, setTodos }) {
  const [todoText, setTodoText] = useState('');

  const addTodo = (todo) => {
    setTodos([...todos, todo])
  }
  
  const handleChange = (e) => {
    setTodoText(e.target.value);
  }
  const handleClick = () => {
    if (todoText.trim() != "") {
        addTodo({"id": todos.length, "title": todoText.trim(), "done" : false})
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