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
      <main style={{ paddingTop: 33 }}>
        <SparklesBridge />
        <HeroSection />
        {/* page-wrapper constrains center content + provides side borders */}
        <div className="page-wrapper" style={{ marginTop: 34 }}>
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
