"use client";

import { Variants, motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "../model/card-model";
import { ArrowLeft, ArrowRight, Record, Stop, StopCircle, VinylRecord, X, XCircle } from "@phosphor-icons/react";
import CardComponent from "./card-component";
import ExpandIcon from "@/app/icons/expand-icon";
import { useBreakpoints, Breakpoint } from "../hooks/use-breakpoints";
import { PreviewDisplay, PreviewDisplayState } from "./preview-display";

export default function CardBrowser({
  cards,
  liveMode,
  title = "Untitled deck",
  onClose,
  startRecording,
  stopRecording,
}: {
  cards: Card[];
  liveMode?: boolean;
  title?: string;
  onClose?: () => void;
  startRecording?: () => void;
  stopRecording?: () => void;
}) {
  console.log("CardBrowser rendering");
  
  const breakpoint = useBreakpoints();
  const isMobile = breakpoint == Breakpoint.sm;

  const carouselItemSize = isMobile ? 2 : 3;

  const [currentIdx, setCurrentIdx] = useState(carouselItemSize);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const accumulatedDeltaY = useRef(0);
  const accumulatedDeltaX = useRef(0);

  const expandedCardTranslation = isMobile ? 40 : 110;

  useEffect(() => {
    console.log("RERUNNING EFFECT");

    if (liveMode) {
      for (let i = currentIdx; i < cards.length + carouselItemSize; i++) {
        setTimeout(
          () => {
            move(i);
          },
          500 + 500 * (i - currentIdx),
        );
      }
    }
  }, [cards]);

  useEffect(() => {
    var firstTimePress = true;
    var isLongPress = false;
    var keyUp = false;

    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.key == " ") {
        event.preventDefault();
        event.stopPropagation();

        if (keyUp) {
          //If the spacebar was lifted before this keydown event, this is a new press of the spacebar
        } else if (!firstTimePress) {
          //If the spacebar was not lifted before this keydown event, this is a long press of the spacebar
          isLongPress = true; //The expanded state is now closed the moment the key is lifted
        }

        console.log(
          `KEY DOWN | isLongPress = ${isLongPress} | keyUp = ${keyUp} | firstTimePress = ${firstTimePress}`,
        );

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

      if (event.key == "Enter") {
        event.preventDefault();
        event.stopPropagation();
        setIsFlipped((prev) => !prev);
      }
    };

    const handleKeyUp = async (event: KeyboardEvent) => {
      if (event.key == " ") {
        event.preventDefault();
        event.stopPropagation();
        keyUp = true;

        console.log(`KEY UP | isLongPress = ${isLongPress} | keyUp = ${keyUp}`);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    function handleScroll(event: globalThis.WheelEvent) {
      if (isExpanded) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();

      accumulatedDeltaY.current += event.deltaY;
      accumulatedDeltaX.current += event.deltaX;
      if (accumulatedDeltaY.current < -80 || accumulatedDeltaX.current < -80) {
        prev();
        accumulatedDeltaY.current = 0;
        accumulatedDeltaX.current = 0;
      } else if (
        accumulatedDeltaY.current > 80 ||
        accumulatedDeltaX.current > 80
      ) {
        next();
        accumulatedDeltaY.current = 0;
        accumulatedDeltaX.current = 0;
      }
    }

    document.addEventListener("wheel", handleScroll, { passive: false });

    return () => {
      document.removeEventListener("wheel", handleScroll);
    };
  }, [isExpanded]);

  function calculateZ(idx: number) {
    return 10 - Math.abs(currentIdx - idx);
  }
  function calculateScale(idx: number) {
    return 1 - Math.abs(currentIdx - idx) / 20;
  }
  function calculateOpacity(idx: number) {
    return idx == currentIdx + carouselItemSize ||
      idx == currentIdx - carouselItemSize
      ? 0
      : 1;
  }
  function calculateCardFade(idx: number) {
    return 1 - Math.abs(currentIdx - idx) / 3;
  }
  function calculateOffset(idx: number) {
    return Math.exp(Math.abs(currentIdx - idx) / 2.2) * 20 * (currentIdx - idx);
  }

  const next = useCallback(() => {
    setCurrentIdx((prev) => {
      if (prev < cards.length + carouselItemSize - 1) {
        setIsFlipped(false);
        return prev + 1;
      }
      return prev;
    });
  }, [cards.length, carouselItemSize]);

  const prev = useCallback(() => {
    setCurrentIdx((prev) => {
      if (prev > carouselItemSize) {
        setIsFlipped(false);
        return prev - 1;
      }
      return prev;
    });
  }, [carouselItemSize]);

  function move(idx: number) {
    console.log(
      `MOVE | idx = ${idx} | currentIdx = ${currentIdx} | isFlipped = ${isFlipped}`,
    );
    if (idx >= carouselItemSize && idx < cards.length + carouselItemSize) {
      setIsFlipped(() => false);
      setCurrentIdx(() => idx);
    }
  }

  function generateCarouselDeck() {
    var nullCards: Card[] = [];

    for (let i = 0; i < carouselItemSize; i++) {
      nullCards.push(Card.empty());
    }
    return [...nullCards, ...cards, ...nullCards];
  }

  function upperLimit(): number {
    return isExpanded ? currentIdx : currentIdx + carouselItemSize;
  }
  function lowerLimit(): number {
    return isExpanded ? currentIdx : currentIdx - carouselItemSize;
  }

  const browserElementAnimationStates: Variants = {
    regular: (idx) => ({
      x: calculateOffset(idx),
      y: isExpanded && idx == currentIdx ? -expandedCardTranslation : 0,
      zIndex: calculateZ(idx),
      scale: calculateScale(idx),
      opacity: 1,
    }),
    offscreenVertical: (idx) => ({
      x: calculateOffset(idx),
      y: -400,
      zIndex: calculateZ(idx),
      scale: calculateScale(idx),
      opacity: 0,
    }),
    leftOffscreenHorizontal: (idx) => ({
      x: -10,
      y: 0,
      zIndex: calculateZ(idx),
      scale: calculateScale(idx),
      opacity: 0,
    }),
    rightOffscreenHorizontal: (idx) => ({
      x: 10,
      y: 0,
      zIndex: calculateZ(idx),
      scale: calculateScale(idx),
      opacity: 0,
    }),
  };

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
      setIsFlipped((prev) => !prev);
    } else {
      move(idx);
    }
  }

  function carouselElement(idx: number, card: Card) {
    if (idx < carouselItemSize || idx >= cards.length + carouselItemSize) {
      return <CardComponent isPlaceholder={true} breakpoint={breakpoint} />;
    } else {
      return (
        <CardComponent
          isPlaceholder={false}
          breakpoint={breakpoint}
          card={card}
          fade={calculateCardFade(idx)}
          expanded={isExpanded && idx == currentIdx}
          flipped={isFlipped && idx == currentIdx}
          onClick={() => handleClick(idx)}
        />
      );
    }
  }

  return (
    <div className="flex flex-col justify-start items-center h-full gap-14">
      <div className="flex flex-row justify-evenly items-center w-screen">
        {(onClose) && (!isExpanded) && <div className="w-8 max-w-[32px]">
          {liveMode && <button
            className="flex flex-col items-center justify-center relative"
            type="button"
            onClick={() => {
              if(isRecording)
              {
                stopRecording!();
                setIsRecording(false);
              } else {
                startRecording!();
                setIsRecording(true);
              }

              setFirstTime(false);
            }
            }
          >
            {isRecording ? (
              <StopCircle
                size={32}
                color="#57534e"
                weight="fill"
              />
            ) : (
              <Record size={32} color="#57534e" weight="fill"/>
            )}
            {firstTime && <p className="text-sm text-stone-600 absolute bg-white shadow-lg rounded-lg p-2 translate-y-12">
              {isRecording ? "Recording..." : "Start recording"}
            </p>}
          </button>}
        </div>}
        <h1 className="w-max text-center text-2xl font-semibold text-stone-600 lg:text-5xl dark:text-stone-300 flex flex-row items-center justify-center gap-3">
            <VinylRecord
                size={32}
                color="#ba1717"
                weight="fill"
                className="animate-spin"
                style={{opacity: (liveMode && isRecording) ? 1 : 0}}
            />
            {title}
            <div className="w-8 max-w-[32px]"/>
        </h1>
        {(onClose) && (!isExpanded) && <button
          onClick={() => onClose()}
          type="button"
          className="text-stone-600 dark:text-stone-300"
        >
          <XCircle
            size={32}
            className="text-stone-400 dark:text-stone-500"
          />
        </button>}
      </div>
      <div className="flex content-center items-center justify-center justify-items-center -space-x-36 md:-space-x-60">
        {(cards.length > 0) && generateCarouselDeck().map((card, idx) => {
          if (idx <= upperLimit() && idx >= lowerLimit()) {
            return (
              <motion.div
                key={idx}
                custom={idx}
                variants={browserElementAnimationStates}
                initial={false}
                animate={calculateBrowserElementAnimation(idx)}
                transition={{
                  type: "tween",
                  duration: 0.1,
                }}
              >
                {carouselElement(idx, card)}
              </motion.div>
            );
          }
        })}
        {(cards.length === 0) &&
          <PreviewDisplay state={PreviewDisplayState.hint} breakpoint={Breakpoint.md} screenHeight={0} />
        }
      </div>

      {(cards.length > 0) && <div
        className={`flex flex-row gap-10 ${isExpanded ? `-translate-y-[${expandedCardTranslation}px]` : ""}`}
      >
        <button onClick={() => prev()} type="button">
          <ArrowLeft className="text-stone-400 dark:text-stone-500" size={32} />
        </button>
        <button onClick={() => setIsExpanded(!isExpanded)} type="button">
          <ExpandIcon
            className="fill-stone-400 stroke-stone-400 dark:fill-stone-500 dark:stroke-stone-500"
            close={isExpanded}
          />
        </button>
        {/* <p className="text-stone-500">{currentIdx+1}/{cards.length}</p> */}
        <button onClick={() => next()} type="button">
          <ArrowRight
            size={32}
            className="text-stone-400 dark:text-stone-500"
          />
        </button>
      </div>}
    </div>
  );
}
