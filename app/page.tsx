"use client";

import SignUp from "./components/sign-up";
import SignIn from "./components/sign-in";
import AddTodo from "./components/add-todo";
import Todos from "./components/todos";
import { Todo } from "./types/todo";
import { useState, useCallback } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";


export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loggedUser, setLoggedUser] = useState("");
  const [message, setMessage] = useState("");

  const q = query(collection(db, "todos"), where("user", "==", loggedUser));

  const getQuerySnapshot = useCallback(async () => {
    const querySnapshot = await getDocs(q);
    let queriedTodos: Todo[] = [];
    querySnapshot.forEach((doc) => {
      queriedTodos.push({
        id: doc.data().id,
        title: doc.data().title,
        done: doc.data().done,
        user: doc.data().user
      })
    });
    setTodos(queriedTodos);
  }, [q])

  if (loggedUser == "") {
    return (
      <>
        Sign Up form:
        <br />
        <SignUp />
        <br />
        <br />
        Sign In form:
        <br />
        <SignIn setLoggedUser={setLoggedUser} />
      </>
    );
  } else {
    getQuerySnapshot();
    return (
      <>
        <h3>
          Welcome, {loggedUser}
          <br />
        </h3>
        <Todos todos={todos} setTodos={setTodos} />
        <AddTodo todos={todos} setTodos={setTodos} loggedUser={loggedUser} setMessage={setMessage}/>
      <div style={{ textDecoration: "italic" }}>{message}</div>
      </>
    );
  }
}
