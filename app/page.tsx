"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, motionValue } from "framer-motion";
import ConvertApi from "convertapi-js";
import { convertAPISecret } from "@/keychain";
import { useRouter, useSearchParams} from 'next/navigation'


export default function Home() {
  const [cardNr, setCardNr] = useState(3);
  const [coords, setCoords] = useState({x: 0, y: 0});
  const [isHoveringFile, setIsHoveringFile] = useState(false);

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
    window.addEventListener('mousemove', handleWindowMouseMove);

    return () => {
      window.removeEventListener(
        'mousemove',
        handleWindowMouseMove,
      );
    };
  }, []);

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
      <motion.div initial={{ visibility: "hidden" }} whileInView={{ visibility: isHoveringFile ? "visible" : "hidden" }}><h1 className="text-3xl text-slate-600">Drop file to create cards</h1></motion.div>
      <div className="flex -space-x-32">
        {Array.from({ length: cardNr }).map((_, idx) => (
          <motion.div 
          key={idx}
          className={`bg-gradient-to-r from-white ${finalSwatches[idx]} bg-cover rounded-5xl w-100 h-130 text-black drop-shadow-2xl p-4`}
          initial={{ y: offsetsY[idx], z: idx }}
          whileInView={{ y: isHoveringFile ? fileOffsetsY[idx] : offsetsY[idx]+(coords.y/(10+(20*idx))), x: isHoveringFile ? fileOffsetsX[idx] : offsetsX[idx]+(coords.x/(10+(20*idx))), z: idx}}
          whileHover={{ scale: 1.07}}
          transition={{ type: "spring", stiffness: isHoveringFile ? 100 : 50, damping: isHoveringFile ? 10 : 20, duration: isHoveringFile ? 0.1 : 1.0}}
          />
        ))}
      </div>
      <div className="flex flex-row">
        <p className="mt-60 text-lg text-gray-700">Coords {coords.x} {coords.y}</p>
        <button onClick={() => setCardNr(cardNr+1)}>Click me</button>
      </div>
    </form>
  );
}
