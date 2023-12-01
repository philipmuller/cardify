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

  const reducedDecks = [...decks].slice(0, 3);
  const colors = ["bg-yellow-500", "bg-red-500", "bg-green-500", "bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500"];

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-36 px-10 gap-10">
      {
        decks.map((deck, idx) => (
          <div key={deck.id} className="flex flex-col items-center p-8 pb-14 gap-8">
            <DeckPreview deck={deck.plainObject()} debugColor={colors[idx % colors.length]} />
            <Link href={`/deck/${deck.id}`} className="text-stone-600 dark:text-stone-300 text-2xl text-center w-max font-semibold lg:text-3xl">{deck.title}</Link>
          </div>
        ))
      }
    </main>
  );
}