//Classess that implement DatabaseEngine can be used as database providers
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers'
import { Logger } from './logging-engine';
import { Deck, Card } from '../model/card-model';

export class SupabaseServer {
    static logger = new Logger("SupabaseServer");


    private static getServerClient(): SupabaseClient<any, "public", any> {
        const cookieStore = cookies();

        return createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                    remove(name: string, options: CookieOptions) {
                        cookieStore.delete({ name, ...options })
                    },
                },
            }
        );
    }

    static async isLoggedIn(): Promise<boolean> {
        const supabase = this.getServerClient();
        const session = await supabase.auth.getSession();
        console.log(JSON.stringify(session));
        return session.data.session != null;
    }

    static async getDeck(id: string): Promise<Deck | undefined> {

        const supabase = this.getServerClient();

        const lg = this.logger.subprocess("getDeck");
        lg.logCall([id]);

        const { data: dbDeck, error: dbDeckError } = await supabase
        .from('decks')
        .select("title, cards(id, front, back)")
        .eq('id', id)
        .single();

        if (!dbDeck) {
            lg.log("Error fetching deck: " + JSON.stringify(dbDeckError));
            return undefined;
        }

        const cards = dbDeck.cards.map((card) => {
            return new Card(card.front, card.back, card.id);
        });
        const newDeck = new Deck(cards, dbDeck.title, id);

        lg.logReturn(JSON.stringify(newDeck));
        return newDeck;
    }

    static async getDecks(): Promise<Deck[]> {
        const supabase = this.getServerClient();

        const lg = this.logger.subprocess("getDecks");
        lg.logCall([]);

        const userID = (await supabase.auth.getUser()).data.user?.id;

        if (!userID) {
            lg.log("User not logged in");
            return [];
        }

        const { data: dbDecks, error: dbDecksError } = await supabase
        .from('decks')
        .select("id, title, cards(id, front, back), created_at")
        .order('created_at', { ascending: false })
        .eq('user_id', userID);

        if (!dbDecks) {
            lg.log("Error fetching decks: " + JSON.stringify(dbDecksError));
            return [];
        }

        let decks: Deck[] = [];

        for (let dbDeck of dbDecks) {
            const cards = dbDeck.cards.map((card) => {
                return new Card(card.front, card.back, card.id);
            });
            const newDeck = new Deck(cards, dbDeck.title, dbDeck.id);
            decks.push(newDeck);
        }

        lg.logReturn(JSON.stringify(decks));
        return decks;
    }

}