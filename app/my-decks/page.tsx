import CardComponent from "../components/card-component";
import { LighthouseEngine } from "../engine/server-engine";
import DeckPreview from "../components/deck-preview";
import { SupabaseServer } from "@/app/engine/database-engine-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PencilSimpleLine, Square, Trash } from "@phosphor-icons/react";
import DeckPreviewCell from "../components/deck-preview-cell";

export default async function MyDecks() {
  const isLoggedIn = await SupabaseServer.isLoggedIn();

  console.log(`isLoggedIn: ${isLoggedIn}`);
  if (!isLoggedIn) {

    return redirect('/login');
  }
  const decks = await SupabaseServer.getDecks();

  const reducedDecks = [...decks].slice(0, 3);
  const colors = ["bg-yellow-500", "bg-red-500", "bg-green-500", "bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500"];

  if (decks.length == 0) {
    return (
      //No decks yet
      <main className="flex flex-col gap-5 items-center justify-center h-screen">
        <p className="text-3xl lg:text-4xl font-semibold text-stone-600 dark:text-stone-300 text-center">{"You don't have any decks yet."}</p>
        <Link href="/" className="text-stone-600 border rounded-2xl p-2 px-3 dark:text-stone-300 text-lg text-center font-medium lg:text-xl">Create a deck</Link>
      </main>

    );
  }

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-36 px-10 gap-10">
      {
        decks.map((deck, idx) => (
          <DeckPreviewCell deck={deck.plainObject()} key={idx} />
        ))
      }
    </main>
  );
}