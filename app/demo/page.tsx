"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold text-center">Cardify Demonstrator</h1>
      <textarea
        value={text}
        onChange={(changedTextEvent) => {
          setText(changedTextEvent.target.value);
        }}
        className="bg-transparent w-full h-96 p-4 text-xl border-2 border-gray-800 rounded-lg"
        placeholder="Paste your text here"
      />
      <Link
        className="bg-gray-800 text-white px-4 py-2 rounded-lg"
        href={{pathname: "/deck", query: {fileText: text}}}
      >
        Cardify
      </Link>
    </main>
  );
}
