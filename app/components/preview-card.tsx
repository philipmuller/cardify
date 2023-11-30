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
        <motion.div
            className={`bg-gradient-to-r shrink from-white dark:from-[#2E2A29] to-transparent dark:to-transparent bg-cover rounded-5xl  w-100 h-130 text-black drop-shadow-2xl p-4 `}
            whileHover={{ scale: 1.07 }}
            transition={transition}
        />
    );
}

