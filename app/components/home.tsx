"use client";

import { useRef, DragEvent, ChangeEvent, useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDetectPaste } from "../hooks/use-paste";
import { useDropFile } from "../hooks/use-drop-file";
import { LanternEngine } from "../engine/client-engine";
import { getFileTypeFromString } from "../model/file-type";
import { PreviewDisplay, PreviewDisplayState } from "../components/preview-display";
import OptionsBar from "../components/options-bar";
import { useBreakpoints } from "../hooks/use-breakpoints";
import { useWindowDimensions } from "../hooks/use-window-dimensions";
import CardBrowser from "../components/card-browser";
import { Deck } from "../model/card-model";
import GridLoader from "react-spinners/GridLoader";
import LiveView from "./live-view";

export default function Home() {
  console.log("!!! RENDERING HOME");
  
  const [isHoveringFile, { enter, exit, over, drop }] = useDropFile(handleDrop);
  const [isStartingShortcut, isPressingV] = useDetectPaste();
  const { height } = useWindowDimensions();
  const inputFile = useRef<HTMLInputElement | null>(null);
  const breakpoint = useBreakpoints();
  const [isLoading, setIsLoading] = useState(false);
  const [deck, setDeck] = useState<Deck | null>(null);
  const [liveView, setLiveView] = useState<boolean>(false);

  const handlePaste = useCallback(async (event: ClipboardEvent) => {
    event.preventDefault();
    const text = event.clipboardData?.getData('Text');
    console.log("PASTE DETECTED", text);
    if (text) {
      setIsLoading(true);
      try {
        const response = await LanternEngine.getDeckFromText(text);
        const json = await response.json();
        const newDeck = json.deck as Deck;
        setDeck(newDeck);
      } catch (err) {
        console.error("Failed to process pasted content:", err);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  async function handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    console.log("File has been dropped");
    const file = e.dataTransfer.files.item(0);
    if (!file) return;

    setIsLoading(true);
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
      const response = await LanternEngine.getDeckFromFile(uploadedFileUrl, type);
      const json = await response.json();
      const newDeck = json.deck as Deck;
      setDeck(newDeck);
      setIsLoading(false);
    }
  }

  return (
    <form
      className="flex h-full flex-col overflow-x-hidden overflow-y-auto"
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
      {!deck && !isLoading && !liveView && (
        <>
          <PreviewDisplay
            state={
              isHoveringFile || isStartingShortcut
                ? PreviewDisplayState.hint
                : PreviewDisplayState.display
            }
            breakpoint={breakpoint}
            screenHeight={height ?? 100}
          />
          <OptionsBar
            isHoveringFile={isHoveringFile}
            isStartingShortcut={isStartingShortcut}
            breakpoint={breakpoint}
            screenHeight={height ?? 100}
            onPressPaste={async () => {
                const text = await navigator.clipboard.readText();
                //on phones, this should make a paste icon appear, which then triggers the regular paste detection
            }}
            onPressFile={() => inputFile.current?.click()}
            onPressLive={() => setLiveView(true)}
          />
        </>
      )}
      {isLoading && (
        <div className="flex justify-center items-center h-full">
          <GridLoader size={60} margin={0} color="#a8a29e" loading={true} />
        </div>
      )}
      {deck && !liveView && (
        <div className="flex justify-center items-center mt-36 mb-20">
          <CardBrowser cards={deck.cards} title={deck.title} key={"stableBrowser"} onClose={() => setDeck(null)}/>
        </div>
      )}
      {liveView && (
        <div className="flex justify-center items-center mt-36 mb-20">
          <LiveView onClose={() => setLiveView(false)} />
        </div>
      )}
    </form>
  );
}
