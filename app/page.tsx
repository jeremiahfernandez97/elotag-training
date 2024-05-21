"use client";

import SignUp from "./components/sign-up";
import SignIn from "./components/sign-in";
import AddTodo from "./components/add-todo";
import Todos from "./components/todos";
import { Todo } from "./types/todo";
import { useState } from "react";

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [loggedUser, setLoggedUser] = useState("");

  if (loggedUser == "") {
    return (
      <>
        Sign Up form:<br/>
        <SignUp />
        <br/>
        <br/>
        Sign In form:<br/>
        <SignIn setLoggedUser={setLoggedUser}/>
      </>
    );
  } else {
    return (
      <>
        <h3>Welcome, {loggedUser}<br/></h3>
        <Todos todos={todos} setTodos={setTodos} />
        <AddTodo todos={todos} setTodos={setTodos} />
      </>
    );
  }
}
