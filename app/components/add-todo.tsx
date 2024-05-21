"use client";

import { useState } from "react";
import { useCallback } from "react";
import { Todo } from "../types/todo";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

type TodosProps = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  loggedUser: string;
  setMessage:  React.Dispatch<React.SetStateAction<string>>;
};

export default function AddTodo({ todos, setTodos, loggedUser, setMessage }: TodosProps) {
  const [todoText, setTodoText] = useState("");

  async function addToTodosDb(todo: Todo) {
    try {
      const docRef = await addDoc(collection(db, "todos"), todo);
      setMessage("Document added successfully " + docRef);
      setTodos([...todos, todo]);
    } catch (e) {
      setMessage("Error adding document: " + e);
    }
  }

  const addTodo = useCallback(
    (todo: Todo) => {
      addToTodosDb(todo);
    },
    [todos, setTodos, addToTodosDb],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoText(e.target.value);
  };
  const handleClick = useCallback(() => {
    if (todoText.trim() != "") {
      addTodo({ id: todos.length, title: todoText.trim(), done: false, user: loggedUser});
      setTodoText("");
    }
  }, [addTodo, todoText, todos.length, loggedUser]);

  return (
    <>
      <input type="text" value={todoText} onChange={handleChange} />
      <button onClick={handleClick}>Add todo</button>
    </>
  );
}
