'use client'

import { useCallback } from 'react'
import { Todo } from '../types/todo'
import { collection, addDoc } from 'firebase/firestore'
import { app, db } from '../../firebase/firebase'
import { getAuth } from 'firebase/auth'
import { Box, FormControl, Input, Button, useToast } from '@chakra-ui/react'
import { useForm } from "react-hook-form";

interface TodoFormData {
    todo: string;
}

const auth = getAuth(app)

type TodosProps = {
    todos: Todo[]
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
}

export default function AddTodo({
    todos,
    setTodos,
}: TodosProps) {
    const user = auth?.currentUser
    const toast = useToast()

    const addToTodosDb = useCallback(
        async (todo: Todo) => {
            try {
                await addDoc(collection(db, 'todos'), todo)
                setTodos([...todos, todo])
                reset();
            } catch (e) {
                toast({
                    title: 'Error!',
                    description: 'Error adding todo: ' + e,
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

    const handleClick = useCallback((formData: TodoFormData) => {
        const todoText = formData.todo;
        if (todoText.trim() != '') {
            addTodo({
                id: todos.length,
                title: todoText.trim(),
                done: false,
                user: user?.email ?? '',
            })
        }
    }, [addTodo, todos.length, user?.email])

    const { register, handleSubmit, reset } = useForm();

    return (
        <FormControl>
            <Box 
                display="flex" 
                mr="3"
                mb="10"
            >
                <form onSubmit={handleSubmit(handleClick)}>
                    <Input
                        {...register("todo")}
                        // name="todo"
                        type="text"
                        style={{display:"inline"}}
                    />
                    <Button type="submit">Add todo</Button>
                </form>
            </Box>
        </FormControl>
    )
}
