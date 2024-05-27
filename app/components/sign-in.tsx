'use client'

import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useCallback, useState } from 'react'
import { auth } from '../../firebase/firebase'
import { useRouter } from 'next/navigation'
import {
    Box,
    Container,
    Center,
    FormErrorMessage,
    FormControl,
    FormLabel,
    Input,
    Button,
    Heading,
    useToast,
} from '@chakra-ui/react'
import { Link } from '@chakra-ui/next-js'

interface SignInFormData {
    email: string;
    password: string;
}

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).max(32).required(),
});

export default function SignIn() {
    const router = useRouter()
    const toast = useToast()

    const handleSignIn = (formData: SignInFormData) => {
        const { email, password } = formData;
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
            .catch(() => {
                toast({
                    title: 'Error!',
                    description: 'The username and password you entered is invalid',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
            })
    }

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
      resolver: yupResolver(schema),
    });

    return (
        <Center h="90vh">
            <Container textAlign="center">
                <Box>
                    <Heading mb="10">Sign in to your todo list</Heading>
                    <form onSubmit={handleSubmit(handleSignIn)}>
                        <FormControl 
                            isInvalid={errors.email != undefined}
                            mb="10"
                        >
                            <FormLabel>Email:</FormLabel>
                            <Input
                                {...register("email")}
                                type="text"
                            />
                            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl
                            isInvalid={errors.password != undefined}
                            mb="10"
                        >
                            <FormLabel>Password:</FormLabel>
                            <Input
                                {...register("password")}
                                type="password"
                            />
                            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
                        </FormControl>
                        <Button mb="10" type="submit">
                            Sign In
                        </Button>
                    </form>
                </Box>
                <Link href="/">or Sign up for an account</Link>
            </Container>
        </Center>
    )
}
