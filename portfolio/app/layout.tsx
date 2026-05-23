import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Indresh Thakur — AI Software Engineer",
  description: "AI Software Engineer & Full-Stack Developer. Building intelligent systems with precision and craft.",
  keywords: ["AI Engineer", "Full Stack Developer", "Next.js", "React", "Machine Learning"],
  openGraph: {
    title: "Indresh Thakur — AI Software Engineer",
    description: "Building intelligent systems with precision and craft.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}