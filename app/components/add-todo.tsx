'use client'

import { useCallback, useState } from 'react'
import { Todo } from '../types/todo'
import { collection, addDoc } from 'firebase/firestore'
import { app, db } from '../../firebase/firebase'
import { getAuth } from 'firebase/auth'
import { Box, FormControl, Input, Button, useToast } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'

const auth = getAuth(app)

type TodosProps = {
    todos: Todo[]
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
}

export default function AddTodo({ todos, setTodos }: TodosProps) {
    const [loading, setLoading] = useState(false)
    const user = auth?.currentUser
    const toast = useToast()

    const addToTodosDb = useCallback(
        async (todo: Todo) => {
            try {
                setLoading(true)
                addDoc(collection(db, 'todos'), todo)
                .then( ()=>{
                    setTodos([...todos, todo])
                    reset()
                })
                .finally(() => {
                    setLoading(false)
                })
            } catch (e) {
                console.log(e);
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

    const handleClick = useCallback(
        (formData: Record<string, any>) => {
            const todoText = formData.todo
            if (todoText.trim() != '') {
                addTodo({
                    id: todos.length,
                    title: todoText.trim(),
                    done: false,
                    user: user?.email ?? '',
                })
            }
        },
        [addTodo, todos.length, user?.email]
    )

    const { register, handleSubmit, reset } = useForm()

    return (
        <FormControl>
            <Box display="flex" mb="10">
                <form onSubmit={handleSubmit(handleClick)} style={{display:"flex", width:"100%"}}>
                    <Input
                        mr="3"
                        {...register('todo')}
                        type="text"
                        style={{ display: 'inline' }}
                    />
                    <Button type="submit" isDisabled={loading}>Add todo</Button>
                </form>
            </Box>
        </FormControl>
    )
}
