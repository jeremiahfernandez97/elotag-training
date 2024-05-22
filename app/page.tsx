"use client";

import React, { useCallback } from "react"
import { useRouter } from "next/navigation"
import SignUp from "./components/sign-up"

export default function HomePage() {
  const router = useRouter();

  // if(loading) {
  //   return <div>Loading</div>
  // }

  // if(error) {
  //   return <div>{error.message}</div>
  // }

  const handleLoginClick = useCallback(() => {
    router.push("/login")
  }, [router]);

  return <>
    <SignUp />
    <br/>
    <div><button onClick={handleLoginClick}>or Login to continue</button></div>
  </>
}
  
