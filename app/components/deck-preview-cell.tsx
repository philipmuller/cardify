"use client";

import Link from "next/link";
import { useState } from "react";
import { Deck } from "../model/card-model";
import DeckPreview from "./deck-preview";
import { DotsThree, PencilSimpleLine, Square, Trash } from "@phosphor-icons/react";

export default function DeckPreviewCell({ deck } : { deck: Deck }) {
    const [isHovering, setIsHovering] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    return (
        <div key={deck.id} className="flex flex-col items-center p-8 pb-14 gap-2" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
            <DeckPreview deck={deck} />
            <div className={`flex flex-row gap-5 items-center justify-center justify-items-center mt-10 relative`}>
                <Link href={`/deck/${deck.id}`} className="text-stone-600 dark:text-stone-300 text-2xl text-center font-semibold lg:text-3xl pl-5">{deck.title}</Link>

                <button className="relative" onClick={() => setShowMenu(!showMenu)}>
                <DotsThree size={32} color="#7a7a7a" weight="bold" className={`${isHovering ? "opacity-100" : "opacity-0"}`}/>
                {showMenu && 
                <ul className="bg-stone-50 absolute rounded left-4" onMouseLeave={() => setShowMenu(false)}>
                    <li className="flex flex-row items-center justify-start gap-3 hover:bg-gray-100">
                        <div className="w-0.5 h-10 rounded-full bg-[#7a7a7a]"/>
                        <div className="px-1 pr-8 p-2 flex flex-row items-center justify-start gap-3">
                            <PencilSimpleLine size={20} color="#7a7a7a" weight="bold" />
                            <p className="text-stone-600 dark:text-stone-300 text-lg font-medium whitespace-nowrap">Edit title</p>
                        </div>
                        
                    </li>
                    <li className="flex flex-row items-center justify-start gap-3 hover:bg-red-100">
                        <div className="w-0.5 h-10 rounded-full bg-[#7a7a7a]"/>
                        <div className="px-1 pr-8 p-2 flex flex-row items-center justify-start gap-3">
                            <Trash size={20} color="#ff8585" weight="bold"/>
                            <p className="text-[#ff8585] text-lg font-medium text-center">Delete</p>
                        </div>
                        
                    </li>
                </ul>}
                </button>


              {/* <PencilSimpleLine size={28} color="#7a7a7a" weight="bold"/>
              <Trash size={28} color="#ff8585" weight="bold"/> */}
            </div>
        </div>
    );
}