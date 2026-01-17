import Hero from "../components/Hero";
import CTA from "../components/CTA";
import USPCards from "../components/USPCards";

export default function Home() {
  return (
    <>
      <Hero />
      <CTA />
      <USPCards id="usps" />
    </>
  );
}