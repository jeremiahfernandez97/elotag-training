'use client'

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { app, db } from '../../firebase/firebase'
import { collection, addDoc } from 'firebase/firestore'
import {
    FormControl,
    FormLabel,
    Input,
    Button,
    Heading,
    useToast,
} from '@chakra-ui/react'

const auth = getAuth(app)

export default function SignUp() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()
    const toast = useToast()

    const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
    }

    const handleChangePassword = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setPassword(event.target.value)
    }

    const handleSignUp = () => {
        signUp(email, password)
    }

    async function addToUsersDb(user: any) {
        try {
            await addDoc(collection(db, 'users'), {
                email: user.email,
                uid: user.uid,
            })
            toast({
                title: 'Success!',
                description: user.email + ' signed up successfully',
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
        } catch (e) {
            toast({
                title: 'Error!',
                description: 'Error adding document: ' + e,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }
    }

    const navigateToTodo = useCallback(() => {
        router.push('/todo')
    }, [router])

    const signUp = (email: string, password: string) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user
                addToUsersDb(user)

                signInWithEmailAndPassword(auth, email, password)
                    .then(() => {
                        navigateToTodo()
                    })
                    .catch((error) => {
                        const errorCode = error.code
                        const errorMessage = error.message
                        toast({
                            title: 'Error!',
                            description: errorCode + ': ' + errorMessage,
                            status: 'error',
                            duration: 9000,
                            isClosable: true,
                        })
                    })
            })
            .catch((error) => {
                const errorCode = error.code
                const errorMessage = error.message
                toast({
                    title: 'Error!',
                    description: errorCode + ': ' + errorMessage,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
            })
    }

    return (
        <>
            <Heading color="#2F855A">Hello there!</Heading>
            <Heading mb="10">Create your todo list</Heading>
            <FormControl isRequired>
                <FormLabel>Email:</FormLabel>
                <Input
                    type="text"
                    value={email}
                    onChange={handleChangeEmail}
                    mb="10"
                />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Password:</FormLabel>
                <Input
                    type="password"
                    value={password}
                    onChange={handleChangePassword}
                    mb="10"
                />
            </FormControl>
            <Button onClick={handleSignUp} mb="10" color="#2F855A">
                Sign up for an account
            </Button>
        </>
    )
}
