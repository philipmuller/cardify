"use client";

import "./globals.css";
import Link from "next/link";
import { Hanken_Grotesk } from "next/font/google";
import { ThemeProvider } from "./theme-provider";
import { ThemeSwitcher } from "./theme-switcher";
import { useRouter } from "next/navigation";
import { MouseEvent, useState } from "react";
import { SupabaseBrowser } from "./engine/database-engine-client";
import { attachReactRefresh } from "next/dist/build/webpack-config";

const hk = Hanken_Grotesk({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [buttonText, setButtonText] = useState("Log in");

  SupabaseBrowser.onSignIn(() => {
    setButtonText(() => "Log out");
  });

  SupabaseBrowser.onSignOut(() => {
    setButtonText(() => "Log in");
  });

  const router = useRouter();

  const goToLogIn = (e: MouseEvent<HTMLButtonElement>) => {
    router.push("/login");
  };

  const logOut = (e: MouseEvent<HTMLButtonElement>) => {
    console.log("logging out");
    setButtonText(() => "Log in");
    SupabaseBrowser.signOut((error) => {
      console.log(error);
      router.refresh();
    });
  };

  return (
    <html lang="en">
      <body className={`${hk.className} overflow-x-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="fixed flex h-screen w-screen flex-col overflow-y-auto bg-stone-50 dark:bg-stone-900">
            <nav className="fixed z-[1000] flex w-screen items-center justify-between bg-transparent p-4">
              <span className="text-2xl font-semibold text-stone-800 dark:text-stone-200">
                <Link href={{ pathname: "/"}}>Cardybee</Link>
              </span>
              <div className="flex flex-row gap-10">
                <ThemeSwitcher user={buttonText} />
                <button
                  className="rounded bg-yellow-500 px-4 py-1 text-white hover:bg-yellow-600"
                  onClick={buttonText === "Log in" ? goToLogIn : logOut}
                >
                  {buttonText}
                </button>
              </div>
            </nav>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
