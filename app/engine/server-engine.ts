import { ReadStream } from "fs";
import { Deck , Card } from "../model/card-model";
import { AIEngine, OpenAIEngine, DemoAIEngine } from "./ai-engine";
import { AIIntent } from "./ai-intent";
import { DatabaseEngine, FirebaseEngine } from "./database-engine";
import { FileEngine } from "./file-engine";
import { FileType } from "../model/file-type";


export abstract class LighthouseEngine {
    private static demoMode: boolean = true; //demo mode disables AI calls and replaces them with static responses

    private static aiEngine: AIEngine = this.demoMode ? new DemoAIEngine() : new OpenAIEngine();
    private static databaseEngine: DatabaseEngine = FirebaseEngine;
    
    static auth() {
        //Implement authentication
    }

    //File management ---------
    static async donwloadFile(url: string, filename: string): Promise<string> {
        return FileEngine.downloadFile(url, filename);
    }

    static readFile(path: string): ReadStream {
        return FileEngine.readFile(path);
    }

    //AI features -------------
    static async getTranscription(file: ReadStream): Promise<string> {
        return this.aiEngine.transcribe(file);
    }

    static async getDeckFromText(text: string): Promise<Deck> {
        return this.getDeck(text, AIIntent.createFlashcarDeckFromText());
    }

    static async getDeckFromFile(url: string, fileType: FileType): Promise<Deck> {
        console.log("!!! IMPORTANT CHECK. FileType: " + fileType);
        const path = await this.donwloadFile(url, "temp." + Object.keys(FileType)[Object.values(FileType).indexOf(fileType)]);
        const file = await this.readFile(path);

        if (fileType == FileType.mp3 || fileType == FileType.wav || fileType == FileType.webm) {
            const transcription = await this.getTranscription(file);
            return await this.getDeck(transcription, AIIntent.createFlashcarDeckFromLiveAudioTranscription());
        } else {
            return await this.getDeck("", AIIntent.createFlashcarDeckFromFile(), file);
        }

    }

    private static async getDeck(text: string, intent: AIIntent, file?: ReadStream): Promise<Deck> {
        const deckString = await this.aiEngine.generateFrom(text, intent,);
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
        return deck;
    }
}