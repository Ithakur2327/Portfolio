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
  const [isMobile, setIsMobile] = useState(false);
  const [origin, setOrigin] = useState("");

  // Detect mobile layout on the client.
  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    setOrigin(window.location.origin);
  }, []);

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

  // Choose the right PDF viewer for each device.
  function getPdfSrc(src: string) {
    if (!isMobile) return `${src}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`;
    const fullUrl = src.startsWith("http") ? src : `${origin}${src}`;
    return `https://docs.google.com/viewer?url=${encodeURIComponent(fullUrl)}&embedded=true`;
  }

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
            padding: isMobile ? "0" : "48px 12px 12px",
            overflowY: "auto",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: isMobile ? "100%" : 780,
              height: isMobile ? "100dvh" : "auto",
              background: "var(--bg-base)",
              border: isMobile ? "none" : "1px solid var(--border)",
              borderRadius: isMobile ? 0 : 12,
              overflow: "hidden",
              boxShadow: "0 24px 70px rgba(0,0,0,0.6)",
              marginBottom: isMobile ? 0 : 12,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "10px 12px",
                borderBottom: "1px solid var(--border)",
                background: "var(--bg-secondary)",
                flexShrink: 0,
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
                  download={modal.title.replace(/\s+/g, "_") + ".pdf"}
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

            {/* Content */}
            {/\.(png|jpe?g|webp|gif|avif)$/i.test(modal.src) ? (
              <div style={{ background: "#ffffff", overflowY: "auto", flex: 1 }}>
                {/* eslint-disable-next-line @next/next/no-img-element -- on-demand modal content only rendered after a user opens it (no LCP impact), with dimensions unknown ahead of render */}
                <img
                  src={modal.src}
                  alt={modal.title}
                  style={{ display: "block", width: "100%", height: "auto" }}
                />
              </div>
            ) : (
              /*
                MOBILE FIX:
                Previously: CSS hid the iframe on mobile and showed a
                "PDF preview not supported" fallback — useless UX.

                Now: Google Docs Viewer URL is used on mobile.
                This renders PDFs in ALL browsers including:
                - Chrome Android ✓
                - Samsung Internet ✓
                - iOS Safari ✓
                - Firefox Mobile ✓

                Desktop: direct iframe with PDF toolbar (unchanged).
              */
              <iframe
                key={isMobile ? "mobile" : "desktop"}
                src={origin ? getPdfSrc(modal.src) : ""}
                title={modal.title}
                style={{
                  width: "100%",
                  flex: 1,
                  border: "none",
                  display: "block",
                  minHeight: isMobile ? 0 : "82vh",
                }}
              />
            )}
          </div>
        </div>
      )}
    </PdfModalContext.Provider>
  );
}