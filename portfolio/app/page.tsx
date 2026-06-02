import { Navbar }          from "@/components/Navbar";
import { HeroSection }     from "@/components/HeroSection";
import { SparklesBridge }  from "@/components/SparklesBridge";
import { AboutSection }    from "@/components/AboutSection";
import { SkillsSection }   from "@/components/SkillsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { EducationSection} from "@/components/EducationSection";
import { ContactSection }  from "@/components/ContactSection";
import { Footer }          from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 30 }}>
        <SparklesBridge />
        {/*
          All sections now share the same page-wrapper so HeroSection
          gets the same side borders as the rest. No marginTop gap.
        */}
        <div className="page-wrapper">
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <EducationSection />
          <ContactSection />
          <Footer />
        </div>
      </main>
    </>
  );
}
