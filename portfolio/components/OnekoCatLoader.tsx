"use client";
import { useEffect } from "react";

export default function OnekoCatLoader() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.getElementById("oneko-script")) return;

    // Set gif path via global before script loads (async scripts lose currentScript)
    (window as any).__nekoCat = "/batman.gif";

    const script = document.createElement("script");
    script.id = "oneko-script";
    script.src = "/oneko.js";
    // NOT async — keeps document.currentScript alive as backup
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.getElementById("oneko-script")?.remove();
      document.getElementById("oneko")?.remove();
    };
  }, []);

  return null;
}