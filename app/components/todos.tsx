"use client";

import { useCallback } from "react";
import { Todo } from "../types/todo";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

type TodosProps = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export default function Todos({ todos, setTodos }: TodosProps) {
  const user = auth?.currentUser;
  const deleteTodo = useCallback(
    (id: number) => {
      let newTodos: Todo[] = [];
      todos.forEach((todo) => {
        if (todo.id != id) {
          newTodos.push(todo);
        }
      });
      setTodos(newTodos);
    },
    [todos, setTodos],
  );

  const toggleTodo = useCallback((id: number) => {
      const todoRef = collection(db, "todos");
      const q = query(todoRef, where("user", "==", user?.email), where("id", "==", id));
      // setTodos(newTodos);
      console.log(q);
    },[]);

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
