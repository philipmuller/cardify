"use client";

import React, { FormEvent, FormEventHandler, MouseEvent, useRef } from "react";
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from "../engine/firebase";


const signup = () => {

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const provider = new GoogleAuthProvider();

    // maybe we can move it to engine
    const signup = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const email: string = emailRef.current?.value !== undefined ? emailRef.current?.value : ''
        const password: string = passwordRef.current?.value !== undefined ? passwordRef.current?.value : ''

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                alert("Sign up successful!")

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage)
            });
    }

    // maybe we can move it to engine
    const googleSignIn = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;
                // The signed-in user info.
                const user = result.user;
                // IdP data available using getAdditionalUserInfo(result)
                alert("Signed in with Google successful!")
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                alert(error.message);
            });
    }


    return (
         <center className="mt-8">
            <h1>
                Signup
                <br />
                <br />
            </h1>
            <form onSubmit={signup}>
                <input type='email' placeholder="Enter email" ref={emailRef} /> <br />
                <input type='password' placeholder="Enter password" ref={passwordRef} /> <br />
                <button type='submit'>Signup</button> <br/>
                <button onClick={googleSignIn}>Sign in using Google</button>
            </form>
        </center>
    );
}

export default signup;