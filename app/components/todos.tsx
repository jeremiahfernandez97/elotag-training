"use client";

import { useCallback } from "react";
import { Todo } from "../types/todo";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../firebase/firebase";
import { collection, query, where, getDocs, deleteDoc } from "firebase/firestore";

type TodosProps = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export default function Todos({ todos, setTodos }: TodosProps) {
  const user = auth?.currentUser;

  const deleteTodo = useCallback(async (id: number) => {
    const todoRef = collection(db, "todos");
    const q = query(todoRef, where("user", "==", user?.email), where("id", "==", id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (docSnapshot) => {
      const todoDocRef = doc(db, "todos", docSnapshot.id);
      await deleteDoc(todoDocRef);   
    });
  },[user?.email]);

  const toggleTodo = useCallback(async (id: number) => {
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
  },[user?.email]);

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
