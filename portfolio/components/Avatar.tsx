"use client";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

export function Avatar() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const src = theme === "dark" ? "/avatar-dark.jpg" : "/avatar-light.jpg";

  useEffect(() => {
    setMounted(true);
  }, []);

  const outerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg-card)",
  };

  if (!mounted) {
    return <div style={outerStyle} />;
  }

  return (
    <div style={outerStyle}>
      <img
        src={src}
        alt="Indresh Thakur"
        loading="eager"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
}
