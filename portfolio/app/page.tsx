import { Navbar }          from "@/components/Navbar";
import { HeroSection }     from "@/components/HeroSection";

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
      <main>
        {/* Extra spacing between navbar (52px fixed) and hero */}
        <div style={{ height: 28 }} />

        {/* Hero — full width, outside page-wrapper */}
        <HeroSection />

        {/* Animated divider at bottom of hero */}
        <div style={{ maxWidth: 1060, margin: "0 auto", overflow: "visible", position: "relative" }}>
          
        </div>

        {/* Rest of content inside page-wrapper */}
        <div className="page-wrapper" style={{ marginTop: 16 }}>
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
