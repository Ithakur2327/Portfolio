"use client";
import Script from "next/script";
import { useEffect, useState } from "react";

export default function OnekoCatLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShow(true);
  }, []);

  if (!show) return null;

  return (
    <Script
      id="oneko-script"
      src="/oneko.js"
      strategy="afterInteractive"
    />
  );
}
