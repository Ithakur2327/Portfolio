"use client";

/**
 * PERMANENT HYDRATION FIX — MotionProvider
 *
 * Framer Motion v11 injects a <style> tag for its animation engine during SSR.
 * This <style> tag is NOT present in the SSR HTML but IS added on the client,
 * causing React to log a hydration mismatch for any parent element containing
 * Framer Motion components.
 *
 * Fix: LazyMotion + domAnimation defers the Framer animation engine entirely to
 * the client side. The <style> tag is never injected during SSR, so SSR HTML
 * and client HTML match exactly.
 *
 * All components that use `motion.*` continue to work — LazyMotion is fully
 * compatible with the standard `motion` import from "framer-motion".
 */
import { LazyMotion, domAnimation } from "framer-motion";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict={false}>
      {children}
    </LazyMotion>
  );
}