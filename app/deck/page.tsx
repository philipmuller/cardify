import CardBrowser from "../components/card-browser";
import { LighthouseEngine } from "../engine/server-engine";
import { CreateDeckParams } from "../model/comms-utils";
import { Logger } from "../engine/logging-engine";

type Props = {
  params: {};
  searchParams: CreateDeckParams;
};

export default async function DeckPage(props: Props) {
  const logger = new Logger("DeckPage");
  logger.logCall([props]);

  const deck = await LighthouseEngine.handleGetDeckRequest(props.searchParams);

  return (
    <main className="flex flex-col items-center gap-9 overflow-x-hidden p-20 lg:gap-20 lg:p-24">
      <h1 className="w-max text-center text-2xl font-semibold text-stone-600 lg:text-5xl dark:text-stone-300">
        {deck.title}
      </h1>
      <CardBrowser cards={deck.plainObject().cards} />
    </main>
  );
}
