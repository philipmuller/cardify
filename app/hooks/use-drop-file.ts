import { useState } from "react";

export function useDropFile(effect: (e: any) => void): [boolean, { enter: (e: any) => void, exit: (e: any) => void, over: (e: any) => void, drop: (e: any) => void}] {
    const [isHoveringFile, setIsHoveringFile] = useState(false);

    function handleDragEnter(e: any) {
        e.preventDefault();
        e.stopPropagation();
        setIsHoveringFile(true);
      }
    
      function handleDragExit(e: any) {
        e.preventDefault();
        e.stopPropagation();
        setIsHoveringFile(false);
      }
    
      function handleDragOver(e: any) {
        e.preventDefault();
        e.stopPropagation();
        setIsHoveringFile(true);
      }

      return [
        isHoveringFile,
        {
            enter: handleDragEnter,
            exit: handleDragExit,
            over: handleDragOver,
            drop: effect
        }
      ];
}