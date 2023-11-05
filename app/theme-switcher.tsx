"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "@phosphor-icons/react";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);


  if (!mounted) {
    return null;
  }

  const switchToLightIcon = () => {
    return <Sun size={28} color="#e7e5e4" weight="bold" />;
  }

  const switchToDarkIcon = () => {
    return <Moon size={28} color="#1c1917" weight="bold" />;
  }

  return (
    <button
    className={`right-5 rounded-md hover:scale-110 active:scale-100 duration-200`}
    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>

      {theme === "light" ? switchToDarkIcon() : switchToLightIcon()}

    </button>
  );
};