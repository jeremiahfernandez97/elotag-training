'use client'

import React, { useEffect, useCallback, useState } from 'react'
import AddTodo from '../components/add-todo'
import Todos from '../components/todos'
import { Todo } from '../types/todo'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { app, db } from '../../firebase/firebase'
import { useRouter } from 'next/navigation'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { Container, Button, Heading, useToast } from '@chakra-ui/react'
import ConfirmationModal from '../components/confirmation-modal'
import { useDisclosure } from '@chakra-ui/react'

export default function HomePage() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [message, setMessage] = useState('')
    const cancelRef = React.useRef()
    const [todos, setTodos] = useState<Todo[]>([])
    const auth = getAuth(app)
    const [user, error] = useAuthState(auth)
    const router = useRouter()
    const toast = useToast()

    const handleSignOut = useCallback(async () => {
        try {
            await auth.signOut()
            toast({
                title: 'Success!',
                description: 'Signed out',
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
        } catch (e) {
            // toast({
            //     title: 'Error!',
            //     description: 'Error signing out: ' + e,
            //     status: 'error',
            //     duration: 9000,
            //     isClosable: true,
            // })
            console.log(e);
        }
    }, [toast, auth])

    const getQuerySnapshot = useCallback(async () => {
        if (user?.email) {
            const q = query(
                collection(db, 'todos'),
                where('user', '==', user?.email)
            )
            const querySnapshot = await getDocs(q)
            let queriedTodos: Todo[] = []
            querySnapshot.forEach((doc) => {
                queriedTodos.push({
                    id: doc.data().id,
                    title: doc.data().title,
                    done: doc.data().done,
                    user: doc.data().user,
                })
            })
            queriedTodos.sort((a, b) => a.id - b.id)
            setTodos(queriedTodos)
            console.log(querySnapshot)
        }
    }, [user?.email])

    useEffect(() => {
        getQuerySnapshot()
    }, [getQuerySnapshot])

    console.log('rendering homepage')

    onAuthStateChanged(auth, (user) => {
        if (!user) {
            router.push('/login')
        }
    })

    if (!user) {
        return <Container mt="20">Loading..</Container>
    }

    if (error) {
        return <Container mt="20">Error!</Container>
    }

    return (
        <>
            <Container mt="20">
                <Heading mb="3" color="#2F855A">
                    Welcome, {user?.email}
                </Heading>
                <Button
                    mb="10"
                    variant="link"
                    onClick={() => {
                        onOpen()
                        setMessage(
                            'Are you sure you want to sign out of ' +
                                user?.email +
                                '?'
                        )
                    }}
                >
                    Sign out
                </Button>
                <AddTodo todos={todos} setTodos={setTodos} />
                <Todos todos={todos} setTodos={setTodos} />
                {/* <div style={{ textDecoration: "italic" }}>{message}</div> */}
            </Container>
            <ConfirmationModal
                isOpen={isOpen}
                onClose={onClose}
                cancelRef={cancelRef}
                onConfirm={() => handleSignOut()}
                action="Sign out"
                message={message}
            />
        </>
    )
}
