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
import {
  Container,
  Center,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  useToast
} from '@chakra-ui/react'

const auth = getAuth(app);

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [message, setMessage] = useState("");
  const [user, error]  = useAuthState(auth);
  const router = useRouter();
  const toast = useToast();

  const handleSignOut = useCallback(async () => {
    try {
      await auth.signOut();
      toast({
        title: 'Success!',
        description: "Signed out",
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
    } catch (e) {
      toast({
        title: 'Error!',
        description: "" + e,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
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

  if(!user) {
    return (
      <Center>
        <Container>
          Loading..
        </Container>
      </Center>
    )
  }

  if(error) {
    return (
      <Center>
        <Container>
          Error!
        </Container>
      </Center>
    )
  }

  return (
    <Center>
      <Container>
        <Heading display="inline">
          Welcome, {user?.email}
        </Heading>
        <Button onClick={handleSignOut}>Sign out</Button>
        <br/>
        <br/>
        <AddTodo todos={todos} setTodos={setTodos} setMessage={setMessage}/>
  
        <Container my="10">
          <Todos todos={todos} setTodos={setTodos} />
        </Container>
          
        {/* <div style={{ textDecoration: "italic" }}>{message}</div> */}
      </Container>
    </Center>
  );
}
  
