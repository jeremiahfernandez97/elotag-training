"use client";

import React, { useEffect, useCallback, useState, useMemo } from "react"
import AddTodo from "../components/add-todo";
import Todos from "../components/todos";
import { Todo } from "../types/todo";
import { collection, query, where, getDocs } from "firebase/firestore";
import { app, db } from "../../firebase/firebase";
import { useRouter } from "next/navigation"
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth(app);

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [message, setMessage] = useState("");
  const [user]  = useAuthState(auth);
  const router = useRouter();

  const handleSignOut = useCallback(async () => {
    await auth.signOut()
    console.log(user);
  }, [user]);

  const getQuerySnapshot = useCallback(async () => {
    if(user?.email) {
      const q = query(collection(db, "todos"), where("user", "==", user?.email));
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
      queriedTodos.sort((a, b) => a.id - b.id);
      setTodos(queriedTodos);
    }
  }, [user?.email])

  useEffect(() => {
    getQuerySnapshot()
  }, [getQuerySnapshot])

  console.log("rendering homepage");

  onAuthStateChanged(auth, (user) => {
    if(!user) {
      router.push("/")
    }
  })

  return (
    <>
      <h3>
        Welcome, {user?.email}
        <br />
      </h3>
      <Todos todos={todos} setTodos={setTodos} />
      <AddTodo todos={todos} setTodos={setTodos} setMessage={setMessage}/>
      <div style={{ textDecoration: "italic" }}>{message}</div>
      <div><button onClick={handleSignOut}>Signout</button></div>
    </>
  );
}
  
