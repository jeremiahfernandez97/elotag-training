
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { app } from "../../firebase/firebase";

const auth = getAuth(app);

export default function SignIn() {
	const [email, setEmail] =  useState('');
	const [password, setPassword] =  useState('');
  const [message, setMessage] = useState('');

	const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value);
	};

	const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value);
	};

	const handleSignIn = () => {
        signIn(email, password);
	};

  const router = useRouter();
  
  const redirectSignin = (user: string | null) => router.push('/todo/' + user)

  const signIn = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...

        redirectSignin(user.email);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        setMessage(errorCode + ": " + errorMessage);
        // ..
      });
  }
  
  return (
      <>
          <label>Email:
          <input  type="text" value={email} onChange={handleChangeEmail} />
          </label>
          <br/>
          <label>Password:
          <input  type="text" value={password} onChange={handleChangePassword} />
          </label>
          <br/>
          <div style={{textDecoration:"italic"}}>{message}</div>
          <button onClick={handleSignIn}>Sign In</button>
      </>
  )
}