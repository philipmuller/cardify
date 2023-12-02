"use client";

import React, { FormEvent, MouseEvent, useEffect, useRef } from "react";
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, getRedirectResult, onAuthStateChanged, signInWithRedirect } from "firebase/auth";
import { auth } from "../engine/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SupabaseBrowser } from "../engine/database-engine-client";

export default function Signup() {

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const provider = new GoogleAuthProvider();
    const router = useRouter();

    // check if user is logged in
    useEffect(() => onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            router.push('/');
        } else {
            // User is signed out
            console.log("User is signed out.")
        }
    }))

    // maybe we can move it to engine
    const signup = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const email: string = emailRef.current?.value !== undefined ? emailRef.current?.value : ''
        const password: string = passwordRef.current?.value !== undefined ? passwordRef.current?.value : ''

        SupabaseBrowser.signUp(email, password, (response) => {
            if (response.error) {
                alert(response.error.message);
                return;
            }

            router.push(`/signup/thank-you`);
        });
    }

    // maybe we can move it to engine
    const googleSignIn = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const auth = getAuth();
        signInWithRedirect(auth, provider);
        getRedirectResult(auth)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access Google APIs.
                if (result != null) {
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential?.accessToken;
                }
                // The signed-in user info.
                const user = result?.user;
                console.log(user);
                alert("Sign up with Google successful!");
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                alert(errorMessage);

            });
    }


    return (
        <section className="mt-8">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">

                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-stone-800 dark:border-stone-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-stone-900 md:text-2xl dark:text-white">
                            Create your account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={signup}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-stone-900 dark:text-white">Your email</label>
                                <input type="email" name="email" id="email" className="bg-stone-50 border border-stone-300 text-stone-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-stone-700 dark:border-stone-600 dark:placeholder-stone-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" ref={emailRef} />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-stone-900 dark:text-white">Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••" className="bg-stone-50 border border-stone-300 text-stone-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-stone-700 dark:border-stone-600 dark:placeholder-stone-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" ref={passwordRef} />
                            </div>
                            <div>
                                <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-stone-900 dark:text-white">Confirm password</label>
                                <input type="password" name="confirm-password" id="confirm-password" placeholder="••••••••" className="bg-stone-50 border border-stone-300 text-stone-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-stone-700 dark:border-stone-600 dark:placeholder-stone-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>
                            <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-4 font-medium rounded-lg">Create an account</button>
                            <p className="text-sm font-light text-stone-500 dark:text-stone-400">
                                Already have an account? <Link href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
