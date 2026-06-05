"use client";
import { useEffect } from "react";

export default function OnekoCatLoader() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.getElementById("oneko-script")) return;

    const script = document.createElement("script");
    script.id = "oneko-script";
    script.src = "/oneko.js";
    script.dataset.cat = "/oneko.gif";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.getElementById("oneko-script")?.remove();
      document.getElementById("oneko")?.remove();
    };
  }, []);

  return null;
}