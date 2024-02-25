"use client";

import {
  ArrowSquareDown,
  Command,
  ClipboardText,
  Microphone,
  FilePlus,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Breakpoint } from "../hooks/use-breakpoints";

export default function OptionsBar({
  isHoveringFile,
  isStartingShortcut,
  breakpoint,
  screenHeight,
  onPressPaste,
  onPressFile,
}: {
  isHoveringFile: boolean;
  isStartingShortcut: boolean;
  breakpoint: Breakpoint;
  screenHeight: number;
  onPressPaste: () => void;
  onPressFile: () => void;
}) {
  const isMobile = () => {
    return breakpoint == Breakpoint.sm;
  };

  const iconSize = isMobile() ? 28 : 46;
  const activeOffset = -screenHeight / 1.3;

  const yOffset = (trigger: boolean) => {
    return trigger ? activeOffset : 0;
  };

  const transition = {
    type: "spring",
    stiffness: 100,
    damping: 30,
    duration: 0.2,
  };

  return (
    <div
      className={`fixed bottom-10 flex w-full basis-1/4 flex-row justify-center gap-4 px-5 md:bottom-0 ${isHoveringFile || isStartingShortcut ? "md:fixed md:-bottom-20" : "md:relative"} px-20 text-center text-sm text-stone-400 md:text-xl dark:text-stone-500`}
    >
      <motion.button
        layout
        className="flex h-full max-h-28 w-full max-w-[180px] flex-col items-center justify-center gap-1 p-1"
        type="button"
        id="fileSelection"
        onClick={onPressFile}
        whileInView={{
          y: yOffset(isHoveringFile),
          x: isHoveringFile ? 190 : 0,
          scale: isHoveringFile ? 2 : 1,
          opacity: isStartingShortcut ? 0 : 1,
        }}
        transition={transition}
      >
        {isMobile() ? (
          <FilePlus size={iconSize} />
        ) : (
          <ArrowSquareDown size={iconSize} />
        )}
        <p>{isMobile() ? "Select file" : "Drop file"}</p>
      </motion.button>

      <motion.button
        layout
        className="flex h-full max-h-28 w-full max-w-[180px] flex-col items-center justify-center gap-1 p-1"
        type="button"
        onClick={onPressPaste}
        whileInView={{
          y: yOffset(isStartingShortcut),
          scale: isStartingShortcut ? 2 : 1,
          opacity: isHoveringFile ? 0 : 1,
        }}
        transition={transition}
      >
        <div className="flex flex-row items-center">
          {isMobile() ? (
            <ClipboardText size={iconSize} />
          ) : (
            <Command size={iconSize} />
          )}
          <h1
            className={`hidden max-h-5 items-center text-4xl font-light md:flex ${isStartingShortcut ? "opacity-40" : "opacity-100"}`}
          >
            V
          </h1>
        </div>
        <p>Paste text</p>
      </motion.button>

      <motion.div
        layout
        className="flex h-full max-h-28 w-full max-w-[180px] flex-col items-center justify-center p-1"
        whileInView={{
          opacity: isStartingShortcut || isHoveringFile ? 0 : 1,
        }}
        transition={transition}
      >
        <Link
          href="/live"
          className="flex h-full w-full flex-col items-center justify-center gap-1"
        >
          <Microphone
            size={iconSize}
            className="text-stone-400 dark:text-stone-500"
            weight="regular"
          />
          <p>Record</p>
        </Link>
      </motion.div>
    </div>
  );
}
