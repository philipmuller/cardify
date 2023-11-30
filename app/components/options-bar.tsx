"use client";

import { ArrowSquareDown, Command, Record, ClipboardText } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Breakpoint } from "../hooks/use-breakpoints";

export default function OptionsBar( { isHoveringFile, isStartingShortcut, breakpoint }: { isHoveringFile: boolean, isStartingShortcut: boolean, breakpoint: Breakpoint }) {

    const isMobile = () => { return (breakpoint == Breakpoint.sm) };
    return (
        <div className="flex flex-row justify-center gap-4 basis-1/4 px-5 fixed w-full bottom-20 md:bottom-0 md:relative">

        <motion.button layout className="flex flex-col items-center justify-center p-1 w-36 max-h-28"
        whileInView={{ y: isHoveringFile ? -600 : 0, x: isHoveringFile ? 290 : 0, scale: isHoveringFile ? 2 : 1 , opacity: isStartingShortcut ? 0 : 1}}
        transition={{ type: "spring", stiffness: 100, damping: 30, duration: 0.2}}>
          <ArrowSquareDown size={42} className="mb-1.5 text-stone-400 dark:text-stone-500"/>
          <p className="text-lg text-stone-400 dark:text-stone-500 text-center">Drop any file</p>
        </motion.button>

        <motion.button layout className="flex flex-col items-center justify-center p-1 w-36 max-h-28" 
        whileInView={{ y: isStartingShortcut ? -600 : 0, x: isStartingShortcut ? -10 : 0, scale: isStartingShortcut ? 2 : 1 , opacity: isHoveringFile ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 30, duration: 0.2}}>
          <div className="flex flex-row items-center mb-1.5">
            {isMobile() ?
            <ClipboardText className="text-stone-400 dark:text-stone-500" size={42} /> 
            : <Command className="text-stone-400 dark:text-stone-500" size={42} />}
            <h1 className={`hidden md:flex text-4xl text-stone-400 dark:text-stone-500 max-h-5 items-center ${isStartingShortcut ? "opacity-40" : "opacity-100"}`}>V</h1>
          </div>
          <p className="text-lg text-stone-500 text-center">Paste any text</p>
        </motion.button>
        
        <motion.div layout className="flex flex-col items-center justify-center p-1 w-36 max-h-28" 
        whileInView={{ opacity: isStartingShortcut || isHoveringFile ? 0 : 1}}
        transition={{ type: "spring", stiffness: 100, damping: 30, duration: 0.2}}>
          <Link href="/live" className="w-full h-full items-center justify-center flex flex-col">
            <div className="text-4xl mb-1.5 text-stone-400 dark:text-stone-500 flex flex-row items-center">
              <Record size={42} className="text-stone-400 dark:text-stone-500" weight="fill" />
             
            </div>
            <p className="text-lg text-stone-400 dark:text-stone-500 text-center">Record any lecture</p>
          </Link>
        </motion.div>

      </div>
    );
}