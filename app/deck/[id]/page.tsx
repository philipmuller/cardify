import CardBrowser from "../../components/card-browser";
import { SupabaseServer } from "@/app/engine/database-engine-server";

export default async function DatabaseDeckPage({
  params,
}: {
  params: { id: string };
}) {
  const deck = await SupabaseServer.getDeck(params.id);

  return (
    <main className="flex flex-col items-center gap-9 overflow-x-hidden p-20 lg:gap-20 lg:p-24">
      <CardBrowser cards={deck?.plainObject().cards ?? []} title={deck?.title} />
    </main>
  );
}
