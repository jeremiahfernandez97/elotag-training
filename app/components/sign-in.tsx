"use client"

import { signInWithEmailAndPassword } from "firebase/auth";
import { useCallback, useState } from "react";
import { app, auth} from "../../firebase/firebase";
import { useRouter } from "next/navigation"


export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSignIn = () => {
    signIn(email, password);
  };

  const navigateToHomePage = useCallback(() => {
    router.push("/")
  }, [router])

  const signIn = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigateToHomePage()
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        setMessage(errorCode + ": " + errorMessage);
        // ..
      });
  };

  return (
    <>
      <label>
        Email:
        <input type="text" value={email} onChange={handleChangeEmail} />
      </label>
      <br />
      <label>
        Password:
        <input type="text" value={password} onChange={handleChangePassword} />
      </label>
      <br />
      <div style={{ textDecoration: "italic" }}>{message}</div>
      <button onClick={handleSignIn}>Sign In</button>
    </>
  );
}
