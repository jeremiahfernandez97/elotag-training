"use client";

import AddTodo from "../../components/add-todo";
import Todos from "../../components/todos";
import { Todo } from "../../types/todo";
import { useState } from "react";
import { useParams } from 'next/navigation';


type HeaderProps = {
  user: string;
};

function Header({ user }: HeaderProps) {
  return <h1>{user}</h1>;
}

export default function TodoMain() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const params = useParams<{ user: string}>();

    return (
        <>
            <Header user={params.user} />
            <Todos todos={todos} setTodos={setTodos} />
            <AddTodo todos={todos} setTodos={setTodos} />
        </>
    )
}