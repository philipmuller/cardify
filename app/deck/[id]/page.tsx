import { createServerClient, CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Logger } from "../../engine/logging-engine";
import CardBrowser from "../../components/card-browser";
import { Card } from "@/app/model/card-model";

export default async function DatabaseDeckPage({ params }: { params: { id: string } }) {
    // You can add any UI inside Loading, including a Skeleton.
    const lg = new Logger("DatabaseDeckPage");

    const cookieStore = cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
              cookies: {
                get(name: string) {
                  return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                  cookieStore.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                  cookieStore.delete({ name, ...options })
                },
              },
            }
        );

    const { data: dbDeck, error: dbDeckError } = await supabase.from('decks').select("title, cards(id, front, back)").eq('id', params.id).single();

    lg.log("Deck Reading completed." + JSON.stringify(dbDeck)+JSON.stringify(dbDeckError));



    return (
        <main className="flex flex-col items-center overflow-x-hidden p-20 lg:p-24 gap-9 lg:gap-20">
            <h1 className="text-stone-600 dark:text-stone-300 text-2xl text-center w-max font-semibold lg:text-5xl">{dbDeck?.title}</h1>
            <CardBrowser cards={dbDeck?.cards.map((dbCard) => {return new Card(dbCard.front, dbCard.back, dbCard.id)}) ?? []} />
        </main>
    );
  }