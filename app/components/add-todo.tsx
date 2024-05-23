"use client";

import { useState } from "react";
import { useCallback } from "react";
import { Todo } from "../types/todo";
import { collection, addDoc } from "firebase/firestore";
import { app, db } from "../../firebase/firebase";
import { getAuth } from "firebase/auth";
import {
  FormControl,
  Input,
  Button,
  useToast,
} from '@chakra-ui/react'

const auth = getAuth(app);

type TodosProps = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setMessage:  React.Dispatch<React.SetStateAction<string>>;
};

export default function AddTodo({ todos, setTodos, setMessage }: TodosProps) {
  const [todoText, setTodoText] = useState("");
  const user = auth?.currentUser
  const toast = useToast();

  const addToTodosDb = useCallback(async (todo: Todo) => {
    try {
      const docRef = await addDoc(collection(db, "todos"), todo);
      // setMessage("Document added successfully " + docRef);
      // toast({
      //   title: 'Success!',
      //   description: "Todo added to list",
      //   status: 'success',
      //   duration: 9000,
      //   isClosable: true,
      // })
      setTodos([...todos, todo]);
    } catch (e) {
      // setMessage("Error adding document: " + e);
      toast({
        title: 'Error!',
        description: "" + e,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
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
    <FormControl>
      <Input type="text" value={todoText} onChange={handleChange} />
      <Button onClick={handleClick}>Add todo</Button>
    </FormControl>
  );
}
