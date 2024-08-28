import { useState, DragEvent } from "react";

export function useDropFile(effect: (e: any) => void): [boolean, { enter: (e: DragEvent) => void, exit: (e: DragEvent) => void, over: (e: DragEvent) => void, drop: (e: DragEvent) => void}] {
    const [isHoveringFile, setIsHoveringFile] = useState(false);

    function handleDragEnter(e: DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        setIsHoveringFile(true);
      }
    
      function handleDragExit(e: DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        setIsHoveringFile(false);
      }
    
      function handleDragOver(e: DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        setIsHoveringFile(true);
      }

      function handleDrop(e: DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        setIsHoveringFile(false);
        effect(e);
      }

      return [
        isHoveringFile,
        {
            enter: handleDragEnter,
            exit: handleDragExit,
            over: handleDragOver,
            drop: handleDrop
        }
      ];
}