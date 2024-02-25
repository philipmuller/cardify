import { useState, useEffect } from "react";

type Coords = {
  x: number;
  y: number;
};

export function usePointerCoords(): Coords {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: { clientX: any; clientY: any }) => {
      const { innerWidth: width, innerHeight: height } = window;

      const centerX = width / 2;
      const centerY = height / 2;

      const distX = centerX - event.clientX;
      const distY = centerY - event.clientY;

      setCoords((prevCoords) => ({ x: -distX, y: -distY }));
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return coords;
}
