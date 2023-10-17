import { openAIKey } from "@/keychain";
import OpenAI from "openai";

export interface Card {
    front: string;
    back: string;
}
  
export interface Deck {
    title: string;
    cards: Card[];
}

export class DeckCreatorService {

    static systemPrompt = "You are a flashcard generator. Read, analyze and understand the user submitted text below. After that, create a title of what the text is about of maximum 5 words and create a series of flashcards that capture the key concepts from the text. Make sure to format your response in the following format:\nTitle: /insert title here/\nQ: /insert question here/\nA: /insert answer here/\n Do not include any text other than a title and a sequence of Q and A strings on separated lines. Do not describe what you are doing or understanding, just output the lines following the described formatting.";
    static devMode = true;  

    private static async getRawData(inputText: string) {
        console.log("GET RAW DATA RUN");

        const openai = new OpenAI({ apiKey: openAIKey, dangerouslyAllowBrowser: true});
          
        if (DeckCreatorService.devMode) {
          return {
            choices: [
              {
                message: {
                  content: "Title: This is a test title\nQ: This is the first question\nA: This is the first answer\nQ: This is the second question\nA: This is the second answer\nQ: This is the third question\nA: This is the third answer\nQ: This is the fourth question\nA: This is the fourth answer\nQ: This is the fifth question\nA: This is the fifth answer\nQ: This is the sixth question\nA: This is the sixth answer\nQ: This is the seventh question\nA: This is the seventh answer\nQ: This is the eigth question\nA: This is the eighth answer"
                }
              }
            ],
          }
      
        } else {
          return await openai.chat.completions.create({
            messages: [
              {
                role: "system",
                content: DeckCreatorService.systemPrompt,
              },
              {
                role: "user",
                content: "" + inputText,
              },
            ],
            model: "gpt-3.5-turbo",
          });
        }
      }

      static async getDeck(inputText: string) {
        const rawData = await DeckCreatorService.getRawData(inputText);
        const rawString = rawData.choices[0].message.content ?? "";
        //console.log(rawString);
      
        let title: string = "";
        const cards: Card[] = [];
        let front = "";
        let back = "";
        let isFront = true;
        for (const part of rawString.split("\n")) {
          if (part.includes("Title:")) {
            title += part.substring(7);
          }
          if (part.startsWith("Q:")) {
            if (!isFront) {
              cards.push({ front, back });
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
        let deck: Deck = { title, cards };
        return { deck };
      }
    
}