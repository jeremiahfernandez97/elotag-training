
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { app } from "../../firebase/firebase";

const auth = getAuth(app);

export default function SignUp() {
	const [email, setEmail] =  useState('');
	const [password, setPassword] =  useState('');
  const [message, setMessage] = useState('');

	const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value);
	};

	const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value);
	};

	const handleSignUp = () => {
        signUp(email, password);
	};

    const signUp = (email: string, password: string) => {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up 
          const user = userCredential.user;
          // ...
          setMessage(user.email + " signed up successfully");
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
            <button onClick={handleSignUp}>Sign Up</button>
        </>
    )
}