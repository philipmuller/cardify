import OpenAI from "openai";
import { sys } from "typescript";
import { openAIKey } from "@/keychain";

interface Card {
  front: string;
  back: string;
}

interface Deck {
  cards: Card[];
}

async function getRawData(inputText: string) {
  const openai = new OpenAI({
    apiKey: openAIKey,
  });

  //console.log(inputText);

  const systemPrompt =
    "You are a flashcard generator. Read, analyze and understand the user submitted text below. After that, create a series of flashcards that capture the key concepts from the text. Make sure to format your response in the following format:\nQ: /insert question here/\nA: /insert answer here/\n Do not include any text other than a sequence of Q and A strings on separated lines. Do not describe what you are doing or understanding, just output the lines following the described formatting.";

  //const systemPrompt = ("You are a multiple choice question generator. Read, analyze and understand the user submitted text below. After that, create a series of multiple choice questions that capture the key concepts from the text. Make sure to format your response in the following format:\nQ: /insert question here with options/ - /insert list of possible numbered answers separated by ;/. An example question string might look like 'Q: What is a cat? - 1. An animal; 2. A plant; 3. A star; 4. A galaxy;'\nA: /insert correct option here/. An example answer string may look like 'A: 1. An animal'\n Do not include any text other than a sequence of Q and A strings on separated lines. Do not use line breaks within your question or answer string. Do not describe what you are doing or understanding, just output the lines following the described formatting.");

  return await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: "" + inputText,
      },
    ],
    model: "gpt-3.5-turbo",
  });
}

async function getDeck(inputText: string) {
  const rawData = await getRawData(inputText);
  const rawString = rawData.choices[0].message.content ?? "";
  //console.log(rawString);

  const cards: Card[] = [];
  let front = "";
  let back = "";
  let isFront = true;
  for (const part of rawString.split("\n")) {
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
  return { cards };
}

export default async function Deck({ params }: { params: { input: string } }) {
  const input = params.input;
  console.log(input);
  const deck = await getDeck(input);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {deck.cards.map((card, i) => {
        return (
          <div key={i} className="flex flex-col items-center justify-between">
            <div className="bg-gray-800 text-white px-4 py-2 rounded-lg">
              {card.front}
            </div>
            <div className="bg-gray-800 text-white px-4 py-2 rounded-lg">
              {card.back}
            </div>
          </div>
        );
      }, [])}
    </main>
  );
}
