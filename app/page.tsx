"use client";

import { useEffect, useCallback, DragEvent } from "react";
import { useRouter, useSearchParams} from 'next/navigation';
import { useDetectPaste } from "./hooks/use-paste";
import { usePointerCoords } from "./hooks/use-pointer-coords";
import { useDropFile } from "./hooks/use-drop-file";
import { LanternEngine } from "./engine/client-engine";
import { FileType } from "./model/file-type";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./engine/firebase";
import { PreviewDisplay, PreviewDisplayState } from "./components/preview-display";
import OptionsBar from "./components/options-bar";


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

  async function handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    console.log("File has been dropped");
    if (e.dataTransfer?.files[0]) {
      //const convertApi = ConvertApi.auth({ apiKey: "111029228", token: "r2mjY2uK"});
      //let params = convertApi.createParams();
      //const convertapi = require('convertapi')(convertAPISecret);
      const file = e.dataTransfer.files[0];
      console.log("Dropped file type:"+JSON.stringify(file.type));
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
      <PreviewDisplay state={ isHoveringFile || isStartingShortcut ? PreviewDisplayState.hint : PreviewDisplayState.display} />
      <OptionsBar isHoveringFile={isHoveringFile} isStartingShortcut={isStartingShortcut}/>
    </form>
  );
}
