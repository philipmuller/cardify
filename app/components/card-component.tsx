"use client"

import { AnimatePresence, motion, Variants } from "framer-motion";
import { Card } from "../model/card-model";
import { useState } from "react";

export default function CardComponent({ card, fade, expanded, flipped, onClick}: { card: Card, fade: number, expanded: boolean, flipped: boolean, onClick: () => void }) {

    // const [isFlipped, setIsFlipped] = useState(flip ?? false);
    // const [isAnimating, setIsAnimating] = useState(false);

    const cardAnimationStates: Variants = {
        regular: {
          opacity: 1,
          rotateY: flipped ? 180 : 0, 
          width: "20rem", 
          minHeight: "28rem",
          maxHeight: "28rem",
        },
        expanded: {
          opacity: 1,
          rotateY: flipped ? 180 : 0, 
          width: "50rem", 
          minHeight: "50rem",
          maxHeight: "1000rem",
        },
        offscreen: {
          opacity: 0,
          width: "20rem", 
          height: "28rem",
        },
    }

    function frontOrBack() {
      if (flipped) {
        return <motion.p className={`scale-y-[-1] rotate-180 ${expanded ? "" : "line-clamp-[11]"}`} animate={{ opacity: fade }}>{card.back}</motion.p>
      } else {
        return <motion.p className={expanded ? "" : "line-clamp-[11]"} animate={{ opacity: fade }}>{card.front}</motion.p>
      }
    }

    return (
      <>
        <motion.div
        className={`bg-white dark:bg-[#23201F] rounded-5xl text-stone-700 dark:text-stone-200 font-normal flex text-xl overflow-hidden flip-card-inner shadow-[0_4px_43px_32px_rgba(206,206,206,0.25)] dark:shadow-[0_4px_43px_32px_rgba(28,25,23,0.4)] p-12`}
        key={card.id}
        variants={cardAnimationStates}
        initial={false}
        animate={expanded ? "expanded" : "regular"}
        layout
        onClick={onClick}
        transition={{ 
          type: "spring",
          damping: 20,  
          duration: 0.2
        }}
        >
          {frontOrBack()}
        </motion.div>
      </>

    );

}
