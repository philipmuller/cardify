import { Deck } from "./card-model";
import { getDeck } from "./deck-creator-service";
import CardBrowser from "./components/card-browser";

export default async function Deck({ searchParams }: { searchParams: { fileText: string } }) {

  const input = searchParams.fileText;
  console.log(input);
  const deck = await getDeck(input, false);

  return (
    <main className="flex flex-col items-center justify-center p-24 gap-20">
      <h1 className="text-stone-600 text-5xl">{deck.title}</h1>
      <CardBrowser cards={deck.cards} />
    </main>
  );
}
