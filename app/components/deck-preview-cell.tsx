"use client";

import Link from "next/link";
import { useState } from "react";
import { Deck } from "../model/card-model";
import DeckPreview from "./deck-preview";
import { useRouter } from "next/navigation";
import {
  DotsThree,
  PencilSimpleLine,
  Square,
  Trash,
} from "@phosphor-icons/react";
import { LanternEngine } from "../engine/client-engine";

export default function DeckPreviewCell({
  deck,
  onDelete,
}: {
  deck: Deck;
  onDelete?: () => void;
}) {
  const [isHovering, setIsHovering] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const handleDelete = () => {
    console.log("delete");
    LanternEngine.deleteDeck(deck.id);
    router.refresh();
  };

  return (
    <div
      key={deck.id}
      className="flex flex-col items-center gap-2 p-8 pb-14"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <DeckPreview deck={deck} />
      <div
        className={`relative mt-10 flex flex-row items-center justify-center justify-items-center gap-5`}
      >
        <Link
          href={`/deck/${deck.id}`}
          className="pl-5 text-center text-2xl font-semibold text-stone-600 lg:text-3xl dark:text-stone-300"
        >
          {deck.title}
        </Link>

        <button className="relative" onClick={() => setShowMenu(!showMenu)}>
          <DotsThree
            size={32}
            color="#7a7a7a"
            weight="bold"
            className={`${isHovering ? "opacity-100" : "opacity-0"}`}
          />
          {showMenu && (
            <ul
              className="absolute left-4 rounded bg-stone-50"
              onMouseLeave={() => setShowMenu(false)}
            >
              <li className="flex flex-row items-center justify-start gap-3 hover:bg-gray-100">
                <div className="h-10 w-0.5 rounded-full bg-[#7a7a7a]" />
                <div className="flex flex-row items-center justify-start gap-3 p-2 px-1 pr-8">
                  <PencilSimpleLine size={20} color="#7a7a7a" weight="bold" />
                  <p className="whitespace-nowrap text-lg font-medium text-stone-600 dark:text-stone-300">
                    Edit title
                  </p>
                </div>
              </li>
              <li className="flex flex-row items-center justify-start gap-3 hover:bg-red-100">
                <div className="h-10 w-0.5 rounded-full bg-[#7a7a7a]" />
                <div
                  className="flex flex-row items-center justify-start gap-3 p-2 px-1 pr-8"
                  onClick={handleDelete}
                >
                  <Trash size={20} color="#ff8585" weight="bold" />
                  <p className="text-center text-lg font-medium text-[#ff8585]">
                    Delete
                  </p>
                </div>
              </li>
            </ul>
          )}
        </button>

        {/* <PencilSimpleLine size={28} color="#7a7a7a" weight="bold"/>
              <Trash size={28} color="#ff8585" weight="bold"/> */}
      </div>
    </div>
  );
}
