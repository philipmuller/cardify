//Classess that implement DatabaseEngine can be used as database providers
import { createBrowserClient } from "@supabase/ssr";
import {
  AuthError,
  AuthResponse,
  AuthTokenResponse,
  SupabaseClient,
} from "@supabase/supabase-js";
import { Logger } from "./logging-engine";
import { FileType } from "../model/file-type";

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
      if (event === "SIGNED_IN") {
        effect();
      }
    });
  }

  static onSignOut(effect: () => void) {
    const supabase = this.getBrowserClient();

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        effect();
      }
    });
  }

  static async isLoggedIn(): Promise<boolean> {
    const supabase = this.getBrowserClient();
    const session = await supabase.auth.getSession();
    console.log(JSON.stringify(session));
    return session.data.session != null;
  }

  static async uploadFile(
    file: Blob | File | ArrayBuffer | FormData,
    fileType: FileType,
  ): Promise<string> {
    const lg = this.logger.subprocess("uploadFile");
    lg.logCall([file, fileType]);

    const supabase = this.getBrowserClient();
    
    // Generate a unique name for the file
    const chunkName = `${fileType}/`;

    // Upload the file
    const { data, error } = await supabase.storage
      .from('audio-chunks')
      .upload(chunkName, file, {
        upsert: true,
      });

    if (error) {
      lg.log(error);
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from('audio-chunks')
      .getPublicUrl(data.path);

    lg.logReturn(publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  }

  static async signUp(
    email: string,
    password: string,
    effect?: (response: AuthResponse) => void,
  ) {
    const supabase = this.getBrowserClient();

    const response = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/confirm`,
      },
    });

    if (effect) {
      effect(response);
    }
  }

  static async signIn(
    email: string,
    password: string,
    effect?: (response: AuthTokenResponse) => void,
  ) {
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
