"use client";
import { motion } from "motion/react";


export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.6 }}
    >
      {children}
    </motion.div>
  );
}