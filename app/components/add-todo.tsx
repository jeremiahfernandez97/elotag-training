"use client";

import { useState } from "react";
import { useCallback } from "react";
import { Todo } from "../types/todo";
import { collection, addDoc } from "firebase/firestore";
import { app, db } from "../../firebase/firebase";
import { getAuth } from "firebase/auth";

const auth = getAuth(app);

type TodosProps = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setMessage:  React.Dispatch<React.SetStateAction<string>>;
};

export default function AddTodo({ todos, setTodos, setMessage }: TodosProps) {
  const [todoText, setTodoText] = useState("");
  const user = auth?.currentUser

  const addToTodosDb = useCallback(async (todo: Todo) => {
    try {
      const docRef = await addDoc(collection(db, "todos"), todo);
      setMessage("Document added successfully " + docRef);
      setTodos([...todos, todo]);
    } catch (e) {
      setMessage("Error adding document: " + e);
    }
  }, [setMessage, setTodos, todos])

  const addTodo = useCallback(
    (todo: Todo) => {
      addToTodosDb(todo);
    },
    [addToTodosDb],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoText(e.target.value);
  };
  const handleClick = useCallback(() => {
    if (todoText.trim() != "") {
      addTodo({ id: todos.length, title: todoText.trim(), done: false, user: user?.email ?? ""});
      setTodoText("");
    }
  }, [addTodo, todoText, todos.length, user?.email]);

  return (
    <>
      <input type="text" value={todoText} onChange={handleChange} />
      <button onClick={handleClick}>Add todo</button>
    </>
  );
}
