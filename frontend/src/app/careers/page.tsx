import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";

export default function CareersPage() {
  return (
    <Container>
      <Navbar />
      <div className="py-24 max-w-xl">
        <h1 className="font-[family-name:var(--font-display)] text-3xl mb-8">Careers</h1>
        <p className="text-foreground-dim text-sm leading-relaxed">
          We're not currently hiring, but we're always interested in hearing
          from people who care about technical outdoor equipment. Reach out
          via our contact page.
        </p>
      </div>
      <Footer />
    </Container>
  );
}