"use client";

import Link from "next/link";
import { useState } from "react";
import { Deck } from "../model/card-model";
import DeckPreview from "./deck-preview";
import { PencilSimpleLine, Square, Trash } from "@phosphor-icons/react";

export default function DeckPreviewCell({ deck } : { deck: Deck }) {
    const [isHovering, setIsHovering] = useState(false);
    return (
        <div key={deck.id} className="flex flex-col items-center p-8 pb-14 gap-2" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
            <DeckPreview deck={deck} />
            <Link href={`/deck/${deck.id}`} className="text-stone-600 dark:text-stone-300 text-2xl mt-10 text-center font-semibold lg:text-3xl">{deck.title}</Link>
            <div className={`flex flex-row gap-5 ${isHovering ? "opacity-100" : "opacity-0"}`}>
              <PencilSimpleLine size={28} color="#7a7a7a" weight="bold"/>
              <Trash size={28} color="#ff8585" weight="bold"/>
            </div>
        </div>
    );
}