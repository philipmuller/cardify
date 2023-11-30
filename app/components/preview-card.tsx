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
        <div className="h-80 w-80 lg:h-[45vh] lg:w-[45vh] min-h-[18rem] min-w-[18rem] max-h-[27rem] max-w-[27rem] aspect-square flex items-center justify-center">
            <motion.div
                className={`bg-gradient-to-r from-white dark:from-[#2E2A29] to-transparent dark:to-transparent bg-cover rounded-5xl w-3/4 h-full text-black drop-shadow-2xl p-4 `}
                whileHover={{ scale: 1.07 }}
                transition={transition}
            />
        </div>
    );
}

