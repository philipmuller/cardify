'use client';

import React, { FormEvent, useRef } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../engine/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {

    const loginEmailRef = useRef<HTMLInputElement>(null);
    const loginPasswordRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // maybe we can move it to engine
    const login = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const email: string = loginEmailRef.current?.value !== undefined ? loginEmailRef.current?.value : ''
        const password: string = loginPasswordRef.current?.value !== undefined ? loginPasswordRef.current?.value : ''
        
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {

                const user = userCredential.user;
                console.log(user);
                
                router.push('/')
                alert("Login successful!");
                

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage);
            });
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={login}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" ref={loginEmailRef} />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" ref={loginPasswordRef} />
                            </div>
                            <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-4 rounded">Log In</button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don’t have an account yet? <Link href="/signup" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>

    );
}
