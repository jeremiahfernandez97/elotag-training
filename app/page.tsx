'use client'

import React, { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import SignUp from './components/sign-up'
import { Link } from '@chakra-ui/next-js'
import { Container, Center } from '@chakra-ui/react'

export default function HomePage() {
    const router = useRouter()

    // if(loading) {
    //   return <div>Loading</div>
    // }

    // if(error) {
    //   return <div>{error.message}</div>
    // }

    // const handleLoginClick = useCallback(() => {
    //   router.push("/login")
    // }, [router]);

    return (
        <Center h="90vh">
            <Container textAlign="center">
                <SignUp />
                <br />
                <Link href="/login">or Sign in to your todo list</Link>
            </Container>
        </Center>
    )
}
