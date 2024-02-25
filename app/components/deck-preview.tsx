"use client";

import { motion } from "framer-motion";
import { Card, Deck } from "../model/card-model";

export default function DeckPreview({
  deck,
  debugColor,
}: {
  deck: Deck;
  debugColor?: string;
}) {
  const numberOfCardsLimit = 4;
  const numberOfCards = Math.min(deck.cards.length, numberOfCardsLimit);

  function carouselElement(idx: number, card: Card) {
    return (
      <div
        className={`xl:w-130 xl:h-130 flex aspect-square h-80 w-80 items-center justify-center md:h-96 md:w-96`}
        key={idx}
      >
        <motion.div
          className={`
                text-base
                transition-transform
                duration-300
                ease-in-out
                ${idx == numberOfCards - 1 ? "" : "hover:-translate-x-5 hover:-translate-y-36 hover:-rotate-6"}
                rounded-5xl h-full
                w-3/4
                bg-white
                bg-cover
                p-12
                text-stone-700
                drop-shadow-2xl
                md:text-xl
                dark:bg-[#23201F]
                dark:text-stone-200`}
        >
          <p className="line-clamp-[11]">{card.front}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="flex content-center items-center justify-center justify-items-center -space-x-72 md:-space-x-[23rem] xl:-space-x-[25rem]">
        {deck.cards.map((card, idx) => {
          if (idx < numberOfCardsLimit) {
            return carouselElement(idx, card);
          }
        })}
      </div>
    </>
  );
}
