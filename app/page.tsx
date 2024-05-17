'use client';

import { useState } from 'react';
import AddTodo from './add-todo'
import Todos from './todos'

type Todo = {
  id: number;
  title: string;
  done: boolean;
};


type HeaderProps = {
  title: string
}

function Header({ title }: HeaderProps) {
  return <h1>{title}</h1>
}

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([])

  return (
    <>
      <Header title="Jopet's Todo App" />
      <Todos todos={todos} setTodos={setTodos}/>
      <AddTodo todos={todos} setTodos={setTodos}/>
    </>
  )
}