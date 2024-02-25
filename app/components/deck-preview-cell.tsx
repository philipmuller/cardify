"use client";

import Link from "next/link";
import { useState } from "react";
import { Deck } from "../model/card-model";
import DeckPreview from "./deck-preview";
import { useRouter } from "next/navigation";
import { Trash } from "@phosphor-icons/react";
import { LanternEngine } from "../engine/client-engine";

export default function DeckPreviewCell({
  deck,
  onDelete,
}: {
  deck: Deck;
  onDelete?: () => void;
}) {
  const [isHovering, setIsHovering] = useState(false);
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

        <button className="relative" onClick={handleDelete}>
          <Trash
            size={25}
            color="#ff8585"
            weight="bold"
            className={`${isHovering ? "opacity-100" : "opacity-0"}`}
          />
        </button>
      </div>
    </div>
  );
}
