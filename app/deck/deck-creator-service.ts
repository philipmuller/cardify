"use server"

import { Deck, Card } from "./card-model";
import { anthropicKey, openAIKey } from "@/keychain";
import OpenAI from "openai";
import { exec } from 'child_process';
import Anthropic from '@anthropic-ai/sdk';

const fs = require('fs');
const util = require('util');

export async function getDeck(text: string, isAudioFile: boolean): Promise<Deck> {
    console.log("DECK REQUESTED WITH TEXT:\n" + (isAudioFile ? "AUDIO FILE" : text));

    let result = await DeckCreatorService.getDeck(text, isAudioFile);
    console.log("DECK CREATED: " + JSON.stringify(result));
    return result;
}

enum AiEngineType {
    OpenAI,
    Anthropic
}

class DeckCreatorService {
    static devMode = true;
    static aiEngine: AiEngineType = AiEngineType.OpenAI;

    static textSystemPrompt = `
    You are a flashcard generator. 
    Read, analyze and understand the user submitted text below. 
    After that, create a title of what the text is about of maximum 5 words and create a series of flashcards that capture the key concepts from the text. 
    Make sure to format your response in the following format:
    \nTitle: /insert title here/
    \nQ: /insert question here/
    \nA: /insert answer here/
    \n Do not include any text other than a title and a sequence of Q and A strings on separated lines. 
    Do not describe what you are doing or understanding, just output the lines following the described formatting.`;

    static audioSystemPrompt = `
    You are a flashcard generator.
    What you can see below is the transcription of a lecture segment.
    Read, analyze and understand it. 
    After that, create a title of what this lecture segment is about of maximum 5 words and create a series of flashcards that capture the key concepts from the segments.
    IMPORTANT: use only information from the transcription to create the flashcards, do not use any other information you might have about the topic.
    If the segment doesn't contain enough information to create flashcards, return just the title and no cards.
    Make sure to format your response in the following format:
    \nTitle: /insert title here/
    \nQ: /insert question here/
    \nA: /insert answer here/
    \n Do not include any text other than a title and a sequence of Q and A strings on separated lines. 
    Do not describe what you are doing or understanding, just output the lines following the described formatting.`;

    static mockResponseText = `Title: This is a test title
    \nQ: What has allowed science fiction writers to speculate about the conditions on Venus?
    \nA: The opaque cloud cover of Venus.
    \nQ: This is the second question
    \nA: This is the second answer
    \nQ: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel placerat lectus. Nulla sit amet odio eu erat gravida iaculis et id nulla. Donec in feugiat velit. Sed mollis neque ornare felis elementum, id rutrum nulla bibendum. Nam malesuada posuere erat, quis maximus augue tempus a. Nam ullamcorper nulla nec ex aliquam, ac pulvinar elit congue. Maecenas tincidunt ac mauris nec tempus. Proin sem felis, vehicula eu massa sed, dictum fermentum ante. In neque nisi, luctus eget nibh eu, porttitor molestie metus. Sed quis tristique tortor. Maecenas accumsan non eros eget vestibulum. Nulla condimentum, tellus sit amet hendrerit viverra, sem ipsum feugiat ipsum, eu convallis mi ligula quis massa. Nullam sed tincidunt mauris. Praesent semper sapien nec elit aliquet, non semper sem facilisis. Quisque eget nulla magna. Praesent interdum in eros ac ultrices. Nullam et neque ante. Phasellus in ligula tristique, pulvinar ligula ut, dapibus ligula. Vivamus tempor finibus consequat. Mauris nec facilisis nisi, eu interdum lectus. Vestibulum tempus condimentum eros, a pharetra tortor semper at. Morbi efficitur efficitur hendrerit. Nunc convallis mauris nec ornare egestas. Nunc fermentum lacus dolor, sed scelerisque lacus rutrum sed. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec euismod diam nec sem volutpat, eget consequat neque sagittis. Nam ac faucibus odio. Donec tincidunt quam congue ullamcorper dictum. Sed est mi, pellentesque eget aliquam et, porttitor non metus. Fusce tristique est eu purus facilisis, sit amet dapibus mi tincidunt. Duis a hendrerit massa, non sollicitudin ipsum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas tristique nec lacus ullamcorper ultricies. Sed pharetra odio a quam sodales congue. Aenean ultricies augue enim, ac lacinia orci vulputate ac. Sed interdum non odio et eleifend. Nulla est ex, elementum a fermentum vitae, ornare id tortor. Duis dolor enim, dignissim in erat et, viverra congue metus. Aliquam dictum lectus vitae porttitor faucibus. Etiam viverra mollis orci ac vehicula. Phasellus fermentum varius leo, a tincidunt nulla.
    Etiam et dignissim ante, at finibus diam. Ut in eleifend turpis. Integer ac commodo massa. Donec nisi justo, elementum vestibulum tortor vel, cursus porta felis. Sed congue eleifend velit, ac efficitur lorem aliquam sit amet. Fusce diam sapien, euismod id egestas eget, posuere at tellus. Nam sed porttitor ligula, ut scelerisque erat. Pellentesque in turpis interdum, finibus nisi sed, tincidunt magna. Nunc tincidunt a enim eget lacinia. Cras in maximus erat, vitae venenatis metus. Donec non ornare urna. Phasellus turpis ex, consequat vitae leo eu, malesuada scelerisque lorem.
    Aliquam erat volutpat. Sed sit amet egestas mi. Aenean ullamcorper, risus sed porttitor aliquet, metus sem condimentum nisi, in mattis libero diam in quam. In eget augue nec orci dignissim eleifend. Suspendisse id purus in elit tristique lobortis eu non tortor. Suspendisse tellus justo, feugiat quis lacus eu, congue imperdiet neque. Vestibulum iaculis dolor eget lorem imperdiet efficitur. Aenean sit amet venenatis sem. Sed consequat, justo non molestie venenatis, arcu ligula interdum arcu, eu laoreet felis orci a massa. Curabitur eget vehicula ante. Nullam non velit non felis pulvinar euismod vitae congue dui. Suspendisse vel cursus libero, in eleifend ipsum. Nulla sed sapien neque. Pellentesque imperdiet ultrices pellentesque. Nunc sit amet tristique lacus.
    
    \nA: This is the third answer
    \nQ: This is the fourth question
    \nA: This is the fourth answer
    \nQ: This is the fifth question
    \nA: This is the fifth answer
    \nQ: This is the sixth question
    \nA: This is the sixth answer
    \nQ: This is HAPPY BIRTHDAY TO YOU
    \nA: This is the seventh answer
    \nQ: This is the odisnfoisdmfoidsmoidf
    \nA: This is the eighth answer
    \nQ: This is HELLO
    \nA: This is the ninth answer
    `;

    private static async getRawData(inputText: string, liveMode: boolean) {

        const openai = new OpenAI({ apiKey: openAIKey, dangerouslyAllowBrowser: false});
        const anthropic = new Anthropic({ apiKey: anthropicKey });
          
        if (DeckCreatorService.devMode) {
          if (this.aiEngine == AiEngineType.Anthropic) {
            return {
              completion: this.mockResponseText
            };
          } else {
            return {
              choices: [
                {
                  message: {
                    content: this.mockResponseText
                  }
                }
              ],
            };
          }
          
      
        } else {
          if (this.aiEngine == AiEngineType.Anthropic) {
            return await anthropic.completions.create({
              model: 'claude-instant-1',
              max_tokens_to_sample: 80000,
              prompt: `${Anthropic.HUMAN_PROMPT} ${liveMode ? this.audioSystemPrompt : this.textSystemPrompt} \n ${"" + inputText} \n ${Anthropic.AI_PROMPT}`,
            });

          } else {
            return await openai.chat.completions.create({
              messages: [
                {
                  role: "system",
                  content: liveMode ? DeckCreatorService.audioSystemPrompt : DeckCreatorService.textSystemPrompt,
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
      }

      private static async createWebmFromBase64(base64audioFile: string): Promise<string> {
        const inputPath = 'tmp/input.webm';
        const audio = Buffer.from(base64audioFile, 'base64');
        try {
            console.log("CREATING WEBM FROM BASE64");
            fs.writeFileSync('tmp/input.webm', audio);
        } catch (err) {
            console.error(err);
        }

        return inputPath;
      }

      private static async createMp3fromWebm(filePath: string): Promise<string> {

        console.log("CREATING MP3 FROM WEBM");
        const outputPath = 'tmp/output.mp3';
        try { 
            const execAsync = util.promisify(exec);
            console.log("ABOUT TO RUN FFMPEG");
            await execAsync(`ffmpeg -i ${filePath} ${outputPath} -y`);
            return outputPath;

        } catch (e) {
            console.log(e);
        }

        return "";
      }

      private static async getTranscription(base64audioFile: string): Promise<string> {
        console.log("GET TRANSCRIPTION RUN");

        fs.writeFileSync('tmp/input.txt', base64audioFile);

        const openai = new OpenAI({ apiKey: openAIKey, dangerouslyAllowBrowser: false});

        let webmPath = await DeckCreatorService.createWebmFromBase64(base64audioFile);
        let mp3Path = await DeckCreatorService.createMp3fromWebm(webmPath);
        const mp3AudioData = fs.createReadStream(mp3Path);
          
        if (DeckCreatorService.devMode) {
            return "This is a test transcription";

            fs.unlinkSync(webmPath);
            fs.unlinkSync(mp3Path);
        } else {

            let response = await openai.audio.transcriptions.create({
                file: await mp3AudioData,
                model: "whisper-1",
            }); 

            fs.unlinkSync(webmPath);
            fs.unlinkSync(mp3Path);

            console.log("TRANSCRIPTION RESPONSE: " + JSON.stringify(response));

            return response.text;
        }
      }

      static async getDeck(text: string, isAudioFile: boolean): Promise<Deck> {
        var inputText: string = "";

        if (!isAudioFile) {
            inputText = text;
        } else {
            console.log("AUDIO FILE DETECTED, starting transcription!");
            inputText = await DeckCreatorService.getTranscription(text);
        }
        const rawData = await DeckCreatorService.getRawData(inputText, isAudioFile);

        var rawString = "";

        if (this.aiEngine == AiEngineType.Anthropic) {
          const anthropicRawData = rawData as Anthropic.Completions.Completion;
          rawString = anthropicRawData.completion ?? "";
        } else {
          const openAIrawData = rawData as OpenAI.Chat.Completions.ChatCompletion;
          console.log("RAW DATA: " + JSON.stringify(openAIrawData));
          rawString = openAIrawData.choices[0].message.content ?? "";
        }
        console.log("RAW STRING: " + rawString);
    
        let title: string = "";
        const cards: Card[] = [];
        let front = "";
        let back = "";
        let isFront = true;
        for (const part of rawString.split("\n")) {
          console.log("PART: " + part);
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

        if (front != "" || back != "") {
            cards.push({ front, back });
        }
        
        let deck: Deck = { title, cards };
        return deck;
      }
    
}