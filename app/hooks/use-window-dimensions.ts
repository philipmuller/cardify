import { useState, useEffect } from 'react';

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState<{width: undefined | number, height: undefined | number}>({width: undefined, height: undefined});

  useEffect(() => {
    function getWindowDimensions() {
      const { innerWidth: width, innerHeight: height } = window;
      return {
        width,
        height
      };
    }

    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}