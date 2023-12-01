import CardComponent from "../components/card-component";
import { LighthouseEngine } from "../engine/server-engine";
import DeckPreview from "../components/deck-preview";
import { SupabaseServer } from "@/app/engine/database-engine-server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function MyDecks() {
  const isLoggedIn = await SupabaseServer.isLoggedIn();

  console.log(`isLoggedIn: ${isLoggedIn}`);
  if (!isLoggedIn) {

    return redirect('/login');
  }
  const decks = await SupabaseServer.getDecks();

  return (
    <main className="flex flex-col items-start content-center justify-start justify-items-center">
      {
        decks.map((deck) => (
          <div key={deck.id} className="flex flex-col p-20">
            <Link href={`/deck/${deck.id}`} className="text-stone-600 dark:text-stone-300 text-3xl text-center w-max font-semibold lg:text-5xl">{deck.title}</Link>
            <DeckPreview deck={deck.plainObject()} />
          </div>
        ))
      }
    </main>
  );
}