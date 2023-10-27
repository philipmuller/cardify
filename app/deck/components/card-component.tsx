"use client"

import { motion } from "framer-motion";
import { Card } from "../card-model";
import { useState } from "react";

export default function CardComponent({ card, fade }: { card: Card, fade: number}) {

    const [isFlipped, setIsFlipped] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    function handleFlip() {
        if(!isAnimating) {
            setIsFlipped(!isFlipped);
            setIsAnimating(true);
        }
       
    }

    return (
        <motion.div
        className={`bg-white rounded-5xl w-100 h-130 text-stone-700 font-normal text-xl flip-card-inner shadow-[0_4px_43px_32px_rgba(206,206,206,0.25)] p-12`}
        initial={false}
        animate={{rotateY: isFlipped ? 180 : 360}}
        //whileTap={{ scale: 0.9, rotateY: 90, }}
        //onTap={changeIsFlipped}
        transition={{ type: "spring", stiffness: 100, damping: 10, duration: 0.08}}
        onClick={handleFlip}
        onAnimationComplete={()=>setIsAnimating(false)}
        >
        {isFlipped ? (
            <motion.p className="scale-y-[-1] rotate-180" animate={{ opacity: fade }}>{card.back}</motion.p>)
            :
            (<motion.p animate={{ opacity: fade }}>{card.front}</motion.p>)
        }
        </motion.div>
    );

}
