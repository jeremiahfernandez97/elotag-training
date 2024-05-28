'use client'

import React from 'react'
import SignUp from './components/sign-up'
import { Link } from '@chakra-ui/next-js'
import { Container, Center } from '@chakra-ui/react'

export default function HomePage() {
    return (
        <Center h="90vh">
            <Container textAlign="center">
                <SignUp />
                <Link href="/login">or Sign in to your todo list</Link>
            </Container>
        </Center>
    )
}
