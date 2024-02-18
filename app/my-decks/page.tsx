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
    return redirect("/login");
  }
  const decks = await SupabaseServer.getDecks();

  const reducedDecks = [...decks].slice(0, 3);
  const colors = [
    "bg-yellow-500",
    "bg-red-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
  ];

  if (decks.length == 0) {
    return (
      //No decks yet
      <main className="flex h-screen flex-col items-center justify-center gap-5">
        <p className="text-center text-3xl font-semibold text-stone-600 lg:text-4xl dark:text-stone-300">
          {"You don't have any decks yet."}
        </p>
        <Link
          href="/"
          className="rounded-2xl border p-2 px-3 text-center text-lg font-medium text-stone-600 lg:text-xl dark:text-stone-300"
        >
          Create a deck
        </Link>
      </main>
    );
  }

  return (
    <main className="grid grid-cols-1 gap-10 gap-5 px-10 pt-36 md:grid-cols-2 lg:grid-cols-3">
      {decks.map((deck, idx) => (
        <DeckPreviewCell deck={deck.plainObject()} key={idx} />
      ))}
    </main>
  );
}
