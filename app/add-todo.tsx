'use client';

import { useState } from 'react';

type Todo = {
  id: number;
  title: string;
  done: boolean;
}

type TodosProps = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
}

export default function AddTodo({ todos, setTodos }: TodosProps) {
  const [todoText, setTodoText] = useState('');

  const addTodo = (todo: Todo) => {
    setTodos([...todos, todo])
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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