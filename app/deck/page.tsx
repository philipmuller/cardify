"use client"

import OpenAI from "openai";
import { sys } from "typescript";
import { openAIKey } from "@/keychain";
import { title } from "process";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface Card {
  front: string;
  back: string;
}

interface Deck {
  title: string;
  cards: Card[];
}

async function getRawData(inputText: string) {
  const openai = new OpenAI({
    apiKey: openAIKey,
    dangerouslyAllowBrowser: true,
  });

  //console.log(inputText);

  const systemPrompt =
    "You are a flashcard generator. Read, analyze and understand the user submitted text below. After that, create a title of what the text is about of maximum 5 words and create a series of flashcards that capture the key concepts from the text. Make sure to format your response in the following format:\nTitle: /insert title here/\nQ: /insert question here/\nA: /insert answer here/\n Do not include any text other than a title and a sequence of Q and A strings on separated lines. Do not describe what you are doing or understanding, just output the lines following the described formatting.";

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


export default async function Deck({ searchParams }: { searchParams: { fileText: string } }) {

  const offsetsY = [0, 0, 0];
  const fileOffsetsY = [250, 300, 350];

  const offsetsX = [0, 0, 0];
  const fileOffsetsX = [190, 0, -190];

  const [cardNr, setCardNr] = useState(1);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHoveringFile, setIsHoveringFile] = useState(false);

  useEffect(() => {
    const handleWindowMouseMove = (event: { clientX: any; clientY: any; }) => {
      const { innerWidth: width, innerHeight: height } = window;

      const centerX = width / 2;
      const centerY = height / 2;

      //absolute distance from center
      const distX = centerX - event.clientX;
      const distY = centerY - event.clientY;

      setCoords({
        x: -distX,
        y: -distY,
      });
    };
    window.addEventListener('mousemove', handleWindowMouseMove);

    return () => {
      window.removeEventListener(
        'mousemove',
        handleWindowMouseMove,
      );
    };
  }, []);


  const input = searchParams.fileText;
  console.log(input);
  const deck = await getDeck(input);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        {deck.deck.title}
      </div>

      {/* <div className="flex -space-x-32">
        {Array.from({ length: 4 }).map((_, idx) => (
          <motion.div
            key={idx}
            className={`bg-gradient-to-r from-white to-orange-50 bg-cover rounded-5xl w-100 h-130 text-black drop-shadow-2xl p-4`}
            content="aaaa"
            initial={{ y: offsetsY[idx], z: idx }}
            whileInView={{ y: isHoveringFile ? fileOffsetsY[idx] : offsetsY[idx] + (coords.y / (10 + (20 * idx))), x: isHoveringFile ? fileOffsetsX[idx] : offsetsX[idx] + (coords.x / (10 + (20 * idx))), z: idx }}
            whileHover={{ scale: 1.07 }}
            transition={{ type: "spring", stiffness: isHoveringFile ? 100 : 50, damping: isHoveringFile ? 10 : 20, duration: isHoveringFile ? 0.1 : 1.0 }}
          />
        ))}
      </div> */}

      <div className="flex -space-x-32">
        {deck.deck.cards.map((card, idx) => {
          if (idx == cardNr || idx == cardNr + 1 || idx == cardNr + 2 || idx == cardNr + 3)
            return (
              <motion.div

                key={idx}
                className={`bg-gradient-to-r from-white to-orange-50 bg-cover rounded-5xl w-100 h-130 text-black drop-shadow-2xl p-4`}
                initial={{ y: offsetsY[idx], z: idx }}
                whileInView={{ y: isHoveringFile ? fileOffsetsY[idx] : offsetsY[idx] + (coords.y / (10 + (20 * idx))), x: isHoveringFile ? fileOffsetsX[idx] : offsetsX[idx] + (coords.x / (10 + (20 * idx))), z: idx }}
                whileHover={{ scale: 1.07 }}
                transition={{ type: "spring", stiffness: isHoveringFile ? 100 : 50, damping: isHoveringFile ? 10 : 20, duration: isHoveringFile ? 0.1 : 1.0 }}
              >
                {card.front}
                {card.back}
              </motion.div>

              // <div key={i} className="flex flex-col items-center justify-between">
              //   <div className="bg-gray-800 text-white px-4 py-2 rounded-lg">
              //     {card.front}
              //   </div>
              //   <div className="bg-gray-800 text-white px-4 py-2 rounded-lg">
              //     {card.back}
              //   </div>
              // </div>
            );
        }, [])}
      </div>

      
        <button onClick={() => console.log("aaa")}><FaArrowLeft/></button>
        {cardNr}
        /
        {deck.deck.cards.length}
        <button onClick={() => setCardNr(cardNr + 1)}><FaArrowRight/></button>

    </main>
  );
}
