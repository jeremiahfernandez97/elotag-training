"use client";

import React, { useEffect, useCallback, useState, useMemo } from "react"
import AddTodo from "./components/add-todo";
import Todos from "./components/todos";
import { Todo } from "./types/todo";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { useRouter } from "next/navigation"
import { useAuthState } from 'react-firebase-hooks/auth';

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const [user, loading, error]  = useAuthState(auth)

  // if(loading) {
  //   return <div>Loading</div>
  // }

  // if(error) {
  //   return <div>{error.message}</div>
  // }

  const handleLoginClick = useCallback(() => {
    router.push("/login")
  }, [router]);

  const handleSignOut = useCallback(async () => {
    await auth.signOut()
    console.log(user);
  }, [auth, user]);

  if(!user) {
    return <div><button onClick={handleLoginClick}>Login to continue</button></div>
  }


  const getQuerySnapshot = async () => {
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
      setTodos(queriedTodos);
    }
  }

  // useEffect(() => {
    getQuerySnapshot()
  // }, [user])

  // console.log("rendering homepage");

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
  
