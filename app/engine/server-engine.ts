import { Deck , Card } from "../model/card-model";
import { AIEngine, OpenAIEngine, DemoAIEngine } from "./ai-engine";
import { AIIntent } from "./ai-intent";
import { DatabaseEngine, FirebaseEngine } from "./database-engine";
import { FileEngine, VercelBlobEngine } from "./file-engine";


export class LighthouseEngine {
    private static demoMode: boolean = false; //demo mode disables AI calls and replaces them with static responses

    private static aiEngine: AIEngine = this.demoMode ? new DemoAIEngine() : new OpenAIEngine();
    private static fileEngine: FileEngine = VercelBlobEngine;
    private static databaseEngine: DatabaseEngine = FirebaseEngine;
    
    static auth() {
        //Implement authentication
    }

    static async getDeck(text?: string, audioURL?: URL, fileURL?: URL): Promise<Deck> {
        if (text != null) {
            return this.getDeckFromText(text);
        } else if (audioURL != null) {
            return this.getDeckFromAudio(audioURL);
        } else if (fileURL != null) {
            return this.getDeckFromFile(fileURL);
        }

        return new Deck([], "Empty Deck");
    }

    private static async getDeckFromText(text: string): Promise<Deck> {
        const deckString = await this.aiEngine.generateFrom(text, AIIntent.createFlashcarDeckFromText());
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
        return deck.plainObject();
    }

    private static async getDeckFromAudio(url: URL): Promise<Deck> {
        return new Deck([], "Empty Deck"); // to implement
    }

    private static async getDeckFromFile(url: URL): Promise<Deck> {
        return new Deck([], "Empty Deck"); // to implement
    }
}