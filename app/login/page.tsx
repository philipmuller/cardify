"use client";

import React, { FormEvent, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { SupabaseBrowser } from "../engine/database-engine-client";

export default function Login() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const loginEmailRef = useRef<HTMLInputElement>(null);
  const loginPasswordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // maybe we can move it to engine
  const login = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email: string =
      loginEmailRef.current?.value !== undefined
        ? loginEmailRef.current?.value
        : "";
    const password: string =
      loginPasswordRef.current?.value !== undefined
        ? loginPasswordRef.current?.value
        : "";

    supabaseLogin(email, password);
  };

  async function supabaseLogin(email: string, password: string) {
    SupabaseBrowser.signIn(email, password, (response) => {
      console.log(`attempting to push: ${location.origin}`);
      router.refresh();
      router.push(`/`);
    });
  }

  return (
    <section className="mt-8">
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-stone-700 dark:bg-stone-800">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-stone-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={login}>
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
                  ref={loginEmailRef}
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
                  ref={loginPasswordRef}
                />
              </div>
              <button
                type="submit"
                className="w-full rounded bg-yellow-500 px-4 py-1 text-white hover:bg-yellow-600"
              >
                Log In
              </button>
              <p className="text-sm font-light text-stone-500 dark:text-stone-400">
                Don’t have an account yet?{" "}
                <Link
                  href="/signup"
                  className="text-primary-600 dark:text-primary-500 font-medium hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
