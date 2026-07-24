import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ContactPageForm } from "@/components/ContactPageForm";

export const metadata: Metadata = {
  title: "Contact — Indresh Thakur",
  description: "Get in touch with Indresh Thakur for freelance projects, collaborations, or job opportunities.",
};

const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";

function BackToHomeLink() {
  return (
    <Link href="/" className="back-home-link">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5"/><path d="M11 18l-6-6 6-6"/>
      </svg>
      Back to home
    </Link>
  );
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <style suppressHydrationWarning>{`
        .back-home-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 600; color: var(--text-muted);
          font-family: ${SF}; text-decoration: none; transition: color 0.15s;
        }
        .back-home-link:hover { color: var(--text-primary); }

        .contact-page-wrap { max-width: 720px; margin: 0 auto; }
        .contact-page-head {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; gap: 10px;
          padding-bottom: 30px; margin-bottom: 32px;
          border-bottom: 1px solid var(--border);
        }
        .contact-page-title {
          font-size: clamp(32px, 5vw, 44px);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          font-family: ${SF};
          margin: 0;
        }
        .contact-page-sub {
          font-size: 15px;
          color: var(--text-secondary);
          font-family: ${SF};
          max-width: 440px;
          margin: 0;
        }
      `}</style>
      <main style={{ paddingTop: 52 }}>
        <div className="page-wrapper">
          <div style={{ padding: "44px 0 80px" }}>
            <BackToHomeLink />

            <div style={{ paddingTop: 18 }}>
              <div className="contact-page-wrap">
                <div className="contact-page-head">
                  <h1 className="contact-page-title">Contact Me</h1>
                  <p className="contact-page-sub">
                    Get in touch with me. I&apos;ll get back to you as soon as possible.
                  </p>
                </div>

                <ContactPageForm />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}