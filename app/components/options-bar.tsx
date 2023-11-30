"use client";

import { ArrowSquareDown, Command, Record, ClipboardText, Microphone, FilePlus } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Breakpoint } from "../hooks/use-breakpoints";

export default function OptionsBar( { isHoveringFile, isStartingShortcut, breakpoint }: { isHoveringFile: boolean, isStartingShortcut: boolean, breakpoint: Breakpoint }) {

    const isMobile = () => { return (breakpoint == Breakpoint.sm) };

    const iconSize = isMobile() ? 28 : 46;
    return (
        <div className="flex flex-row justify-center gap-4 basis-1/4 px-5 fixed w-full bottom-20 md:bottom-0 md:relative text-sm md:text-xl text-stone-400 dark:text-stone-500 text-center px-14">

        <motion.button layout className="flex flex-col items-center justify-center p-1 w-full h-full max-w-[180px] max-h-28 gap-1"
        whileInView={{ y: isHoveringFile ? -600 : 0, x: isHoveringFile ? 290 : 0, scale: isHoveringFile ? 2 : 1 , opacity: isStartingShortcut ? 0 : 1}}
        transition={{ type: "spring", stiffness: 100, damping: 30, duration: 0.2}}>
          {isMobile() ?
            <FilePlus size={iconSize}/> 
            : <ArrowSquareDown size={iconSize}/>}
          <p>{isMobile() ? "Select file" : "Drop file"}</p>
        </motion.button>

        <motion.button layout className="flex flex-col items-center justify-center p-1 w-full h-full max-w-[180px] max-h-28 gap-1" 
        whileInView={{ y: isStartingShortcut ? -600 : 0, x: isStartingShortcut ? -10 : 0, scale: isStartingShortcut ? 2 : 1 , opacity: isHoveringFile ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 30, duration: 0.2}}>
          <div className="flex flex-row items-center">
            {isMobile() ?
            <ClipboardText size={iconSize}/> 
            : <Command size={iconSize}/>}
            <h1 className={`hidden md:flex text-4xl font-light max-h-5 items-center ${isStartingShortcut ? "opacity-40" : "opacity-100"}`}>V</h1>
          </div>
          <p>Paste text</p>
        </motion.button>
        
        <motion.div layout className="flex flex-col items-center justify-center p-1 w-full h-full max-w-[180px] max-h-28" 
        whileInView={{ opacity: isStartingShortcut || isHoveringFile ? 0 : 1}}
        transition={{ type: "spring", stiffness: 100, damping: 30, duration: 0.2}}>
          <Link href="/live" className="w-full h-full items-center justify-center flex flex-col gap-1">
            <Microphone size={iconSize} className="text-stone-400 dark:text-stone-500" weight="regular" />
            <p>Record</p>
          </Link>
        </motion.div>

      </div>
    );
}