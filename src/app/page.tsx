import { LensProvider } from "@/components/lens-context";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Nav } from "@/components/nav";
import { ScrollProgress } from "@/components/scroll-progress";
import { Hero } from "@/components/hero";
import { StatsBand } from "@/components/stats-band";
import { Work } from "@/components/work";
import { Skills } from "@/components/skills";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { EasterEgg } from "@/components/easter-egg";

export default function Home() {
  return (
    <>
      <div className="grain" aria-hidden />
      <SmoothScroll />
      <LensProvider>
        <ScrollProgress />
        <Nav />
        <main>
          <Hero />
          <StatsBand />
          <Work />
          <Skills />
          <About />
          <Contact />
        </main>
        <EasterEgg />
      </LensProvider>
    </>
  );
}
