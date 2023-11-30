"use client";
import { useState, useEffect, MouseEvent } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "@phosphor-icons/react";
import { Cards } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

interface SwitcherProps {
  user: string;
}

export const ThemeSwitcher: React.FC<SwitcherProps> = ({ user }) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

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

  const switchToLightCardsIcon = () => {
    return <Cards size={28} color="#e7e5e4" weight="bold" />;
  }

  const switchToDarkCardsIcon = () => {
    return <Cards size={28} color="#1c1917" weight="bold" />;
  }

  const goToDecksPage = (e: MouseEvent<HTMLButtonElement>) => {
    router.push('/decks');
  }

  return (
    <div className="flex flex-row gap-10">
      <button
        className={`right-5 rounded-md hover:scale-110 active:scale-100 duration-200`}
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>

        {theme === "light" ? switchToDarkIcon() : switchToLightIcon()}

      </button>
      {user === "Log out" && (<button
        className={`right-5 rounded-md hover:scale-110 active:scale-100 duration-200`}
        onClick={goToDecksPage}>

        {theme === "light" ? switchToDarkCardsIcon() : switchToLightCardsIcon()}

      </button>
      )}
    </div>
  );
};