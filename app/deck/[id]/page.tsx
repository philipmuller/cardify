
import CardBrowser from "../../components/card-browser";
import { Card } from "@/app/model/card-model";
import { SupabaseServer } from "@/app/engine/database-engine-server";

export default async function DatabaseDeckPage({ params }: { params: { id: string } }) {
    const deck = await SupabaseServer.getDeck(params.id);

    return (
        <main className="flex flex-col items-center overflow-x-hidden p-20 lg:p-24 gap-9 lg:gap-20">
            <h1 className="text-stone-600 dark:text-stone-300 text-2xl text-center w-max font-semibold lg:text-5xl">{deck?.title}</h1>
            <CardBrowser cards={deck?.plainObject().cards ?? []} />
        </main>
    );
  }