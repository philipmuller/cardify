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
    <main className="flex flex-wrap items-center content-center justify-center justify-items-center pt-36">
      {
        decks.map((deck) => (
          <div key={deck.id} className="flex flex-col items-center p-8 pb-14 gap-8">
            <DeckPreview deck={deck.plainObject()} />
            <Link href={`/deck/${deck.id}`} className="text-stone-600 dark:text-stone-300 text-2xl text-center w-max font-semibold lg:text-3xl">{deck.title}</Link>
          </div>
        ))
      }
    </main>
  );
}