"use client";

import SignUp from "../components/sign-up";
import SignIn from "../components/sign-in";

export default function HomePage() {

  return (
    <>
      Sign Up form:<br/>
      <SignUp />
      <br/>
      <br/>
      Sign In form:<br/>
      <SignIn />
    </>
  );
}
