'use client';

import React, { FormEvent, useRef } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../engine/firebase";

const login = () => {

    const loginEmailRef = useRef<HTMLInputElement>(null);
    const loginPasswordRef = useRef<HTMLInputElement>(null);

    // maybe we can move it to engine
    const login = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const email: string = loginEmailRef.current?.value !== undefined ? loginEmailRef.current?.value : ''
        const password: string = loginPasswordRef.current?.value !== undefined ? loginPasswordRef.current?.value : ''


        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                
                const user = userCredential.user;
                console.log(user);
                alert("Login successful!");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage);
            });
    }

    return (
        <center className="mt-8">
            <h1>
                Login
                <br />
                <br />
            </h1>
            <form onSubmit={login}>
                <input type='email' placeholder="Enter email" ref={loginEmailRef} /> <br />
                <input type='password' placeholder="Enter password" ref={loginPasswordRef} /> <br />
                <button type='submit'>Login</button>
            </form>
        </center>
    );
}

export default login;