import CardComponent from "../components/card-component";
import { LighthouseEngine } from "../engine/server-engine";
import DeckPreview from "../components/deck-preview";


export default async function MyDecks() {
  const decks = await LighthouseEngine.getDecksFromDatabase();

  return (
    <main className="flex flex-col items-start content-center justify-start justify-items-center">
      {
        decks.map((deck) => (
          <div key={deck.id} className="flex flex-col p-20">
            <h1 className="text-stone-600 dark:text-stone-300 text-3xl text-center w-max font-semibold lg:text-5xl">{deck.title}</h1>
            <DeckPreview deck={deck.plainObject()} />
          </div>
        ))
      }
    </main>
  );
}