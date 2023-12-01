"use client"

import { AnimatePresence, Variants, motion } from "framer-motion";
import { useState, useEffect, useRef, WheelEvent } from "react";
import { Card, Deck } from "../model/card-model";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import CardComponent from "./card-component";
import ExpandIcon from "@/app/icons/expand-icon";
import { useBreakpoints, Breakpoint } from "../hooks/use-breakpoints";
import PreviewCard from "./preview-card";

export default function DeckPreview({ deck, debugColor }: { deck: Deck, debugColor?: string}) {

    const numberOfCardsLimit = 4;
    const numberOfCards = Math.min(deck.cards.length, numberOfCardsLimit);

    function handleClick() {
    }

    function carouselElement(idx: number, card: Card) {
        
        return (
            <div className={`h-80 w-80 md:h-96 md:w-96 xl:w-130 xl:h-130 aspect-square flex items-center justify-center`} key={idx}>
                
            <motion.div
                className={`
                text-base 
                ease-in-out 
                duration-300 
                transition-transform 
                ${idx==(numberOfCards-1) ? "" : "hover:-rotate-6 hover:-translate-x-5 hover:-translate-y-36"} 
                bg-white dark:bg-[#23201F] 
                p-12 
                md:text-xl
                text-stone-700 
                dark:text-stone-200 
                bg-cover 
                rounded-5xl 
                w-3/4 
                h-full 
                text-black 
                drop-shadow-2xl`}
            >
                <p className="line-clamp-[11]">{card.front}</p>
            </motion.div>
        </div>
        );
    }

    return (
    <>
    <div className="flex items-center content-center justify-center justify-items-center -space-x-72 md:-space-x-[23rem] xl:-space-x-[25rem]">
        {deck.cards.map((card, idx) => {
            if (idx < numberOfCardsLimit) {
                return (
                    // <div key={idx} className="w-52 h-52 min-w-[13rem] bg-yellow-500"/>
                    carouselElement(idx, card) 
                );
            } 
        })}
    </div>
    </>
    );
  }