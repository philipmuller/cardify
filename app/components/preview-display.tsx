"use client";

import { motion } from "framer-motion";
import { useCallback } from "react";
import PreviewCard from "./preview-card";
import { usePointerCoords } from "../hooks/use-pointer-coords";
import { useBreakpoints, Breakpoint } from "../hooks/use-breakpoints";

export enum PreviewDisplayState {
    display,
    hint,
    loading
}

export function PreviewDisplay({ state }: { state: PreviewDisplayState}) {
    //mouse pointer coordinates
    const coords = usePointerCoords();

    //breakpoints
    const breakpoint = useBreakpoints();

    const isHinting = () => { return (state == PreviewDisplayState.hint) };
    const isMobile = () => { return (breakpoint == Breakpoint.sm) };

    //number of cards to display
    const numCards = isMobile() ? 4 : 3;

    //Desktop Card spacing
    const cardSpacingDesktop = 120; //spacing when displaying (desktop only)
    const hintCardSpacingDesktop = 240; //spacing when hinting (desktop only)

    const xOffsetsDesktop = [cardSpacingDesktop, 0, -cardSpacingDesktop];
    const hintXOffsetsDesktop = [hintCardSpacingDesktop, 0, -hintCardSpacingDesktop];

    //Mobile Card spacing
    const xOffsetsMobile = [180, -50, 60, -100];
    const yOffsetsMobile = [0, -40, 30];

    //Desktop Vertical positioning
    const topPadding = [100, 0, 0];
    const topPaddingHint = [350, 400, 450];

    const bottomPadding = [0, 160, 0];
    const bottomPaddingHint = [0, 0, 0];

    const xOffset = (idx: number) => {
        if (isMobile()) return xOffsetsMobile[idx];

        const damping = (idx+1)*2;
        const regularOffset = xOffsetsDesktop[idx] + (coords.x/10)/damping;
        return isHinting() ? hintXOffsetsDesktop[idx] : regularOffset;
    }

    const yOffset = (idx: number) => {
        if (isMobile()) return yOffsetsMobile[idx];

        const damping = (idx+1)*2;
        const regularOffset = (coords.y/10)/damping;
        return isHinting() ? 0 : regularOffset};

    const tPadding = (idx: number) => {
        if (isMobile()) return 0;
        return (isHinting() ? topPaddingHint[idx] : topPadding[idx]) 
    };

    const bPadding = (idx: number) => {
        if (isMobile()) return 0;
        return (isHinting() ? bottomPaddingHint[idx] : bottomPadding[idx]) 
    };

    const transition = {
        type: "spring", 
        stiffness: isHinting() ? 100 : 50, 
        damping: isHinting() ? 10 : 20, 
        duration: isHinting() ? 0.1 : 1.0
    };

    const displayCards = () => {
        return (
            <> 
            {
                Array.from({ length: numCards }).map((_, idx) => {
                    console.log(idx);
                    console.log(xOffset(idx));
                    return (
                        <motion.div
                        className="flex items-center"// bg-red-500"
                        key={idx}
                        whileInView={{ 
                            x: xOffset(idx),
                            y: yOffset(idx),
                            paddingTop: tPadding(idx),
                            paddingBottom: bPadding(idx),
                            height: isMobile() ? 200 : undefined,
                        }}
                        transition={transition}>
                            <PreviewCard/>
                        </motion.div>
                    )
                })
            }
            </>
        );
    };
    
    return (
        <div className="flex flex-col gap-10 md:gap-0 md:flex-row justify-center items-center basis-3/4 pt-20 pb-10">
            {displayCards()}
        </div>
    );
}