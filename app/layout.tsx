"use client"

import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import { ThemeProvider } from "./theme-provider";
import { ThemeSwitcher } from "./theme-switcher";
import { useRouter } from "next/navigation";
import { MouseEvent, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./engine/firebase";
import { Cards } from "@phosphor-icons/react";

const hk = Hanken_Grotesk({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Cardybee",
//   description: "Turn anything into flashcards",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [buttonText, setButtonText] = useState("Log in");

  useEffect(() => onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      setButtonText("Log out")
    } else {

      console.log("User is signed out.")
      setButtonText("Log in")
    }
  }))


  const router = useRouter();

  const goToLogIn = (e: MouseEvent<HTMLButtonElement>) => {
    router.push('/login');
  }

  const logOut = (e: MouseEvent<HTMLButtonElement>) => {
    signOut(auth).then(() => {
      // Sign-out successful.
      alert("Logged out successfully!");
      router.push('/');
    }).catch((error) => {
      alert(error)
    });
  }

  return (
    <html lang="en">

      <body className={`${hk.className} overflow-x-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col fixed h-screen overflow-y-auto w-screen bg-stone-50 dark:bg-stone-900">
            <nav className="flex justify-between items-center p-4 bg-transparent fixed w-screen z-[1000]">
              <span className="text-2xl font-semibold text-stone-800 dark:text-stone-200">
                <Link href={{ pathname: "/" }}>Cardybee</Link>
              </span>
              <div className="flex flex-row gap-10">
                <ThemeSwitcher user={buttonText}/>
                {/* <button
                  className={`right-5 rounded-md hover:scale-110 active:scale-100 duration-200`}
                >
                  <Cards size={28} color="#e7e5e4" weight="bold" />
                </button> */}
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-4 rounded" onClick={buttonText === "Log in" ? goToLogIn : logOut}>{buttonText}</button>
              </div>
            </nav>
            {children}
          </div>
        </ThemeProvider>
      </body>


    </html>
  );
}
