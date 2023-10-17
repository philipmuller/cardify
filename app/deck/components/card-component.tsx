"use client"

import { motion } from "framer-motion";
import { Card } from "../card-model";

export default function CardComponent({ card }: { card: Card}) {
    return (
        <motion.div
        className={`bg-gradient-to-r from-white to-orange-50 bg-cover rounded-5xl w-100 h-130 text-black drop-shadow-2xl p-4`}
        whileTap={{ scale: 0.9 }} //adjust things here to make it look like a card flip
        transition={{ type: "spring", stiffness: 100, damping: 10, duration: 0.1}}>
            <p>{card.front}</p>
            <p>{card.back}</p>
        </motion.div>
    );

}