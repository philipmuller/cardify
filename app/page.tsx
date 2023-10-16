"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, motionValue } from "framer-motion";
import useWindowDimensions from "./hooks/useViewDimensions";

export default function Home() {
  const [cardNr, setCardNr] = useState(3);
  const [coords, setCoords] = useState({x: 0, y: 0});

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

  const offsets = [90, -140, 0];
  const finalSwatches = ["to-amber-50", "to-orange-50", "to-red-50"];

  const variants = {
    initial: { opacity: 0 },
    hover: { opacity: 1 }
  };

  return (
    <section className="flex-grow flex flex-col items-center justify-center">
      <div className="flex -space-x-32">
        {Array.from({ length: cardNr }).map((_, idx) => (
          <motion.div 
          key={idx}
          className={`bg-gradient-to-r from-white ${finalSwatches[idx]} bg-cover rounded-5xl w-100 h-130 text-black drop-shadow-2xl p-4`}
          initial={{ y: offsets[idx], z: idx }}
          whileInView={{ y: offsets[idx]+(coords.y/(10+(20*idx))), x: coords.x/(10+(20*idx)), z: idx }}
          whileHover={{ scale: 1.07}}
          />
        ))}
      </div>
      <p className="mt-8 text-lg text-gray-700">Coords {coords.x} {coords.y}</p>
      <button onClick={() => setCardNr(cardNr+1)}>Click me</button>
    </section>
  );
}
