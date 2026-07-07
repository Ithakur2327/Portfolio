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

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 52 }}>
        <SparklesBridge />
        <div className="page-wrapper">
          <HeroSection />
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
    </>
  );
}