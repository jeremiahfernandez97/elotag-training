"use client";

import { useCallback } from "react";
import { Todo } from "../types/todo";

type TodosProps = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export default function Todos({ todos, setTodos }: TodosProps) {
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

  const toggleTodo = useCallback(
    (id: number) => {
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
    },
    [todos, setTodos],
  );

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
