'use client'

import { useState } from 'react'
import { useCallback } from 'react'
import { Todo } from '../types/todo'
import { collection, addDoc } from 'firebase/firestore'
import { app, db } from '../../firebase/firebase'
import { getAuth } from 'firebase/auth'
import { Box, FormControl, Input, Button, useToast } from '@chakra-ui/react'

const auth = getAuth(app)

type TodosProps = {
    todos: Todo[]
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
}

export default function AddTodo({
    todos,
    setTodos,
}: TodosProps) {
    const [todoText, setTodoText] = useState('')
    const user = auth?.currentUser
    const toast = useToast()

    const addToTodosDb = useCallback(
        async (todo: Todo) => {
            try {
                await addDoc(collection(db, 'todos'), todo)
                setTodos([...todos, todo])
            } catch (e) {
                toast({
                    title: 'Error!',
                    description: '' + e,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
            }
        },
        [setTodos, todos, toast]
    )

    const addTodo = useCallback(
        (todo: Todo) => {
            addToTodosDb(todo)
        },
        [addToTodosDb]
    )

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTodoText(e.target.value)
    }
    const handleClick = useCallback(() => {
        if (todoText.trim() != '') {
            addTodo({
                id: todos.length,
                title: todoText.trim(),
                done: false,
                user: user?.email ?? '',
            })
            setTodoText('')
        }
    }, [addTodo, todoText, todos.length, user?.email])

    return (
        <FormControl>
            <Box display="flex">
                <Input
                    type="text"
                    value={todoText}
                    onChange={handleChange}
                    mr="3"
                    mb="10"
                />
                <Button onClick={handleClick}>Add todo</Button>
            </Box>
        </FormControl>
    )
}
