"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const LampContainer = ({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden w-full z-0",
        className
      )}
      style={{ background: "var(--bg-card)", ...style }}
    >
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0">
        <motion.div
          initial={{ opacity: 0.5, width: "8rem" }}
          whileInView={{ opacity: 1, width: "20rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{ backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))` }}
          className="absolute inset-auto right-1/2 h-40 overflow-visible w-[20rem] bg-gradient-conic from-cyan-500 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute w-[100%] left-0 h-32 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" style={{ background: "var(--bg-card)" }} />
          <div className="absolute w-28 h-[100%] left-0 bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" style={{ background: "var(--bg-card)" }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0.5, width: "8rem" }}
          whileInView={{ opacity: 1, width: "20rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{ backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))` }}
          className="absolute inset-auto left-1/2 h-40 w-[20rem] bg-gradient-conic from-transparent via-transparent to-cyan-500 text-white [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute w-28 h-[100%] right-0 bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" style={{ background: "var(--bg-card)" }} />
          <div className="absolute w-[100%] right-0 h-32 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" style={{ background: "var(--bg-card)" }} />
        </motion.div>

        <div className="absolute top-1/2 h-40 w-full translate-y-8 scale-x-150 blur-2xl" style={{ background: "var(--bg-card)" }} />
        <div className="absolute top-1/2 z-50 h-40 w-full bg-transparent opacity-10 backdrop-blur-md" />
        <div className="absolute inset-auto z-50 h-28 w-[18rem] -translate-y-1/2 rounded-full bg-cyan-500 opacity-50 blur-3xl" />

        <motion.div
          initial={{ width: "4rem" }}
          whileInView={{ width: "10rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-30 h-28 -translate-y-16 rounded-full bg-cyan-400 blur-2xl"
        />
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "20rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-50 h-0.5 -translate-y-24 bg-cyan-400"
        />
        <div className="absolute inset-auto z-40 h-36 w-full -translate-y-32" style={{ background: "var(--bg-card)" }} />
      </div>

      <div className="relative z-50 flex -translate-y-44 flex-col items-center px-5 w-full">
        {children}
      </div>
    </div>
  );
};