import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";

export default function AboutPage() {
  return (
    <Container>
      <Navbar />
      <div className="py-24 max-w-xl">
        <div className="text-[11px] tracking-[0.2em] uppercase text-foreground-faint mb-4">
          Our story
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl mb-6">
          Born in Kathmandu.
        </h1>
        <p className="text-foreground-dim leading-relaxed mb-6">
          NORHTA was created around a simple idea: outdoor equipment should be
          designed with purpose, not decoration. Every component earns its
          place before it earns its weight.
        </p>
        <p className="text-foreground-dim leading-relaxed mb-6">
          Tested in the Himalayas, engineered for unpredictable weather, long
          approaches and demanding terrain — NORHTA exists for the moments
          where your gear can't afford to fail.
        </p>
        <p className="text-foreground-dim leading-relaxed">
          We're a small, focused team based in Kathmandu, building technical
          equipment for people who take the mountains seriously.
        </p>
      </div>
      <Footer />
    </Container>
  );
}