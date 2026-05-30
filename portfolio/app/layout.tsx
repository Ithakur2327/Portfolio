import type { Metadata } from "next";
import type { Viewport } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { DotBackground } from "@/components/DotBackground";
import "./globals.css";
import { Toaster } from "sonner"

// FIX: Explicit viewport export — prevents 300ms tap delay and layout shift on mobile
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#09090b" },
    { media: "(prefers-color-scheme: light)", color: "#f5f5f3" },
  ],
};

export const metadata: Metadata = {
  title: "Indresh Thakur — Full-Stack & AI Developer",
  description: "Computer science student (AI specialization) at NIET, passionate about full-stack development and generative AI systems.",
  keywords: ["Indresh Thakur", "Full-Stack Developer", "AI Developer", "React", "Next.js", "Node.js", "LLM", "NIET"],
  authors: [{ name: "Indresh Thakur" }],
  openGraph: {
    title: "Indresh Thakur — Full-Stack & AI Developer",
    description: "Building real-world apps with code.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <DotBackground />
          <div style={{ position: "relative", zIndex: 1 }}>
            {children}
             <Toaster /> 
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}