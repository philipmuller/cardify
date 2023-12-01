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
    <main className="flex flex-col items-center overflow-x-hidden p-20 lg:p-24 gap-9 lg:gap-20">
      <h1 className="text-stone-600 dark:text-stone-300 text-2xl text-center w-max font-semibold lg:text-5xl">{deck.title}</h1>
      <CardBrowser cards={deck.plainObject().cards} />
    </main>
  );
}
