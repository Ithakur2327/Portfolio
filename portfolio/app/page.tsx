import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";

const SparklesBridge = dynamic(
  () => import("@/components/SparklesBridge").then((mod) => mod.SparklesBridge),
  { ssr: false, loading: () => null }
);
const AboutSection = dynamic(
  () => import("@/components/AboutSection").then((mod) => mod.AboutSection),
  { ssr: false, loading: () => null }
);
const SkillsSection = dynamic(
  () => import("@/components/SkillsSection").then((mod) => mod.SkillsSection),
  { ssr: false, loading: () => null }
);
const ProjectsSection = dynamic(
  () => import("@/components/ProjectsSection").then((mod) => mod.ProjectsSection),
  { ssr: false, loading: () => null }
);
const EducationSection = dynamic(
  () => import("@/components/EducationSection").then((mod) => mod.EducationSection),
  { ssr: false, loading: () => null }
);
const ContactSection = dynamic(
  () => import("@/components/ContactSection").then((mod) => mod.ContactSection),
  { ssr: false, loading: () => null }
);
const Footer = dynamic(
  () => import("@/components/Footer").then((mod) => mod.Footer),
  { ssr: false, loading: () => null }
);

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 40 }}>
        <SparklesBridge />
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
