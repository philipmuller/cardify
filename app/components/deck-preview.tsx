"use client"

import { AnimatePresence, Variants, motion } from "framer-motion";
import { useState, useEffect, useRef, WheelEvent } from "react";
import { Card, Deck } from "../model/card-model";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import CardComponent from "./card-component";
import ExpandIcon from "@/app/icons/expand-icon";
import { useBreakpoints, Breakpoint } from "../hooks/use-breakpoints";
import PreviewCard from "./preview-card";

export default function DeckPreview({ deck }: { deck: Deck}) {
    const breakpoint = useBreakpoints();
    const isMobile = breakpoint == Breakpoint.sm;

    const carouselItemSize = 2;

    const [currentIdx, setCurrentIdx] = useState(carouselItemSize);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);

    function calculateCardFade(idx: number) { return 1 - (Math.abs(currentIdx - idx)/3) }

    function upperLimit(): number { return currentIdx + carouselItemSize }
    function lowerLimit(): number { return currentIdx - carouselItemSize }


    function handleClick() {
    }

    function carouselElement(idx: number, card: Card) {
        return <PreviewCard text={card.front}/>
    }

    return (
    <>
    <div className="flex items-center content-center justify-center justify-items-center -space-x-36 md:-space-x-[25rem]">
        {deck.cards.map((card, idx) => {
            if (idx <= upperLimit() && idx >= lowerLimit()) {
                return (
                    carouselElement(idx, card) 
                );
            } 
        })}
    </div>
    </>
    );
  }