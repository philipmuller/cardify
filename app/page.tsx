"use client";

import { useEffect, useCallback, DragEvent } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useDetectPaste } from "./hooks/use-paste";
import { usePointerCoords } from "./hooks/use-pointer-coords";
import { useDropFile } from "./hooks/use-drop-file";
import { LanternEngine } from "./engine/client-engine";
import { FileType, getFileTypeFromString } from "./model/file-type";
import { onAuthStateChanged } from "firebase/auth";
//import { auth } from "./engine/firebase";
import { PreviewDisplay, PreviewDisplayState } from "./components/preview-display";
import OptionsBar from "./components/options-bar";
import { useBreakpoints, Breakpoint } from "./hooks/use-breakpoints";
import { useWindowDimensions } from "./hooks/use-window-dimensions";


export default function Home() {
  const coords = usePointerCoords();
  const [isHoveringFile, { enter, exit, over, drop }] = useDropFile(handleDrop);
  const router = useRouter();
  const searchParams = useSearchParams()!;
  const [isStartingShortcut] = useDetectPaste(handlePaste);
  const { width, height } = useWindowDimensions();


  //breakpoints
  const breakpoint = useBreakpoints();

  const offsetsY = [90, -140, 0];
  const fileOffsetsY = [250, 300, 350];

  const offsetsX = [0, 0, 0];
  const fileOffsetsX = [190, 0, -190];

  const finalSwatches: [string] = [""];//"to-amber-50 dark:to-amber-950", "to-orange-50 dark:to-orange-950", "to-red-50 dark:to-red-950"];

  async function handlePaste() {
    console.log("PASTE DETECTED");
    try {
      const text = await navigator.clipboard.readText();
      router.push(LanternEngine.constructNewDeckUrlFromText(text));
    } catch (err) {
      console.log('Failed to read clipboard data.');
    }
  }

  async function handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    console.log("File has been dropped");
    if (e.dataTransfer?.files[0]) {
      const file = e.dataTransfer.files[0];
      console.log("Dropped file type:" + JSON.stringify(file.type));
      console.log(file);

      const type = getFileTypeFromString(file.type)
      if (type !== undefined) {
        const uploadedFileUrl = await LanternEngine.uploadFile(file, type);
        router.push(LanternEngine.constructNewDeckUrlFromFile(uploadedFileUrl, type));
      }

    }
  }

  return (
    <form className="flex flex-col h-full overflow-hidden"
      onDragEnter={enter}
      onDragLeave={exit}
      onDrop={drop}
      onDragOver={over}>
      <input
        placeholder="fileInput"
        className="hidden"
        type="file"
        multiple={true}
        accept=".xlsx, .xls, image/*, .doc, .docx, .ppt, .pptx, .txt, .pdf"
      />
      <PreviewDisplay state={isHoveringFile || isStartingShortcut ? PreviewDisplayState.hint : PreviewDisplayState.display} breakpoint={breakpoint} screenHeight={height} />
      <OptionsBar
        isHoveringFile={isHoveringFile}
        isStartingShortcut={isStartingShortcut}
        breakpoint={breakpoint}
        screenHeight={height}
        onPressPaste={handlePaste} />
    </form>
  );
}
