import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";

const hk = Hanken_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cardify demonstrator",
  description: "Turn any text into flashcards",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${hk.className} flex flex-col h-screen bg-gradient-to-b from-stone-100 to-stone-100`}>
        <nav className="flex justify-between items-center p-4 bg-transparent">
          <span className="text-2xl font-semibold text-gray-800">
            <Link href={{pathname: "/"}}>Cardybee</Link>
            </span>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-4 rounded">Log In</button>
        </nav>
        {children}
      </body>
    </html>
  );
}
