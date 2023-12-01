"use client"

import { AnimatePresence, Variants, motion } from "framer-motion";
import { useState, useEffect, useRef, WheelEvent } from "react";
import { Card, Deck } from "../model/card-model";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import CardComponent from "./card-component";
import ExpandIcon from "@/app/icons/expand-icon";
import { useBreakpoints, Breakpoint } from "../hooks/use-breakpoints";

export default function DeckPreview({ deck }: { deck: Deck}) {
    const breakpoint = useBreakpoints();
    const isMobile = breakpoint == Breakpoint.sm;

    const carouselItemSize = isMobile ? 2 : 3;

    const [currentIdx, setCurrentIdx] = useState(carouselItemSize);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);

    function calculateCardFade(idx: number) { return 1 - (Math.abs(currentIdx - idx)/3) }

    function upperLimit(): number { return isExpanded ? currentIdx : currentIdx + carouselItemSize }
    function lowerLimit(): number { return isExpanded ? currentIdx : currentIdx - carouselItemSize }


    function handleClick() {
    }

    function carouselElement(idx: number, card: Card) {
        return <CardComponent
        isPlaceholder={false}
        breakpoint={breakpoint}
        card={card}
        fade={calculateCardFade(idx)} 
        expanded={isExpanded && idx==currentIdx} 
        flipped={isFlipped && idx==currentIdx}
        />
    }

    return (
    <>
    <div className="flex items-center content-center justify-center justify-items-center -space-x-36 md:-space-x-60">
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