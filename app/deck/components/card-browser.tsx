"use client"

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Card } from "../card-model";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import CardComponent from "./card-component";

export default function CardBrowser({ cards, liveMode }: { cards: Card[], liveMode?: boolean}) {
  
    const [currentIdx, setCurrentIdx] = useState(0);
    const carouselItemSize = 3;

    useEffect(() => {
        if (liveMode) {
            for (let i = currentIdx; i < cards.length; i++) {
                setTimeout(() => {
                    move(i);
                }, 500+(500*(i-currentIdx)));
            }
        }
    }, [cards]);

    function calculateZ(idx: number) { return 10 - Math.abs(currentIdx - idx) }
    function calculateScale(idx: number) { return 1 - (Math.abs(currentIdx - idx)/20) }
    function calculateOpacity(idx: number) { return (idx == currentIdx+carouselItemSize || idx == currentIdx-carouselItemSize) ? 0 : 1}
    function calculateCardFade(idx: number) { return 1 - (Math.abs(currentIdx - idx)/3) }
    function calculateOffset(idx: number) { return Math.exp((Math.abs(currentIdx-idx))/2.2)*20*(currentIdx - idx) }

    function next() {
        if (currentIdx < cards.length - 1) {
            setCurrentIdx(currentIdx + 1);
        }
    }

    function prev() {
        if (currentIdx > 0) {
            setCurrentIdx(currentIdx - 1);
        }
    }

    function move(idx: number) {
        if (idx >= 0 && idx < cards.length) {
            setCurrentIdx(idx);
        }
    }

    function limitAdjustments() {
        let unit = 100;
        var value = carouselItemSize;
        if (currentIdx < carouselItemSize) {
            value = currentIdx;
        } else if (currentIdx > cards.length - 1 - carouselItemSize) {
            value = 2*carouselItemSize + currentIdx - (cards.length - 1);
        }

        //console.log(value);
        return (carouselItemSize - value) * unit;
    }

    return (
    <>
        <motion.div className="flex content-center justify-center justify-items-center -space-x-32"
        whileInView={{x: limitAdjustments()}}>
            {cards.map((card, idx) => {
            if (idx <= currentIdx + carouselItemSize && idx >= currentIdx - carouselItemSize)
                return (
                <motion.div
                layout
                key={idx}
                initial={{ opacity: 0, y: -800 }}
                exit={{ opacity: 0, y: -800 }}
                animate={{ y: 0, x: calculateOffset(idx), zIndex: calculateZ(idx), opacity: calculateOpacity(idx), scale: calculateScale(idx)}}
                transition={{ type: "spring", stiffness: 100, damping: 20, duration: 0.1}}>
                    <CardComponent card={card} fade={calculateCardFade(idx)}/>
                </motion.div>
                );
            })}
        </motion.div>
        <div className="flex flex-row">
            <button onClick={prev}><ArrowLeft size={32} color="#57534e"/></button>
            <p className="text-stone-500">{currentIdx+1}/{cards.length}</p>
            <button onClick={next}><ArrowRight size={32} color="#57534e"/></button>
        </div>
    </>
    );
  }