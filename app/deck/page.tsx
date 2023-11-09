import CardBrowser from "../components/card-browser";
import { LighthouseEngine } from "../engine/server-engine";

export default async function DeckPage({ searchParams }: { searchParams: { fileText: string } }) {

  const input = searchParams.fileText;
  console.log(input);
  const deck = await LighthouseEngine.getDeckFromText(input);

  return (
    <main className="flex flex-col items-center justify-center p-24 gap-20">
      <h1 className="text-stone-600 dark:text-stone-300 text-5xl">{deck.title}</h1>
      <CardBrowser cards={deck.cards} />
    </main>
  );
}
