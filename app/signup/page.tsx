"use client";

import React, { FormEvent, MouseEvent, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SupabaseBrowser } from "../engine/database-engine-client";

export default function Signup() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const signup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email: string =
      emailRef.current?.value !== undefined ? emailRef.current?.value : "";
    const password: string =
      passwordRef.current?.value !== undefined
        ? passwordRef.current?.value
        : "";

    SupabaseBrowser.signUp(email, password, (response) => {
      if (response.error) {
        alert(response.error.message);
        return;
      }

      router.push(`/signup/thank-you`);
    });
  };

  return (
    <section className="mt-8">
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-stone-700 dark:bg-stone-800">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-stone-900 md:text-2xl dark:text-white">
              Create your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={signup}>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-stone-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-stone-300 bg-stone-50 p-2.5 text-stone-900 sm:text-sm dark:border-stone-600 dark:bg-stone-700 dark:text-white dark:placeholder-stone-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="name@company.com"
                  ref={emailRef}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-stone-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-stone-300 bg-stone-50 p-2.5 text-stone-900 sm:text-sm dark:border-stone-600 dark:bg-stone-700 dark:text-white dark:placeholder-stone-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  ref={passwordRef}
                />
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-2 block text-sm font-medium text-stone-900 dark:text-white"
                >
                  Confirm password
                </label>
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  placeholder="••••••••"
                  className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-stone-300 bg-stone-50 p-2.5 text-stone-900 sm:text-sm dark:border-stone-600 dark:bg-stone-700 dark:text-white dark:placeholder-stone-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-yellow-500 px-4 py-1 font-medium text-white hover:bg-yellow-600"
              >
                Create an account
              </button>
              <p className="text-sm font-light text-stone-500 dark:text-stone-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary-600 dark:text-primary-500 font-medium hover:underline"
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
