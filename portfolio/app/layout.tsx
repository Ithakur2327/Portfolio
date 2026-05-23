import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { DotBackground } from "@/components/DotBackground";
import "./globals.css";

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
      <body suppressHydrationWarning>
        <ThemeProvider>
          <DotBackground />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
