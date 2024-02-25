import { SupabaseServer } from "@/app/engine/database-engine-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeckPreviewCell from "../components/deck-preview-cell";

export default async function MyDecks() {
  const isLoggedIn = await SupabaseServer.isLoggedIn();

  console.log(`isLoggedIn: ${isLoggedIn}`);
  if (!isLoggedIn) {
    return redirect("/login");
  }
  const decks = await SupabaseServer.getDecks();

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
    <main className="grid grid-cols-1 gap-10 px-10 pt-36 md:grid-cols-2 lg:grid-cols-3">
      {decks.map((deck, idx) => (
        <DeckPreviewCell deck={deck.plainObject()} key={idx} />
      ))}
    </main>
  );
}
