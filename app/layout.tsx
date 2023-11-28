"use client"

import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import { ThemeProvider } from "./theme-provider";
import { ThemeSwitcher } from "./theme-switcher";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

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

  const router = useRouter();

  const goToLogIn = (e: MouseEvent<HTMLButtonElement>) => {
    router.push('/login');
  }

  return (
    <html lang="en">

      <body className={`${hk.className} overflow-x-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col fixed h-screen overflow-y-auto w-screen bg-stone-50 dark:bg-stone-900">
            <nav className="flex justify-between items-center p-4 bg-transparent fixed w-screen">
              <span className="text-2xl font-semibold text-stone-800 dark:text-stone-200">
                <Link href={{ pathname: "/" }}>Cardybee</Link>
              </span>
              <div className="flex flex-row gap-10">
                <ThemeSwitcher />
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-4 rounded" onClick={goToLogIn}>Log In</button>
              </div>
            </nav>
            {children}
          </div>
        </ThemeProvider>
      </body>


    </html>
  );
}
