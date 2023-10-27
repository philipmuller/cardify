"use server"

import { Deck, Card } from "./card-model";
import { openAIKey } from "@/keychain";
import OpenAI from "openai";
import { exec } from 'child_process';

const fs = require('fs');
const util = require('util');

export async function getDeck(text: string, isAudioFile: boolean): Promise<Deck> {
    console.log("DECK REQUESTED WITH TEXT:\n" + (isAudioFile ? "AUDIO FILE" : text));

    let result = await DeckCreatorService.getDeck(text, isAudioFile);
    console.log("DECK CREATED: " + JSON.stringify(result));
    return result;
}

class DeckCreatorService {

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


    static devMode = true;

    private static async getRawData(inputText: string, liveMode: boolean) {

        console.log("GET RAW DATA RUN");

        const openai = new OpenAI({ apiKey: openAIKey, dangerouslyAllowBrowser: false});
          
        if (DeckCreatorService.devMode) {
          return {
            choices: [
              {
                message: {
                  content: `Title: This is a test title
                  \nQ: What has allowed science fiction writers to speculate about the conditions on Venus?
                  \nA: The opaque cloud cover of Venus.
                  \nQ: This is the second question
                  \nA: This is the second answer
                  \nQ: This is the third question
                  \nA: This is the third answer
                  \nQ: This is the fourth question
                  \nA: This is the fourth answer
                  \nQ: This is the fifth question
                  \nA: This is the fifth answer
                  \nQ: This is the sixth question
                  \nA: This is the sixth answer
                  \nQ: This is the seventh question
                  \nA: This is the seventh answer
                  \nQ: This is the eigth question
                  \nA: This is the eighth answer`
                }
              }
            ],
          }
      
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
        return deck;
      }
    
}