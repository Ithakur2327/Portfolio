"use client";
import { motion } from "motion/react";

// Next re-mounts `template.tsx` on every navigation (even between routes
// that render the same page.tsx), so this wrapper's `initial -> animate`
// plays fresh each time the user moves between "/" and "/projects" — that's
// what smooths out both the "Back to home" link and the "View More" link,
// without needing to touch every page individually.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}