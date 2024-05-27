'use client'

import React, { useCallback, useState } from 'react'
import { Todo } from '../types/todo'
import { doc, updateDoc } from 'firebase/firestore'
import { app, db } from '../../firebase/firebase'
import {
    collection,
    query,
    where,
    getDocs,
    deleteDoc,
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import {
    Box,
    ListItem,
    UnorderedList,
    Checkbox
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import ConfirmationModal from '../components/confirmation-modal'

const auth = getAuth(app)

type TodosProps = {
    todos: Todo[]
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
}

export default function Todos({ todos, setTodos }: TodosProps) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()
    const user = auth?.currentUser
    const [toDelete, setToDelete] = useState(0)
    const [message, setMessage] = useState("");

    const deleteTodo = useCallback(
        async (id: number) => {
            // update db
            const todoRef = collection(db, 'todos')
            const q = query(
                todoRef,
                where('user', '==', user?.email),
                where('id', '==', id)
            )
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach(async (docSnapshot) => {
                const todoDocRef = doc(db, 'todos', docSnapshot.id)
                await deleteDoc(todoDocRef)
            })

            // update state
            let newTodos: Todo[] = []
            todos.forEach((todo) => {
                if (todo.id != id) {
                    newTodos.push(todo)
                }
            })
            setTodos(newTodos)
        },
        [user?.email, todos, setTodos]
    )

    const toggleTodo = useCallback(
        async (id: number) => {
            // update db
            const todoRef = collection(db, 'todos')
            const q = query(
                todoRef,
                where('user', '==', user?.email),
                where('id', '==', id)
            )
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach(async (docSnapshot) => {
                const todoDocRef = doc(db, 'todos', docSnapshot.id)

                if (docSnapshot.data().done === false) {
                    await updateDoc(todoDocRef, {
                        done: true,
                    })
                } else {
                    await updateDoc(todoDocRef, {
                        done: false,
                    })
                }
            })

            // update state
            let newTodos = [...todos]
            newTodos.forEach((todo) => {
                if (todo.id == id) {
                    if (todo.done == false) {
                        todo.done = true
                    } else {
                        todo.done = false
                    }
                }
            })
            setTodos(newTodos)
        },
        [user?.email, todos, setTodos]
    )

    return (
        <>
            <UnorderedList styleType="none" m="0">
                {
                    todos.length != 0 ? (
                        todos.map((todo) => (
                            !todo.done && (
                                <ListItem key={todo.id}>
                                    <Checkbox py="2" isChecked={todo.done} onChange={() => toggleTodo(todo.id)}>
                                        <Box>
                                            {todo.title}
                                        </Box>
                                    </Checkbox>
                                    <Box
                                        py="1"
                                        style={{
                                            cursor: 'pointer',
                                            float: 'right'
                                        }}
                                        onClick={() => {setToDelete(todo.id); setMessage('Are you sure you want to delete "' + todo.title + '"?')}}
                                    >
                                        <IconButton aria-label='Search database' icon={<DeleteIcon />} boxSize={8} onClick={onOpen} colorScheme='red'/>
                                    </Box>
                                </ListItem>
                            )
                        ))
                    ) : (
                    <i>Empty list, add todo to begin</i>
                )}
            </UnorderedList>
            
            <UnorderedList styleType="none" m="0">
                {
                    todos.length != 0 ? (
                        todos.map((todo) => (
                            todo.done && (
                                <ListItem key={todo.id}>
                                    <Checkbox py="2" isChecked={todo.done} onChange={() => toggleTodo(todo.id)}>
                                        <Box
                                            style={{
                                                textDecoration:'line-through',
                                                color: 'grey'
                                            }}
                                        >
                                            {todo.title}
                                        </Box>
                                    </Checkbox>
                                    <Box
                                        py="1"
                                        style={{
                                            cursor: 'pointer',
                                            float: 'right'
                                        }}
                                        onClick={() => {setToDelete(todo.id); setMessage('Are you sure you want to delete "' + todo.title + '"?')}}
                                    >
                                        <IconButton aria-label='Search database' icon={<DeleteIcon />} boxSize={8} onClick={onOpen} colorScheme='red'/>
                                    </Box>
                                </ListItem>
                            )
                        ))
                    ) : (
                    <i>...</i>
                )}
            </UnorderedList>
            
            <ConfirmationModal isOpen={isOpen} onClose={onClose} cancelRef={cancelRef}  onConfirm={() => deleteTodo(toDelete)} action="Delete todo" message={message}/>
        </>
    )
}
