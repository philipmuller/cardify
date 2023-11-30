import CardBrowser from "../components/card-browser";
import { LighthouseEngine } from "../engine/server-engine";
import { CreateDeckParams } from "../model/comms-utils";
import { Logger } from "../engine/logging-engine";
import { useSearchParams } from "next/navigation";

type Props = {
  params: {};
  searchParams: CreateDeckParams;
};

export default async function DeckPage(props: Props) {

  const logger = new Logger("DeckPage");
  logger.logCall([props]);

  const deck = await LighthouseEngine.handleGetDeckRequest(props.searchParams);

  return (
    <main className="flex flex-col items-center justify-center overflow-x-hidden p-24 gap-20">
      <h1 className="text-stone-600 dark:text-stone-300 hidden lg:block text-5xl">{deck.title}</h1>
      <CardBrowser cards={deck.plainObject().cards} />
    </main>
  );
}
