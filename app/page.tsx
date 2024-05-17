"use client";

import { useState } from "react";
import AddTodo from "./components/add-todo";
import Todos from "./components/todos";
import { Todo } from "./types/todo";

type HeaderProps = {
  title: string;
};

function Header({ title }: HeaderProps) {
  return <h1>{title}</h1>;
}

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);

  return (
    <>
      <Header title="Jopet's Todo App" />
      <Todos todos={todos} setTodos={setTodos} />
      <AddTodo todos={todos} setTodos={setTodos} />
    </>
  );
}
