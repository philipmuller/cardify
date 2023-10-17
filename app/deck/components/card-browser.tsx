"use client"

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Card, Deck, DeckCreatorService } from "../card-model";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import CardComponent from "./card-component";

export default function CardBrowser({ cards }: { cards: Card[]}) {
  
    const [currentIdx, setCurrentIdx] = useState(0);

    function calculateZ(idx: number) { return 10 - Math.abs(currentIdx - idx) }
    function calculateScale(idx: number) { return 1 - (Math.abs(currentIdx - idx)/10) }

    function forward() {
        if (currentIdx < cards.length - 1) {
            setCurrentIdx(currentIdx + 1);
        }
    }

    function back() {
        if (currentIdx > 0) {
            setCurrentIdx(currentIdx - 1);
        }
    }

    return (
    <>
        <div className="flex -space-x-32">
            {cards.map((card, idx) => {
            if (idx <= 3)
                return (
                <motion.div
                key={idx}
                whileInView={{ zIndex: calculateZ(idx), scale: calculateScale(idx)}}
                transition={{ type: "spring", stiffness: 100, damping: 10, duration: 0.1}}>
                    <CardComponent card={card}/>
                </motion.div>
                );
            })}
        </div>
        <div className="flex flex-row">
            <button onClick={back}><ArrowLeft size={32} color="#57534e"/></button>
            <p className="text-stone-500">{currentIdx+1}/{cards.length}</p>
            <button onClick={forward}><ArrowRight size={32} color="#57534e"/></button>
        </div>
    </>
    );
  }