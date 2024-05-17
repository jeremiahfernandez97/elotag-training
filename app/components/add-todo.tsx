"use client";

import { useState } from "react";
import { useCallback } from "react";
import { Todo } from "../types/todo";

type TodosProps = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export default function AddTodo({ todos, setTodos }: TodosProps) {
  const [todoText, setTodoText] = useState("");

  const addTodo = useCallback(
    (todo: Todo) => {
      setTodos([...todos, todo]);
    },
    [todos, setTodos],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoText(e.target.value);
  };
  const handleClick = useCallback(() => {
    if (todoText.trim() != "") {
      addTodo({ id: todos.length, title: todoText.trim(), done: false });
      setTodoText("");
    }
  }, [addTodo, todoText, todos.length]);

  return (
    <>
      <input type="text" value={todoText} onChange={handleChange} />
      <button onClick={handleClick}>Add todo</button>
    </>
  );
}
