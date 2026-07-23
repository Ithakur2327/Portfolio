import { Navbar }          from "@/components/Navbar";
import { HeroSection }     from "@/components/HeroSection";
import { SparklesBridge }  from "@/components/SparklesBridge";
import { AboutSection }    from "@/components/AboutSection";
import { StatsSection }    from "@/components/StatsSection";
import { DotDivider }      from "@/components/DotBackground";
import { SkillsSection }   from "@/components/SkillsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { EducationSection} from "@/components/EducationSection";
import { CertificationsSection } from "@/components/CertificationsSection";
import { Footer }          from "@/components/Footer";
import { ScrollFadeAndTop } from "@/components/ScrollFadeAndTop";
import { createHash }      from "crypto";
import { readFileSync }    from "fs";
import path                from "path";


function getAvatarVersion(): string {
  try {
    const dark = readFileSync(path.join(process.cwd(), "public", "avatar-dark.jpg"));
    const light = readFileSync(path.join(process.cwd(), "public", "avatar-light.jpg"));
    return createHash("md5").update(dark).update(light).digest("hex").slice(0, 10);
  } catch {
    return "0";
  }
}

export default function Home() {
  const avatarVersion = getAvatarVersion();
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 52 }}>
        <SparklesBridge />
        <div className="page-wrapper">
          <HeroSection avatarVersion={avatarVersion} />
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
          <CertificationsSection />
          <Footer />
        </div>
      </main>
      <ScrollFadeAndTop />
    </>
  );
}