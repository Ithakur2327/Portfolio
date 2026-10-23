"use client";
import { useReveal } from "./useReveal";
import { SectionTitleIcon } from "./SectionIcon";
import { Panel3D } from "./Panel3D";
import { Timeline, type TimelineEntry } from "./Timeline";
import { EXPERIENCE, type ExperienceItem } from "@/lib/experience-data";
import { mq } from "@/lib/breakpoints";

const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif";

function toEntry(x: ExperienceItem): TimelineEntry {
  const ongoing = x.to === "Present";
  return {
    label: `${x.from} – ${x.to}`,
    sublabel: x.duration ?? (ongoing ? "Ongoing" : undefined),
    current: ongoing,
    content: (
      <article className="xp-card">
        <div className="xp-period-inline">{x.from} – {x.to}</div>
        <div className="xp-head">
          <h3 className="xp-role">{x.role}</h3>
          <span className="xp-badge" data-kind={x.kind}>{x.kind}</span>
        </div>
        <div className="xp-meta">
          {x.company !== x.kind && <span>{x.company}</span>}
          {x.mode && (<>{x.company !== x.kind && <i className="xp-dotsep" />}<span>{x.mode}</span></>)}
          {x.duration && (<><i className="xp-dotsep" /><span>{x.duration}</span></>)}
          {ongoing && (<>{(x.company !== x.kind || x.mode || x.duration) && <i className="xp-dotsep" />}<span className="xp-live">Ongoing</span></>)}
        </div>
        <p className="xp-summary">{x.summary}</p>
        <ul className="xp-points">
          {x.points.map((p) => <li key={p}>{p}</li>)}
        </ul>
        <div className="xp-stack">
          {x.stack.map((t) => <span key={t} className="tag">{t}</span>)}
        </div>
      </article>
    ),
  };
}

const ENTRIES = EXPERIENCE.map(toEntry);

// Experience section (sits right after About)
export function ExperienceSection() {
  const { ref, revealClass } = useReveal();

  return (
    <>
      <style suppressHydrationWarning>{`
        .xp-content { padding: 26px 22px 26px; }
        ${mq.navCollapse} { .xp-content { padding: 22px 16px 22px; } }
        ${mq.mobile} { .xp-content { padding: 18px 8px 18px; } }
      `}</style>

      <section id="experience" ref={ref} className={revealClass}>
        <div style={{ position: "relative", left: "50%", marginLeft: "-50vw", width: "100vw", background: "var(--bg-base)" }}>
          <Panel3D tilt={false}>
            <div className="xp-content">
              <span style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, fontFamily: SF, color: "var(--text-primary)" }}>
                <SectionTitleIcon type="briefcase" />
                Experience
              </span>
              <div style={{ height: 1, background: "var(--border)", margin: "18px 0 24px" }} />
              <Timeline data={ENTRIES} />
            </div>
          </Panel3D>
        </div>
      </section>
    </>
  );
}
