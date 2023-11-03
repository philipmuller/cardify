"use client"

import { AnimatePresence, motion, Variants } from "framer-motion";
import { Card } from "../card-model";
import { useState } from "react";

export default function CardComponent({ card, fade, expanded, flippable }: { card: Card, fade: number, expanded: boolean, flippable: boolean }) {

    const [isFlipped, setIsFlipped] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    function handleFlip() {
        if(flippable) {
            setIsFlipped(!isFlipped);
            setIsAnimating(true);
        }
       
    }

    const cardAnimationStates: Variants = {
        regular: {
          opacity: 1,
          rotateY: isFlipped ? 180 : 0, 
          width: "20rem", 
          minHeight: "28rem",
          maxHeight: "28rem",
        },
        expanded: {
          opacity: 1,
          rotateY: isFlipped ? 180 : 0, 
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
      if (isFlipped) {
        return <motion.p className={`scale-y-[-1] rotate-180 ${expanded ? "" : "line-clamp-[11]"}`} animate={{ opacity: fade }}>{card.back}</motion.p>
      } else {
        return <motion.p className={expanded ? "" : "line-clamp-[11]"} animate={{ opacity: fade }}>{card.front}</motion.p>
      }
    }

    return (
      <>
        <motion.div
        className={`bg-white dark:bg-stone-800 rounded-5xl text-stone-700 dark:text-stone-200 font-normal flex text-xl overflow-hidden flip-card-inner shadow-[0_4px_43px_32px_rgba(206,206,206,0.25)] dark:shadow-[0_4px_43px_32px_rgba(0,0,0,0.25)] p-12`}
        variants={cardAnimationStates}
        initial={false}
        animate={expanded ? "expanded" : "regular"}
        layout
        onClick={handleFlip}
        onAnimationComplete={()=>setIsAnimating(false)}
        // transition={{ 
        //   type: "spring", 
        //   stiffness: 100, 
        //   damping: 12, 
        //   duration: 0.3 
        // }}
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
