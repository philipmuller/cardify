"use client";

import { motion, Variants } from "framer-motion";
import { Card } from "../model/card-model";
import { Breakpoint } from "../hooks/use-breakpoints";

export default function CardComponent({
  isPlaceholder,
  breakpoint,
  card,
  fade,
  expanded,
  flipped,
  onClick,
}: {
  isPlaceholder: boolean;
  breakpoint: Breakpoint;
  card?: Card;
  fade?: number;
  expanded?: boolean;
  flipped?: boolean;
  onClick?: () => void;
}) {
  const isMobile = breakpoint == Breakpoint.sm;

  const minRegular = isMobile ? "25rem" : "28rem";
  const maxRegular = isMobile ? "25rem" : "28rem";

  const minWidthExpanded = isMobile ? "85vw" : "50rem";
  const minHeightExpanded = isMobile ? "65vh" : "50rem";

  const cardAnimationStates: Variants = {
    regular: {
      opacity: 1,
      rotateY: flipped ? 180 : 0,
      width: minRegular,
      minWidth: minRegular,
      maxWidth: maxRegular,
      minHeight: minRegular,
      maxHeight: maxRegular,
    },
    expanded: {
      opacity: 1,
      rotateY: flipped ? 180 : 0,
      paddingLeft: "10px",
      paddingRight: "10px",
      minWidth: minWidthExpanded,
      minHeight: minHeightExpanded,
      maxHeight: "1000rem",
    },
    offscreen: {
      opacity: 0,
      width: "20rem",
      height: "28rem",
    },
  };

  function frontOrBack() {
    if (flipped) {
      return (
        <motion.p
          className={`rotate-180 scale-y-[-1] ${expanded ? "" : "line-clamp-[11]"}`}
          animate={{ opacity: fade }}
        >
          {card?.back}
        </motion.p>
      );
    } else {
      return (
        <motion.p
          className={expanded ? "" : "line-clamp-[11]"}
          animate={{ opacity: fade }}
        >
          {card?.front}
        </motion.p>
      );
    }
  }

  return (
    <motion.div
      className={`text-base text-stone-700 lg:text-xl ${isPlaceholder ? "invisible" : ""} flex justify-center font-normal dark:text-stone-200`}
      key={card?.id}
      variants={cardAnimationStates}
      initial={false}
      animate={expanded ? "expanded" : "regular"}
      layout
      onClick={onClick}
      transition={{
        type: "spring",
        damping: 20,
        duration: 0.2,
      }}
    >
      <div
        className={`bg-white dark:bg-[#23201F] ${expanded ? "w-full" : "w-3/4"} rounded-5xl flip-card-inner flex overflow-hidden p-12 shadow-[0_4px_43px_32px_rgba(206,206,206,0.25)] dark:shadow-[0_4px_43px_32px_rgba(28,25,23,0.4)]`}
      >
        {frontOrBack()}
      </div>
    </motion.div>
  );
}
