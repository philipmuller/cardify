import { ReadStream } from "fs";
import { Deck, Card } from "../model/card-model";
import { AIEngine, OpenAIEngine, DemoAIEngine } from "./ai-engine";
import { AIIntent } from "./ai-intent";
import { FileEngine } from "./file-engine";
import { FileType } from "../model/file-type";
import { Logger } from "./logging-engine";
import { CreateDeckParams, CreateDeckMode } from "../model/comms-utils";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export abstract class LighthouseEngine {
  private static demoMode: boolean = JSON.parse(process.env.DEMO_MODE!); //demo mode disables AI calls and replaces them with static responses
  private static logger: Logger = new Logger("LighthouseEngine");

  private static aiEngine: AIEngine = this.demoMode
    ? new DemoAIEngine()
    : new OpenAIEngine();

  static auth() {
    //Implement authentication
  }
  //Database ----------------
  // static async getDeckFromDatabase(id: string): Promise<Deck | undefined> {
  //     const lg = this.logger.subprocess("getDeckFromDatabase");
  //     lg.logCall([id]);

  //     const deck = await SupabaseServer.getDeck(id);

  //     lg.logReturn(deck);
  //     return deck;
  // }

  // static async getDecksFromDatabase(): Promise<Deck[]> {
  //     const lg = this.logger.subprocess("getDecksFromDatabase");
  //     lg.logCall([]);

  //     const decks = await SupabaseServer.getDecks();

  //     lg.logReturn(decks);
  //     return decks;
  // }

  //Comms ------------------
  static async handleGetDeckRequest(params: CreateDeckParams): Promise<Deck> {
    const lg = this.logger.subprocess("handleGetDeckRequest");
    lg.logCall([params]);

    let deck = Deck.empty();
    switch (params.mode) {
      case CreateDeckParams.modes.text:
        if (params.text == null) {
          const message = "Mode is text, but no text is specified";
          lg.log(message);
          throw new Error(message);
        }
        deck = await this.getDeckFromText(params.text);
        break;
      case CreateDeckParams.modes.file:
        if (params.fileUrl == null || params.fileType == null) {
          const message =
            "Mode is file, but no file url and/or type is specified";
          lg.log(message);
          throw new Error(message);
        }
        deck = await this.getDeckFromFile(params.fileUrl, params.fileType);
        break;
      default:
        const message = "Invalid mode";
        lg.log(message);
        throw new Error("Invalid mode");
    }

    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
          },
        },
      },
    );

    const { data: dbDeck, error: dbDeckError } = await supabase
      .from("decks")
      .insert([
        {
          title: deck.title,
        },
      ])
      .select();

    lg.log(
      "Deck writing completed." +
        JSON.stringify(dbDeck) +
        JSON.stringify(dbDeckError),
    );

    if (dbDeck != null) {
      for (let card of deck.cards) {
        const { data: dbCard, error: dbCardError } = await supabase
          .from("cards")
          .insert([
            {
              front: card.front,
              back: card.back,
              deck_id: dbDeck![0].id,
            },
          ])
          .select();

        lg.log(
          "Card writing completed." +
            JSON.stringify(dbCard) +
            JSON.stringify(dbCardError),
        );
      }
    }

    lg.logReturn(deck);
    return deck;
  }

  static async deleteDeckFromDatabase(id: string) {
    const lg = this.logger.subprocess("deleteDeckFromDatabase");
    lg.logCall([id]);

    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
          },
        },
      },
    );

    const { error } = await supabase.from("decks").delete().eq("id", id);

    lg.log("Errors: " + JSON.stringify(error));
    lg.log("Deck deleted");
  }

  static createDeckParamsFrom(searchParams: URLSearchParams): CreateDeckParams {
    const lg = this.logger.subprocess("createDeckParamsFrom");
    lg.logCall([searchParams]);

    const modeString = searchParams.get(CreateDeckParams.paramNames.mode);

    if (modeString == null) {
      lg.log("No mode specified");
      throw new Error("No mode specified");
    } else {
      if (!(<any>Object).values(CreateDeckMode).includes(modeString)) {
        lg.log("Invalid mode");
        throw new Error("Invalid mode");
      }
      const mode = <CreateDeckMode>modeString;

      const text =
        searchParams.get(CreateDeckParams.paramNames.text) ?? undefined;
      const fileUrl =
        searchParams.get(CreateDeckParams.paramNames.fileUrl) ?? undefined;

      const fileTypeString =
        searchParams.get(CreateDeckParams.paramNames.fileType) ?? undefined;
      if (!(<any>Object).values(FileType).includes(fileTypeString)) {
        lg.log("Invalid file type");
        throw new Error("Invalid file type");
      }
      const fileType = <FileType>fileTypeString;

      const returnValue = new CreateDeckParams(mode, {
        text: text,
        fileUrl: fileUrl,
        fileType: fileType,
      });
      lg.logReturn(returnValue);
      return returnValue;
    }
  }

  //File management ---------
  static async donwloadFile(url: string, filename: string): Promise<string> {
    const lg = this.logger.subprocess("donwloadFile");
    lg.logCall([url, filename]);

    const returnValue = await FileEngine.downloadFile(url, filename);
    lg.logReturn(returnValue);
    return returnValue;
  }

  static readFile(path: string): ReadStream {
    const lg = this.logger.subprocess("readFile");
    lg.logCall([path]);

    const returnValue = FileEngine.readFile(path);
    lg.logReturn(returnValue);
    return returnValue;
  }

  //AI features -------------
  static async getTranscription(file: ReadStream): Promise<string> {
    const lg = this.logger.subprocess("getTranscription");
    lg.logCall([file]);

    const returnValue = await this.aiEngine.transcribe(file);
    lg.logReturn(returnValue);
    return returnValue;
  }

  static async getDeckFromText(text: string): Promise<Deck> {
    const lg = this.logger.subprocess("getDeckFromText");
    lg.logCall([text]);

    const returnValue = await this.getDeck(
      text,
      AIIntent.createFlashcardDeckFromText(),
    );
    lg.logReturn(returnValue);
    return returnValue;
  }

  static async getDeckFromFile(url: string, fileType: FileType): Promise<Deck> {
    const lg = this.logger.subprocess("getDeckFromFile");
    lg.logCall([url, fileType]);

    const path = await this.donwloadFile(
      url,
      "temp." +
        Object.keys(FileType)[Object.values(FileType).indexOf(fileType)],
    );
    const file = await this.readFile(path);

    var returnValue = Deck.empty();

    if (
      fileType == FileType.mp3 ||
      fileType == FileType.wav ||
      fileType == FileType.webm
    ) {
      const transcription = await this.getTranscription(file);
      //Work needed to determine if normal audio or live audio
      returnValue = await this.getDeck(
        transcription,
        AIIntent.startFlashcardDeckFromLiveAudioTranscription(),
      );
    } else {
      returnValue = await this.getDeck(
        "",
        AIIntent.createFlashcardDeckFromFile(),
        file,
      );
    }

    lg.logReturn(returnValue);
    return returnValue;
  }

  private static async getDeck(
    text: string,
    intent: AIIntent,
    file?: ReadStream,
  ): Promise<Deck> {
    const lg = this.logger.subprocess("(private) getDeck");
    lg.logCall([text, intent, file]);

    const deckString = await this.aiEngine.generateFrom(text, intent, file);
    console.log("DECK STRING: " + deckString);

    var title: string = "";
    const cards: Card[] = [];

    let front = "";
    let back = "";
    let isFront = true;

    for (const part of deckString.split("\n")) {
      if (part.includes("Title:")) {
        title = part.substring(7);
      }

      if (part.startsWith("Q:")) {
        if (!isFront) {
          cards.push(new Card(front, back));
          front = "";
          back = "";
        }
        front += part.substring(3);
        isFront = true;
      } else if (part.startsWith("A:")) {
        back += part.substring(3);
        isFront = false;
      }
    }

    if (front != "" || back != "") {
      cards.push(new Card(front, back));
    }

    let deck: Deck = new Deck(cards, title);
    lg.logReturn(deck);
    return deck;
  }
}
