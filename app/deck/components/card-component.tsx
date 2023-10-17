"use client"

import { motion } from "framer-motion";
import { Card } from "../card-model";
import { useState } from "react";

export default function CardComponent({ card }: { card: Card}) {

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
        className={`bg-gradient-to-r from-white to-orange-50 bg-cover rounded-5xl w-100 h-130 text-black flip-card-inner drop-shadow-2xl p-4`}
        initial={false}
        animate={{rotateY: isFlipped ? 180 : 360}}
        //whileTap={{ scale: 0.9, rotateY: 90, }}
        //onTap={changeIsFlipped}
        transition={{ type: "spring", stiffness: 100, damping: 10, duration: 0.08}}
        onClick={handleFlip}
        onAnimationComplete={()=>setIsAnimating(false)}
        >
        {isFlipped ? (
            <p className="scale-y-[-1] rotate-180">{card.back}</p>)
            :
            (<p>{card.front}</p>)
        }
        </motion.div>
    );

}
