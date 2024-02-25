"use client";

import { useRef, DragEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useDetectPaste } from "./hooks/use-paste";
import { useDropFile } from "./hooks/use-drop-file";
import { LanternEngine } from "./engine/client-engine";
import { getFileTypeFromString } from "./model/file-type";
import {
  PreviewDisplay,
  PreviewDisplayState,
} from "./components/preview-display";
import OptionsBar from "./components/options-bar";
import { useBreakpoints } from "./hooks/use-breakpoints";
import { useWindowDimensions } from "./hooks/use-window-dimensions";

export default function Home() {
  const [isHoveringFile, { enter, exit, over, drop }] = useDropFile(handleDrop);
  const router = useRouter();
  const [isStartingShortcut] = useDetectPaste(handlePaste);
  const { height } = useWindowDimensions();
  const inputFile = useRef<HTMLInputElement | null>(null);

  const breakpoint = useBreakpoints();

  async function handlePaste() {
    console.log("PASTE DETECTED");
    try {
      const text = await navigator.clipboard.readText();
      router.push(LanternEngine.constructNewDeckUrlFromText(text));
    } catch (err) {
      console.log("Failed to read clipboard data.");
    }
  }

  async function handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    console.log("File has been dropped");
    const file = e.dataTransfer.files.item(0);
    if (!file) return;

    uploadSelectedFile(file);
  }

  async function handleFileSelected(e: ChangeEvent<HTMLInputElement>) {
    console.log("File has been selected");
    const file = e.target.files?.item(0);
    if (!file) return;

    uploadSelectedFile(file);
  }

  async function uploadSelectedFile(file: File) {
    console.log("Attempting to upload file " + file.name);

    const type = getFileTypeFromString(file.type);
    if (type !== undefined) {
      const uploadedFileUrl = await LanternEngine.uploadFile(file, type);
      router.push(
        LanternEngine.constructNewDeckUrlFromFile(uploadedFileUrl, type),
      );
    }
  }

  return (
    <form
      className="flex h-full flex-col overflow-hidden"
      onDragEnter={enter}
      onDragLeave={exit}
      onDrop={drop}
      onDragOver={over}
    >
      <input
        placeholder="fileInput"
        className="hidden"
        type="file"
        ref={inputFile}
        multiple={true}
        accept=".xlsx, .xls, .doc, .docx, .ppt, .pptx, .txt, .pdf"
        onChange={handleFileSelected}
      />
      <PreviewDisplay
        state={
          isHoveringFile || isStartingShortcut
            ? PreviewDisplayState.hint
            : PreviewDisplayState.display
        }
        breakpoint={breakpoint}
        screenHeight={height}
      />
      <OptionsBar
        isHoveringFile={isHoveringFile}
        isStartingShortcut={isStartingShortcut}
        breakpoint={breakpoint}
        screenHeight={height}
        onPressPaste={handlePaste}
        onPressFile={() => inputFile.current?.click()}
      />
    </form>
  );
}
