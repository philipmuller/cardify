import { AIIntent } from "./ai-intent";
import { OpenAI } from "openai";
import { openAIKey } from "@/keychain";
import { Chat, ChatCompletion } from "openai/resources/chat/index.mjs";
import { ReadStream } from "fs";
import { Thread } from "openai/resources/beta/threads/threads.mjs";
import { MessageContentText, ThreadMessage } from "openai/resources/beta/threads/messages/messages.mjs";
import { Run } from "openai/resources/beta/threads/runs/runs.mjs";
import { Logger } from "./logging-engine";

//Classess that implement AIEngine can be used in cardybee

export interface AIEngine {
    generateFrom(text: string, intent: AIIntent, file?: ReadStream): Promise<any>;
    transcribe(file: ReadStream): Promise<string>;
}

export class OpenAIEngine implements AIEngine {
    logger: Logger = new Logger("OpenAIEngine");
    openai = new OpenAI({ apiKey: openAIKey, dangerouslyAllowBrowser: false});
    generalAssistantId: string = "asst_SuEarQpkJfVzwtnDf0nnlnqO";
    model = "gpt-3.5-turbo";
    transcriptionModel = "whisper-1";
    checkIntervalMs = 1000;

    async generateFrom(text: string, intent: AIIntent, file?: ReadStream): Promise<string> {
        const lg = this.logger.subprocess("generateFrom");
        lg.logCall([text, intent, file]);

        intent = intent ?? AIIntent.generic()

        const response = await this.assistantRequest(text, intent, file);

        lg.logReturn(response);
        return response;
    }

    async transcribe(file: ReadStream): Promise<string> {
        const lg = this.logger.subprocess("transcribe");
        lg.logCall([file]);

        var transcription = "";

        try {
            const response = await this.openai.audio.transcriptions.create({
              file: file,
              model: this.transcriptionModel,
            });
            transcription = response.text;
        } catch (error) {
            console.log('ERROR IS:', error)
        }

        lg.logReturn(transcription);
        return transcription;
    }

    private async assistantRequest(text: string, intent: AIIntent, file?: ReadStream): Promise<string> {
        const lg = this.logger.subprocess("assistantRequest");
        lg.logCall([text, intent, file]);

        const thread = await this.openai.beta.threads.create();
        lg.log("Thread created: " + thread.id);

        let fileId: string | undefined = undefined;
        if (file != null && file != undefined) {
            fileId = await this.uploadFile(file);
        }
        //Add messages to thread
        if (intent.prependMessage) { await this.addMessage(intent.prependMessage, thread.id, fileId) }
        await this.addMessage(text, thread.id);
        if (intent.appendMessage) { await this.addMessage(intent.appendMessage, thread.id) }

        //Start run
        var run = await this.startRun(thread.id, intent);
        lg.log("Started run " + thread.id + intent.system);
        var response = await this.manageRun(run.id, thread.id);

        lg.logReturn(response ?? "");
        return response ?? "";
    }

    private async uploadFile(file: ReadStream): Promise<string> {
        const lg = this.logger.subprocess("uploadFile");
        lg.logCall([file]);

        const oaFile = await this.openai.files.create({
            file: file,
            purpose: "assistants",
        });

        lg.logReturn(oaFile.id);
        return oaFile.id;
    }

    private async manageRun(runId: string, threadId: string): Promise<string | null> {
        const lg = this.logger.subprocess("manageRun");
        lg.logCall([runId, threadId]);

        var run = await this.openai.beta.threads.runs.retrieve(threadId, runId);
        lg.log("Obtained a new run! Status: " + run.status);
        while (run.status == "in_progress" || run.status == "queued") {
            lg.log("Checking status...");
            await new Promise((resolve) => setTimeout(resolve, this.checkIntervalMs));
            run = await this.openai.beta.threads.runs.retrieve(threadId, run.id);
            lg.log("Status:" + run.status);
        }

        switch (run.status) {
            case "completed":
                const returnValue = await this.statusCompleted(threadId);
                lg.logReturn(returnValue);
                return returnValue;
                break;
            case "failed":
                break;
            case "requires_action":
                break;
            case "cancelling":
                break;
            case "cancelled":
                break;
            case "expired":
                break;
            default:
                break;
        }

        return null;
    }

    private async statusCompleted(threadId: string): Promise<string> {
        const lg = this.logger.subprocess("statusCompleted");
        lg.logCall([threadId]);

        const messages = await this.openai.beta.threads.messages.list(
            threadId
        );

        const lastMessageContent = messages.data[0].content; // Last message is the first in the array
        lg.log("Messags data array: " + JSON.stringify(messages.data));

        var text = "";
        lg.log("Last message count items: " + lastMessageContent.length);

        //We go through the array because the last message can be composed of multiple elements (text, images, etc.)
        for (let i = 0; i < lastMessageContent.length; i++) { 
            const lastMessageContentElement = lastMessageContent[i];
            lg.log(lastMessageContentElement);
            if (lastMessageContentElement.type == "text") {
                const textElement = lastMessageContentElement as MessageContentText;
                text += textElement.text.value;
            }
        }

        lg.logReturn(text);
        return text;
    }

    private async startRun(threadId: string, intent: AIIntent, assistantId?: string): Promise<Run> { //if no assistantId is provided, the general assistant is used
        const lg = this.logger.subprocess("startRun");
        lg.logCall([threadId, intent, assistantId]);

        const run = await this.openai.beta.threads.runs.create(
            threadId,
            { 
              assistant_id: assistantId ?? this.generalAssistantId,
              instructions: intent.system
            }
        );

        lg.logReturn(run);
        return run;
    }

    private async addMessage(content: string, threadId: string, fileId?: string): Promise<ThreadMessage> {
        const lg = this.logger.subprocess("addMessage");
        lg.logCall([content, threadId, fileId]);

        let fileIds: string[] = [];
        if (fileId != null && fileId != undefined) {
            fileIds.push(fileId);
        }
        const message = await this.openai.beta.threads.messages.create(
            threadId,
            {
              role: "user",
              content: content,
              file_ids: fileIds,
            }
        );

        lg.logReturn(message);
        return message;
    }

    private async request(text: string, intent: AIIntent, file?: ReadStream): Promise<ChatCompletion> {
        var content = text;

        content = intent.prependMessage ?? "" + content + intent.appendMessage ?? "";

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
    async generateFrom(text: string, intent: AIIntent, file?: ReadStream): Promise<string> {
        return this.generateMockStringDeck(8);
    }

    async transcribe(file: ReadStream): Promise<string> {
        return "This is a mock transcription";
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