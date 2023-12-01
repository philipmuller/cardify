//Classess that implement DatabaseEngine can be used as database providers
import { createBrowserClient, type CookieOptions } from '@supabase/ssr'
import { AuthError, AuthTokenResponse, SupabaseClient } from '@supabase/supabase-js';
import { Logger } from './logging-engine';
import { Deck, Card } from '../model/card-model';

export class SupabaseBrowser {
    static logger = new Logger("SupabaseBrowser");

    

    private static getBrowserClient(): SupabaseClient<any, "public", any> {
        return createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );
    }

    static onSignIn(effect: () => void) {
        const supabase = this.getBrowserClient();

        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                effect();
            }
        })

    }

    static onSignOut(effect: () => void) {
        const supabase = this.getBrowserClient();

        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                effect();
            }
        })
    }

    static async isLoggedIn(): Promise<boolean> {
        const supabase = this.getBrowserClient();
        const session = await supabase.auth.getSession();
        console.log(JSON.stringify(session));
        return session.data.session != null;
    }

    static async signIn(email: string, password: string, effect?: (response: AuthTokenResponse) => void) {
        const supabase = this.getBrowserClient();
        const response = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (effect) {
            effect(response);
        }
    }

    static async signOut(effect?: (error: AuthError | null) => void) {
        const supabase = this.getBrowserClient();
        const response = await supabase.auth.signOut();

        if (effect) {
            effect(response.error);
        }
    }

}