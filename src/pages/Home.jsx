import Hero from "../components/Hero";
import CTA from "../components/CTA";
import USPCards from "../components/USPCards";
import About from "../components/About";
import VisionMission from "../components/VisionMission";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <USPCards id="usps" />
      <VisionMission />
      <CTA />
    </>
  );
}