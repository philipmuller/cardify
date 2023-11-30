"use client";

import { motion } from "framer-motion";

export default function PreviewCard() {
    const transition = {
        type: "spring", 
        stiffness: 50, 
        damping: 20, 
        duration: 1.0
    }

    return (
        <div className="h-96 md:h-130 aspect-square flex items-center justify-center">
            <motion.div
                className={`bg-gradient-to-r from-white dark:from-[#2E2A29] to-transparent dark:to-transparent bg-cover rounded-5xl w-3/4 h-full text-black drop-shadow-2xl p-4 `}
                whileHover={{ scale: 1.07 }}
                transition={transition}
            />
        </div>
    );
}

