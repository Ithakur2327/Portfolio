"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

type PdfModalState = { src: string; title: string; downloadSrc: string } | null;
type PdfModalContextValue = {
  openPdf: (src: string, title: string, downloadSrc?: string) => void;
};

const PdfModalContext = createContext<PdfModalContextValue | null>(null);

export function usePdfModal() {
  const ctx = useContext(PdfModalContext);
  if (!ctx) throw new Error("usePdfModal must be used within a PdfModalProvider");
  return ctx;
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function PdfModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<PdfModalState>(null);

  const openPdf = useCallback((src: string, title: string, downloadSrc?: string) => {
    setModal({ src, title, downloadSrc: downloadSrc ?? src });
  }, []);

  const close = useCallback(() => setModal(null), []);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const cat = document.getElementById("oneko");
    if (cat) cat.style.display = "none";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      const cat = document.getElementById("oneko");
      if (cat) cat.style.display = "";
    };
  }, [modal, close]);

  return (
    <PdfModalContext.Provider value={{ openPdf }}>
      {children}

      {modal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={modal.title}
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0,0,0,0.80)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "48px 12px 12px",
            overflowY: "auto",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 780,
              background: "var(--bg-base)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 24px 70px rgba(0,0,0,0.6)",
              marginBottom: 12,
            }}
          >
            {/* Header — fixed at top */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "10px 12px",
                borderBottom: "1px solid var(--border)",
                background: "var(--bg-secondary)",
              }}
            >
              <span style={{
                fontFamily: "'Geist',sans-serif",
                fontWeight: 600,
                fontSize: 13,
                color: "var(--text-primary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {modal.title}
              </span>

              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <a
                  href={modal.downloadSrc}
                  download={modal.title.replace(/\s+/g, "_") + (modal.downloadSrc.match(/\.[a-z]+$/i)?.[0] ?? "")}
                  style={{
                    fontFamily: "'Geist Mono',monospace",
                    fontSize: 11,
                    color: "var(--text-muted)",
                    textDecoration: "none",
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    padding: "5px 10px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Download
                </a>
                <button
                  onClick={close}
                  aria-label="Close"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 7,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "transparent",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            {/* Image — shown properly, scrollable like a real resume */}
            {/\.(png|jpe?g|webp|gif|avif)$/i.test(modal.src) ? (
              <div style={{ background: "#e8e8e8", overflowY: "auto", maxHeight: "82vh", padding: "16px", display: "flex", justifyContent: "center" }}>
                <img
                  src={modal.src}
                  alt={modal.title}
                  style={{
                    display: "block",
                    width: "100%",
                    maxWidth: "700px",
                    height: "auto",
                    imageRendering: "auto",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
                    borderRadius: 4,
                  }}
                />
              </div>
            ) : (
              <div style={{ height: "90vh" }}>
                <iframe
                  src={`${modal.src}#view=FitH`}
                  title={modal.title}
                  style={{ width: "100%", height: "100%", border: "none" }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </PdfModalContext.Provider>
  );
}