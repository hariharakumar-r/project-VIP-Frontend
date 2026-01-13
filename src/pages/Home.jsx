import Hero from "../components/Hero";
import CTA from "../components/CTA";
import USPCards from "../components/USPCards";
import Contact from "../components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <CTA />
      <USPCards id="usps" />
      <Contact id="contact" />
    </>
  );
}