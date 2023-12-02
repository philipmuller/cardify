"use client";

import { ArrowSquareDown, Command, Record, ClipboardText, Microphone, FilePlus } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Breakpoint } from "../hooks/use-breakpoints";
import { useRef } from "react";

export default function OptionsBar( { isHoveringFile, isStartingShortcut, breakpoint, screenHeight, onPressPaste }: { isHoveringFile: boolean, isStartingShortcut: boolean, breakpoint: Breakpoint, screenHeight: number, onPressPaste: () => void }) {

    const isMobile = () => { return (breakpoint == Breakpoint.sm) };

    const inputFile = useRef<HTMLInputElement | null>(null);

    const iconSize = isMobile() ? 28 : 46;
    const activeOffset = -screenHeight/1.3;

    const yOffset = (trigger: boolean) => { return trigger? activeOffset : 0};

    const transition = { type: "spring", stiffness: 100, damping: 30, duration: 0.2};

    return (
        <div className={`flex flex-row justify-center gap-4 basis-1/4 px-5 fixed w-full bottom-10 md:bottom-0 ${isHoveringFile || isStartingShortcut ? 'md:fixed md:-bottom-20' : 'md:relative'} text-sm md:text-xl text-stone-400 dark:text-stone-500 text-center px-20`}>
        <motion.div layout className="flex flex-col items-center justify-center p-1 w-full h-full max-w-[180px] max-h-28 gap-1"
        // type="file"
        // id="file"
        // ref={inputFile}
        whileInView={{ 
            y: yOffset(isHoveringFile),
            x: isHoveringFile ? 190 : 0,
            scale: isHoveringFile ? 2 : 1 , 
            opacity: isStartingShortcut ? 0 : 1
        }}
        transition={transition}>
          {isMobile() ?
            <FilePlus size={iconSize}/> 
            : <ArrowSquareDown size={iconSize}/>}
          <p>{isMobile() ? "Select file" : "Drop file"}</p>
        </motion.div>

        <motion.button layout className="flex flex-col items-center justify-center p-1 w-full h-full max-w-[180px] max-h-28 gap-1"
        type="button"
        onClick={onPressPaste}
        whileInView={{ 
            y: yOffset(isStartingShortcut),
            scale: isStartingShortcut ? 2 : 1 , 
            opacity: isHoveringFile ? 0 : 1 
        }}
        transition={transition}
        >
          <div className="flex flex-row items-center">
            {isMobile() ?
            <ClipboardText size={iconSize}/> 
            : <Command size={iconSize}/>}
            <h1 className={`hidden md:flex text-4xl font-light max-h-5 items-center ${isStartingShortcut ? "opacity-40" : "opacity-100"}`}>V</h1>
          </div>
          <p>Paste text</p>
        </motion.button>
        
        <motion.div layout className="flex flex-col items-center justify-center p-1 w-full h-full max-w-[180px] max-h-28" 
        whileInView={{
            opacity: isStartingShortcut || isHoveringFile ? 0 : 1
        }}
        transition={transition}>
          <Link href="/live" className="w-full h-full items-center justify-center flex flex-col gap-1">
            <Microphone size={iconSize} className="text-stone-400 dark:text-stone-500" weight="regular" />
            <p>Record</p>
          </Link>
        </motion.div>

      </div>
    );
}