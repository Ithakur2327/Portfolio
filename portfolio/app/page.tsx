import { Navbar }          from "@/components/Navbar";
import { HeroSection }     from "@/components/HeroSection";
import { SparklesBridge }  from "@/components/SparklesBridge";
import { AboutSection }    from "@/components/AboutSection";
import { StatsSection }    from "@/components/StatsSection";
import { DotDivider }      from "@/components/DotBackground";
import { SkillsSection }   from "@/components/SkillsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { EducationSection} from "@/components/EducationSection";
import { ContactSection }  from "@/components/ContactSection";
import { Footer }          from "@/components/Footer";
import { ScrollFadeAndTop } from "@/components/ScrollFadeAndTop";

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 52 }}>
        <SparklesBridge />
        <div className="page-wrapper">
          <div style={{ minHeight: "calc(100dvh - 52px)", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
            <HeroSection />
          </div>
          <DotDivider />
          <AboutSection />
          <DotDivider />
          <StatsSection />
          <DotDivider />
          <SkillsSection />
          <DotDivider />
          <ProjectsSection />
          <DotDivider />
          <EducationSection />
          <DotDivider />
          <ContactSection />
          <Footer />
        </div>
      </main>
      <ScrollFadeAndTop />
    </>
  );
}