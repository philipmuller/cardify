import { AIIntent } from "./ai-intent";
import { OpenAI } from "openai";
import { openAIKey } from "@/keychain";
import { ChatCompletion } from "openai/resources/chat/index.mjs";
import { get } from "http";

//Classess that implement AIEngine can be used in cardybee

export interface AIEngine {
    generateFrom(text?: string, intent?: AIIntent): Promise<any>;

}

export class OpenAIEngine implements AIEngine {

    openai = new OpenAI({ apiKey: openAIKey, dangerouslyAllowBrowser: false});
    model = "gpt-3.5-turbo";

    async generateFrom(text: string, intent?: AIIntent): Promise<string> {
        intent = intent ?? AIIntent.generic()

        const response = await this.request(text, intent);
        return response.choices[0].message.content ?? "";
    }

    private async request(user: string, intent: AIIntent): Promise<ChatCompletion> {
        var content = user;

        if (intent.promptTemplate != null) {
            content = intent.promptTemplate.prepend + content + intent.promptTemplate.append;
        }

        return await this.openai.chat.completions.create({
            messages: [
              {
                role: "system",
                content: intent.system,
              },
              {
                role: "user",
                content: content,
              },
            ],
            model: this.model,
        });
    }

}


export class DemoAIEngine implements AIEngine {
    async generateFrom(text: string, intent?: AIIntent): Promise<string> {
        return this.generateMockStringDeck(8);
    }

    private generateMockStringDeck(numberOfCards: number): string {
        var deckString = "Title: This is a test title";

        for (let i = 0; i < numberOfCards; i++) {
            const question = "Q: This is the " + i + " question";
            const answer = "A: This is the " + i + " answer";
            deckString += "\n" + question + "\n" + answer;

            if (i == Math.round(numberOfCards/2)) {
                var longQuestion = "Q: Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
                var longAnswer = "A: Nulla sit amet odio eu erat gravida iaculis et id nulla.";

                for (let j = 0; j < 30; j++) {
                    longQuestion += " Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
                    longAnswer += " Nulla sit amet odio eu erat gravida iaculis et id nulla.";
                }

                deckString += "\n" + longQuestion + "\n" + longAnswer;
            }
        }

        return deckString;
    }
}