import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Deck, DeckCreatorService } from "./card-model";
import CardBrowser from "./components/card-browser";

export default async function Deck({ searchParams }: { searchParams: { fileText: string } }) {

  const input = searchParams.fileText;
  console.log(input);
  const deck = await DeckCreatorService.getDeck(input);

  return (
    <main className="flex flex-col items-center justify-center p-24">
      <h1>{deck.deck.title}</h1>
      <CardBrowser cards={deck.deck.cards} />
    </main>
  );
}
