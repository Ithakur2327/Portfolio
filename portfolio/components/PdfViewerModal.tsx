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

            {/* PDF viewer — iframe on desktop, download prompt on mobile */}
            {/\.(png|jpe?g|webp|gif|avif)$/i.test(modal.src) ? (
              <div style={{ background: "#ffffff", overflowY: "auto", maxHeight: "82vh" }}>
                <img
                  src={modal.src}
                  alt={modal.title}
                  style={{ display: "block", width: "100%", height: "auto" }}
                />
              </div>
            ) : (
              <>
                {/* Desktop: iframe works fine */}
                <div className="pdf-iframe-wrap" style={{ height: "82vh" }}>
                  <iframe
                    src={`${modal.src}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                    title={modal.title}
                    style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                  />
                </div>
                {/* Mobile: show a clean open/download card instead */}
                <div className="pdf-mobile-fallback" style={{
                  display: "none",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 18,
                  padding: "48px 24px",
                  background: "var(--bg-base)",
                  minHeight: 260,
                }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: 16,
                    background: "rgba(239,68,68,0.12)",
                    border: "1px solid rgba(239,68,68,0.28)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="12" y1="18" x2="12" y2="12"/>
                      <line x1="9" y1="15" x2="15" y2="15"/>
                    </svg>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontFamily: "'Geist',sans-serif", fontWeight: 700, fontSize: 15, color: "var(--text-primary)", margin: "0 0 6px" }}>
                      {modal.title}
                    </p>
                    <p style={{ fontFamily: "'Geist',sans-serif", fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                      PDF preview not supported on mobile browsers.<br/>Open or download below.
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <a
                      href={modal.src}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 7,
                        padding: "10px 20px", borderRadius: 10,
                        background: "var(--bg-hover)", border: "1px solid var(--border)",
                        color: "var(--text-primary)", textDecoration: "none",
                        fontFamily: "'Geist',sans-serif", fontSize: 13, fontWeight: 600,
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      Open
                    </a>
                    <a
                      href={modal.downloadSrc}
                      download={modal.title.replace(/\s+/g, "_") + ".pdf"}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 7,
                        padding: "10px 20px", borderRadius: 10,
                        background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)",
                        color: "#818cf8", textDecoration: "none",
                        fontFamily: "'Geist',sans-serif", fontSize: 13, fontWeight: 600,
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      Download
                    </a>
                  </div>
                </div>
                <style suppressHydrationWarning>{`
                  @media (max-width: 640px) {
                    .pdf-iframe-wrap { display: none !important; }
                    .pdf-mobile-fallback { display: flex !important; }
                  }
                `}</style>
              </>
            )}
          </div>
        </div>
      )}
    </PdfModalContext.Provider>
  );
}