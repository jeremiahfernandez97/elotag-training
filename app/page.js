'use client';

import { useState } from 'react';
import AddTodo from './add-todo'
import Todos from './todos'

function Header({ title }) {
  return <h1>{title}</h1>
}

export default function HomePage() {
  const [todos, setTodos] = useState([])

  return (
    <>
      <Header title="Jopet's Todo App" />
      <Todos todos={todos} setTodos={setTodos}/>
      <AddTodo todos={todos} setTodos={setTodos}/>
    </>
  )
}