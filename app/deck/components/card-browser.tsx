"use client"

import { AnimatePresence, Variants, motion } from "framer-motion";
import { useState, useEffect, useRef, WheelEvent } from "react";
import { Card } from "../card-model";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import CardComponent from "./card-component";
import ExpandIcon from "@/app/icons/expand-icon";

export default function CardBrowser({ cards, liveMode }: { cards: Card[], liveMode?: boolean}) {
  
    const [currentIdx, setCurrentIdx] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const accumulatedDeltaY = useRef(0);
    const accumulatedDeltaX = useRef(0);
    const carouselItemSize = 3;

    useEffect(() => {
        console.log("RERUNNING EFFECT");

        if (liveMode) {
            for (let i = currentIdx; i < cards.length; i++) {
                setTimeout(() => {
                    move(i);
                }, 500+(500*(i-currentIdx)));
            }
        }
        var firstTimePress = true;
        var isLongPress = false;
        var keyUp = false;

        const handleKeyDown = async (event: KeyboardEvent) => {
            if (event.key == " ") {
                event.preventDefault();
                event.stopPropagation();

                if (keyUp) { //If the spacebar was lifted before this keydown event, this is a new press of the spacebar
                    
                } else if (!firstTimePress) { //If the spacebar was not lifted before this keydown event, this is a long press of the spacebar
                    isLongPress = true; //The expanded state is now closed the moment the key is lifted
                }

                console.log(`KEY DOWN | isLongPress = ${isLongPress} | keyUp = ${keyUp} | firstTimePress = ${firstTimePress}`);

                if (!isLongPress) {
                    setIsExpanded((prev) => !prev);
                }

                firstTimePress = false;
            }

            if (event.key == "ArrowRight") {
                event.preventDefault();
                event.stopPropagation();
                next();
            }

            if (event.key == "ArrowLeft") {
                event.preventDefault();
                event.stopPropagation();
                prev();
            }

            
        }

        const handleKeyUp = async (event: KeyboardEvent) => {
            if (event.key == " ") {
                event.preventDefault();
                event.stopPropagation();
                keyUp = true;

                console.log(`KEY UP | isLongPress = ${isLongPress} | keyUp = ${keyUp}`);

                if (isLongPress) { //If the spacebar was lifted after a long press, close the expanded state
                    //setIsExpanded(() => false);
                    //isLongPress = false;
                } else { //If the spacebar was lifted after a short press, toggle the expanded state
                }
            }
        }

        
        function handleScroll(event: globalThis.WheelEvent) {
            if (isExpanded) { return; }
            event.preventDefault();
            event.stopPropagation();

            accumulatedDeltaY.current += event.deltaY;
            accumulatedDeltaX.current += event.deltaX;
            if (accumulatedDeltaY.current < -80 || accumulatedDeltaX.current < -80) {
                prev();
                accumulatedDeltaY.current = 0;
                accumulatedDeltaX.current = 0;
            } else if (accumulatedDeltaY.current > 80 || accumulatedDeltaX.current > 80) {
                next();
                accumulatedDeltaY.current = 0;
                accumulatedDeltaX.current = 0;
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        document.addEventListener('wheel', handleScroll, {passive:false});

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            document.removeEventListener('wheel', handleScroll);
        };

    
    }, [cards, isExpanded]);

    function calculateZ(idx: number) { return 10 - Math.abs(currentIdx - idx) }
    function calculateScale(idx: number) { return 1 - (Math.abs(currentIdx - idx)/20) }
    function calculateOpacity(idx: number) { return (idx == currentIdx+carouselItemSize || idx == currentIdx-carouselItemSize) ? 0 : 1}
    function calculateCardFade(idx: number) { return 1 - (Math.abs(currentIdx - idx)/3) }
    function calculateOffset(idx: number) { return Math.exp((Math.abs(currentIdx-idx))/2.2)*20*(currentIdx - idx) }

    function next() {
        setCurrentIdx((prev) => {
            if (prev < cards.length - 1) {
                return prev + 1;
            }
            return prev;
        });
    }

    function prev() {
        setCurrentIdx((prev) => {
            if (prev > 0) {
                return prev - 1;
            }
            return prev;
        });
    }
    
    function move(idx: number) { if (idx >= 0 && idx < cards.length) { setCurrentIdx(() => idx) } }

    function limitAdjustments() {
        if (isExpanded) { return 0 };

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

    function upperLimit(): number { return isExpanded ? currentIdx : currentIdx + carouselItemSize }
    function lowerLimit(): number { return isExpanded ? currentIdx : currentIdx - carouselItemSize }

    const browserElementAnimationStates: Variants = {
        regular: idx => ({
            x: calculateOffset(idx),
            y: isExpanded && idx == currentIdx ? -150 : 0,
            zIndex: calculateZ(idx),
            scale: calculateScale(idx),
            opacity: 1,
        }),
        offscreenVertical: idx => ({
            x: calculateOffset(idx),
            y: -400,
            zIndex: calculateZ(idx),
            scale: calculateScale(idx),
            opacity: 0,
        }),
        leftOffscreenHorizontal: idx => ({
            x: -10,
            y: 0,
            zIndex: calculateZ(idx),
            scale: calculateScale(idx),
            opacity: 0,
        }),
        rightOffscreenHorizontal: idx => ({
            x: 10,
            y: 0,
            zIndex: calculateZ(idx),
            scale: calculateScale(idx),
            opacity: 0,
        }),
    }

    function calculateBrowserElementAnimation(idx: number) {
        if (idx == currentIdx) {
            return "regular";
        } else if (idx == lowerLimit()) {
            return "leftOffscreenHorizontal";
        } else if (idx == upperLimit()) {
            return "rightOffscreenHorizontal";
        } else {
            return "regular";
        }

    }

    function handleClick(idx: number) {
        if (idx == currentIdx) {
            //setIsExpanded((prev) => !prev);
        } else {
            move(idx);
        }
    }

    return (
    <>
    <motion.div 
    className="flex items-center content-center justify-center justify-items-center -space-x-32" 
    animate={{x: limitAdjustments()}}
    transition={{ 
        type: "tween",  
        duration: 0.1
    }}>
    {/* <AnimatePresence> */}
        {cards.map((card, idx) => {
            if (idx <= upperLimit() && idx >= lowerLimit()) {
                return (
                    <motion.div
                    onClick={() => move(idx)}
                    key={idx}
                    custom={idx}
                    variants={browserElementAnimationStates}
                    initial={false}
                    animate={calculateBrowserElementAnimation(idx)}
                    //exit={"offscreenHorizontal"}
                    transition={{ 
                        type: "tween",  
                        duration: 0.1
                      }}
                    >
                        <CardComponent card={card} fade={calculateCardFade(idx)} expanded={isExpanded && idx==currentIdx} />

                    </motion.div>
                    
                );
            }  
        })}
    {/* </AnimatePresence> */}
    </motion.div>

    <div className={`flex flex-row gap-10 ${isExpanded ? "-translate-y-[150px]" : ""}`}>
        <button onClick={prev}><ArrowLeft size={32} color="#57534e"/></button>
        <button onClick={() => setIsExpanded(!isExpanded)}><ExpandIcon color="#57534e" close={isExpanded}/></button>
        {/* <p className="text-stone-500">{currentIdx+1}/{cards.length}</p> */}
        <button onClick={next}><ArrowRight size={32} color="#57534e"/></button>
    </div>

    </>
    );
  }