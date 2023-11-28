"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ConvertApi from "convertapi-js";
import { useEffect, useCallback } from "react";
import { useRouter, useSearchParams} from 'next/navigation';
import { ArrowSquareDown, Command, Record } from "@phosphor-icons/react";
import { useDetectPaste } from "./hooks/use-paste";
import { usePointerCoords } from "./hooks/use-pointer-coords";
import { useDropFile } from "./hooks/use-drop-file";
import { LanternEngine } from "./engine/client-engine";
import { FileType } from "./model/file-type";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./engine/firebase";


export default function Home() {
  const coords = usePointerCoords();
  const [ isHoveringFile, {enter, exit, over, drop} ] = useDropFile(handleDrop);
  const router = useRouter();
  const searchParams = useSearchParams()!;
  const [ isStartingShortcut ] = useDetectPaste(handlePaste);

  // check if user is logged in
  useEffect(() => onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      //do whatever
    } else {
      // User is signed out
      console.log("User is signed out.")
    }
  }))

  function calculateRotation(idx: number): number {
    const rotation = (idx - 1) * 20;
    var returnString = "";
    if (rotation >= 0) {
      returnString = `${rotation}`;
    } else {
      const positiveRotation = rotation * -1;
      returnString = `m${positiveRotation}`;
    }
    console.log(returnString);
    return rotation;
  }

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
  }, [searchParams]);

  const offsetsY = [90, -140, 0];
  const fileOffsetsY = [250, 300, 350];

  const offsetsX = [0, 0, 0];
  const fileOffsetsX = [190, 0, -190];

  const finalSwatches: [string] = [""];//"to-amber-50 dark:to-amber-950", "to-orange-50 dark:to-orange-950", "to-red-50 dark:to-red-950"];

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      router.push(LanternEngine.constructNewDeckUrlFromText(text));
    } catch (err) {
      console.log('Failed to read clipboard data.');
    }
  }

  async function handleDrop(e: any) {
    e.preventDefault();
    e.stopPropagation();
    console.log("File has been dropped");
    if (e.dataTransfer.files[0]) {
      //const convertApi = ConvertApi.auth({ apiKey: "111029228", token: "r2mjY2uK"});
      //let params = convertApi.createParams();
      //const convertapi = require('convertapi')(convertAPISecret);
      const file = e.dataTransfer.files[0];
      console.log(file);

      //params.add('file', file);
      //let result = await convertApi.convert("pdf", "txt", params);

      //let url = result.files[0].Url;
      //console.log(url);

      const uploadedFileUrl = await LanternEngine.uploadFile(file, FileType.pdf);
      router.push(LanternEngine.constructNewDeckUrlFromFile(uploadedFileUrl, FileType.pdf));
    }
  }

  return (
    <form className="flex-grow flex flex-col items-center justify-center" 
    onDragEnter={enter} 
    onDragLeave={exit} 
    onDrop={drop} 
    onDragOver={over}>
      <input
        placeholder="fileInput"
        className="hidden"
        type="file"
        multiple={true}
        accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf"
      />
      <div className="flex -space-x-32">
        {Array.from({ length: 3 }).map((_, idx) => (
          <motion.div 
          key={idx}
          className={`bg-gradient-to-r from-white dark:from-[#2E2A29] to-transparent dark:to-transparent ${finalSwatches[idx]} bg-cover rounded-5xl w-100 h-130 text-black drop-shadow-2xl p-4 `}
          initial={{ y: offsetsY[idx], zIndex: idx+50 }}
          whileInView={{ y: isHoveringFile || isStartingShortcut ? fileOffsetsY[idx] : offsetsY[idx]+(coords.y/(31-(10*idx))), x: isHoveringFile || isStartingShortcut ? fileOffsetsX[idx] : offsetsX[idx]+(coords.x/(31-(10*idx))), zIndex: idx+50}}
          whileHover={{ scale: 1.07 }}
          transition={{ type: "spring", stiffness: isHoveringFile || isStartingShortcut ? 100 : 50, damping: isHoveringFile || isStartingShortcut ? 10 : 20, duration: isHoveringFile || isStartingShortcut ? 0.1 : 1.0}}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4 mt-28 ">

        <motion.div layout className="flex flex-col items-center p-8 -z-10"
        whileInView={{ y: isHoveringFile ? -600 : 0, x: isHoveringFile ? 290 : 0, scale: isHoveringFile ? 2 : 1 , opacity: isStartingShortcut ? 0 : 1}}
        transition={{ type: "spring", stiffness: 100, damping: 30, duration: 0.2}}>
          <ArrowSquareDown size={48} className="mt-1 mb-1.5 text-stone-400 dark:text-stone-500"/>
          <p className="text-lg text-stone-400 dark:text-stone-500">Drop any file</p>

        </motion.div>

        <motion.div layout className="flex flex-col items-center p-8 -z-5" 
        whileInView={{ y: isStartingShortcut ? -600 : 0, x: isStartingShortcut ? -10 : 0, scale: isStartingShortcut ? 2 : 1 , opacity: isHoveringFile ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 30, duration: 0.2}}>
          <div className="flex flex-row items-center">
            <Command className="text-stone-400 dark:text-stone-500" size={48} />
            <h1 className={`text-4xl text-stone-400 dark:text-stone-500 ${isStartingShortcut ? "opacity-40" : "opacity-100"}`}>V</h1>
          </div>
          <p className="text-lg text-stone-500">Paste any text</p>
        </motion.div>
        
        <motion.div layout className="flex flex-col items-center p-8 hover:bg-blue z-5" 
        whileInView={{ opacity: isStartingShortcut || isHoveringFile ? 0 : 1}}
        transition={{ type: "spring", stiffness: 100, damping: 30, duration: 0.2}}>
          <Link href="/live" className="text-4xl text-stone-400 dark:text-stone-500 flex flex-row items-center">
            <Record size={28} className="text-stone-400 dark:text-stone-500" weight="fill" />
            Live
          </Link>
          <p className="text-lg text-stone-400 dark:text-stone-500">Record any lecture</p>
        </motion.div>



      </div>
    </form>
  );
}
