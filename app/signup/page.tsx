"use client";

import React, { FormEvent, FormEventHandler, useRef } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../engine/firebase";

const signup = () => {

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const signup = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const email : string = emailRef.current?.value !== undefined ? emailRef.current?.value : ''
        const password : string = passwordRef.current?.value !== undefined ? passwordRef.current?.value : ''

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => { 
                // Signed up 
                const user = userCredential.user;
                alert("success sign up")
                
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage)
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
                <button type='submit'>Signup</button>
            </form>
        </center>
    );
}

export default signup;