'use client'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { useCallback, useState } from 'react'
import { auth } from '../../firebase/firebase'
import { useRouter } from 'next/navigation'
import {
    Container,
    Center,
    FormControl,
    FormLabel,
    Input,
    Button,
    Heading,
    useToast,
} from '@chakra-ui/react'

export default function SignIn() {
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

    const handleSignIn = () => {
        signIn(email, password)
    }

    const navigateToTodo = useCallback(() => {
        router.push('/todo')
    }, [router])

    const signIn = (email: string, password: string) => {
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                navigateToTodo()
                toast({
                    title: 'Success!',
                    description: 'Signed in',
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                })
            })
            .catch((error) => {
                const errorCode = error.code
                const errorMessage = error.message
                // setMessage(errorCode + ": " + errorMessage);
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
        <Center h="90vh">
            <Container textAlign="center">
                <Heading mb="10">Sign in to your todo list</Heading>
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
                <Button onClick={handleSignIn} mb="10">
                    Sign In
                </Button>
            </Container>
        </Center>
    )
}
