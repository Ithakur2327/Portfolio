import dynamic from "next/dynamic";
import { HeroSection }     from "@/components/HeroSection";
import { SparklesBridge }  from "@/components/SparklesBridge";
import { AboutSection }    from "@/components/AboutSection";
import { DotDivider } from "@/components/DotBackground";
import { ScrollFadeAndTop } from "@/components/ScrollFadeAndTop";
import { ExperienceSection } from "@/components/ExperienceSection";
import { getAvatarVersion }  from "@/lib/avatar";

// Everything below the first screens is code-split: still server-rendered (so the
// HTML is complete and SEO is unchanged) but its JavaScript is downloaded and
// hydrated as separate, smaller tasks instead of one big block at startup.
const StatsSection          = dynamic(() => import("@/components/StatsSection").then(m => m.StatsSection));
const SkillsSection         = dynamic(() => import("@/components/SkillsSection").then(m => m.SkillsSection));
const ProjectsSection       = dynamic(() => import("@/components/ProjectsSection").then(m => m.ProjectsSection));
const EducationSection      = dynamic(() => import("@/components/EducationSection").then(m => m.EducationSection));
const CertificationsSection = dynamic(() => import("@/components/CertificationsSection").then(m => m.CertificationsSection));
const QuoteBoard            = dynamic(() => import("@/components/QuoteBoard").then(m => m.QuoteBoard));
const Footer                = dynamic(() => import("@/components/Footer").then(m => m.Footer));

export default function Home() {
  const avatarVersion = getAvatarVersion();
  return (
    <>
      <main style={{ paddingTop: "var(--nav-h)" }}>
        <SparklesBridge />
        <div className="page-wrapper">
          <HeroSection avatarVersion={avatarVersion} />
          <AboutSection />
          <DotDivider />
          <ExperienceSection />
          <DotDivider />
          <StatsSection />
          <DotDivider />
          <SkillsSection />
          <DotDivider />
          <ProjectsSection />
          <DotDivider />
          <EducationSection />
          <DotDivider />
          <CertificationsSection />
          <DotDivider />
          <QuoteBoard />
          <DotDivider />
          <Footer />
        </div>
      </main>
      <ScrollFadeAndTop />
    </>
  );
}