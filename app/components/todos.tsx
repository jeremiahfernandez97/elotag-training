"use client";

import { useCallback } from "react";
import { Todo } from "../types/todo";
import { doc, updateDoc } from "firebase/firestore";
import { app, db } from "../../firebase/firebase";
import { collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { getAuth, } from "firebase/auth";

const auth = getAuth(app);

type TodosProps = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export default function Todos({ todos, setTodos }: TodosProps) {
  const user = auth?.currentUser;

  const deleteTodo = useCallback(async (id: number) => {
    // update db
    const todoRef = collection(db, "todos");
    const q = query(todoRef, where("user", "==", user?.email), where("id", "==", id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (docSnapshot) => {
      const todoDocRef = doc(db, "todos", docSnapshot.id);
      await deleteDoc(todoDocRef);   
    });

    // update state
    let newTodos: Todo[] = [];
    todos.forEach((todo) => {
      if (todo.id != id) {
        newTodos.push(todo);
      }
    });
    setTodos(newTodos);
  },[user?.email, todos, setTodos]);

  const toggleTodo = useCallback(async (id: number) => {
    // update db
    const todoRef = collection(db, "todos");
    const q = query(todoRef, where("user", "==", user?.email), where("id", "==", id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (docSnapshot) => {
      const todoDocRef = doc(db, "todos", docSnapshot.id);
      
      if (docSnapshot.data().done === false) {
        await updateDoc(todoDocRef, {
          done: true,
        });
      } else {
        await updateDoc(todoDocRef, {
          done: false,
        });
      }
    });      

    // update state
    let newTodos = [...todos];
    newTodos.forEach((todo) => {
      if (todo.id == id) {
        if (todo.done == false) {
          todo.done = true;
        } else {
          todo.done = false;
        }
      }
    });
    setTodos(newTodos);
  },[user?.email, todos, setTodos]);

return (
  <ul>
    {todos.length != 0 ? (
      todos.map((todo) => (
        <li key={todo.id}>
          <span
            style={{
              textDecoration: todo.done == true ? "line-through" : "none",
              cursor: "pointer",
            }}
            onClick={() => toggleTodo(todo.id)}
          >
            {todo.title} &nbsp;
          </span>
          <span
            style={{
              color: "red",
              cursor: "pointer",
            }}
            onClick={() => deleteTodo(todo.id)}
          >
            🗑
          </span>
        </li>
      ))
    ) : (
      <p>no todos</p>
    )}
  </ul>
);
}
