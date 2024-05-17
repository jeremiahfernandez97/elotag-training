'use client';

import { useState } from 'react';
import AddTodo from './add-todo'

function Header({ title }) {
  return <h1>{title}</h1>
}

export default function HomePage() {
  const [todos, setTodos] = useState([])

  const addTodo = (todo) => {
    setTodos([...todos, todo])
  }

  const deleteTodo = (id) => {
    let newTodos = []
    todos.forEach((todo => {
      if (todo.id != id) {
        newTodos.push(todo)
      }
    }))
    setTodos(newTodos)
  }

  const toggleTodo = (id) => {
    let newTodos = [...todos]
    newTodos.forEach((todo => {
      if (todo.id == id) {
        if (todo.done == false) {
          todo.done = true
        } else {
          todo.done = false
        }
      }
    }))
    setTodos(newTodos)
  }

  return (
    <>
      <Header title="Jopet's Todo App" />
      <ul>
        {todos.length != 0 ? (todos.map((todo) => (
          <li>
            <span
              style={{
                textDecoration: todo.done == true ? "line-through" : "none",
                cursor: "pointer"
              }}
              onClick={() => toggleTodo(todo.id)}
              key={todo.id}
            >
              {todo.title} &nbsp; 
            </span>
            <span
              style={{
                color:"red",
                cursor: "pointer"
              }}
              onClick={() => deleteTodo(todo.id)}
            >
            🗑
            </span>
          </li>
        ))) : (
          <p>no todos</p>
        )}
      </ul>
      <AddTodo addTodo={addTodo} todosLength={todos.length}/>
    </>
  )
}