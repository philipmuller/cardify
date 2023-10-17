"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, motionValue } from "framer-motion";
import ConvertApi from "convertapi-js";
import { convertAPISecret } from "@/keychain";
import { useRouter, useSearchParams} from 'next/navigation';
import { ArrowSquareDown, Command } from "@phosphor-icons/react";


export default function Home() {
  const [cardNr, setCardNr] = useState(3);
  const [coords, setCoords] = useState({x: 0, y: 0});
  const [isHoveringFile, setIsHoveringFile] = useState(false);
  const [isPressingCommand, setIsPressingCommand] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams()!;

  useEffect(() => {
    const handleWindowMouseMove = (event: { clientX: any; clientY: any; }) => {
      const { innerWidth: width, innerHeight: height } = window;

      const centerX = width / 2;
      const centerY = height / 2;
      
      //absolute distance from center
      const distX = centerX - event.clientX;
      const distY = centerY - event.clientY;

      setCoords({
        x: -distX,
        y: -distY,
      });
    };

    const handleKeyDown = async (event: { key: string; }) => {

      if (event.key == "Meta" || event.key == "Control") {
        setIsPressingCommand(true);
      }

      if (event.key == "v" && isPressingCommand == true) {

        try {
          const text = await navigator.clipboard.readText();
          console.log('Clipboard data read successfully.');
          router.push("/deck" + '?' + createQueryString("fileText", text));
        } catch (err) {
          console.log('Failed to read clipboard data.');
        }
      }

    }

    const handleKeyUp = (event: { key: string; }) => {
      console.log(event.key);
      if (event.key == "Meta" || event.key == "Control") {
        setIsPressingCommand(false);
      }

    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleWindowMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPressingCommand]);

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
    },
    [searchParams]
  )

  const offsetsY = [90, -140, 0];
  const fileOffsetsY = [250, 300, 350];

  const offsetsX = [0, 0, 0];
  const fileOffsetsX = [190, 0, -190];

  const finalSwatches = ["to-amber-50", "to-orange-50", "to-red-50"];

  const variants = {
    initial: { opacity: 0 },
    hover: { opacity: 1 }
  };

  function handleDragEnter(e: any) {
    e.preventDefault();
    e.stopPropagation();
    console.log("drag enter");
    setIsHoveringFile(true);
  }

  function handleDragExit(e: any) {
    e.preventDefault();
    e.stopPropagation();
    console.log("drag exit");
    setIsHoveringFile(false);
  }

  function handleDragOver(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setIsHoveringFile(true);
  }

  async function handleDrop(e: any) {
    e.preventDefault();
    e.stopPropagation();
    console.log("File has been dropped");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const convertApi = ConvertApi.auth({ apiKey: "111029228", token: "r2mjY2uK"});
      let params = convertApi.createParams();
      //const convertapi = require('convertapi')(convertAPISecret);
      const file = e.dataTransfer.files[0];
      console.log(file);

      params.add('file', file);
      let result = await convertApi.convert("pdf", "txt", params);

      let url = result.files[0].Url;
      console.log(url);

      fetch(url).then(function(response) {
        response.text().then(function(text) {
          router.push("/deck" + '?' + createQueryString("fileText", text));
        });
  });
    }
  }

  function handleChange(e: any) {
    e.preventDefault();
    console.log("File has been added");
    if (e.target.files && e.target.files[0]) {
      for (let i = 0; i < e.target.files["length"]; i++) {
        console.log(e.dataTransfer.files[i]);
        //setFiles((prevState: any) => [...prevState, e.target.files[i]]);
      }
    }
  }

  return (
    <form className="flex-grow flex flex-col items-center justify-center" onDragEnter={handleDragEnter} onDragLeave={handleDragExit} onDrop={handleDrop} onDragOver={handleDragOver}>
      <input
        placeholder="fileInput"
        className="hidden"
        //ref={inputRef}
        type="file"
        multiple={true}
        //onChange={handleChange}
        accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf"
      />
      <div className="flex -space-x-32">
        {Array.from({ length: cardNr }).map((_, idx) => (
          <motion.div 
          key={idx}
          className={`bg-gradient-to-r from-white ${finalSwatches[idx]} bg-cover rounded-5xl w-100 h-130 text-black drop-shadow-2xl p-4`}
          initial={{ y: offsetsY[idx], z: idx }}
          whileInView={{ y: isHoveringFile || isPressingCommand ? fileOffsetsY[idx] : offsetsY[idx]+(coords.y/(31-(10*idx))), x: isHoveringFile || isPressingCommand ? fileOffsetsX[idx] : offsetsX[idx]+(coords.x/(31-(10*idx))), z: idx}}
          whileHover={{ scale: 1.07 }}
          transition={{ type: "spring", stiffness: isHoveringFile || isPressingCommand ? 100 : 50, damping: isHoveringFile || isPressingCommand ? 10 : 20, duration: isHoveringFile || isPressingCommand ? 0.1 : 1.0}}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 mt-28 -z-30">

        <motion.div layout className="flex flex-col items-center p-8"
        whileInView={{ y: isHoveringFile ? -600 : 0, x: isHoveringFile ? 90 : 0, scale: isHoveringFile ? 2 : 1 , opacity: isPressingCommand ? 0 : 1}}
        transition={{ type: "spring", stiffness: 100, damping: 30, duration: 0.2}}>

          <ArrowSquareDown color="#a8a29e" size={48}/>
          <p className="text-lg text-stone-500">Drop any file</p>

        </motion.div>

        <motion.div layout className="flex flex-col items-center p-8" 
        whileInView={{ y: isPressingCommand ? -600 : 0, x: isPressingCommand ? -90 : 0, scale: isPressingCommand ? 2 : 1 , opacity: isHoveringFile ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 30, duration: 0.2}}>
          <div className="flex flex-row items-center ">
            <Command color="#a8a29e" size={48} />
            <h1 className={`text-4xl text-stone-400 ${isPressingCommand ? "opacity-40" : "opacity-100"}`}>V</h1>
          </div>
          <p className="text-lg text-stone-500">Paste any text</p>
        </motion.div>

      </div>
    </form>
  );
}
