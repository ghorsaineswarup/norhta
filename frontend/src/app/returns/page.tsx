import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";

export default function ReturnsPage() {
  return (
    <Container>
      <Navbar />
      <div className="py-24 max-w-xl">
        <h1 className="font-[family-name:var(--font-display)] text-3xl mb-8">Returns</h1>
        <div className="space-y-4 text-foreground-dim text-sm leading-relaxed">
          <p>30-day return window from date of delivery.</p>
          <p>Items must be unused, unworn, and in original packaging.</p>
          <p>Contact us to initiate a return before sending items back.</p>
        </div>
      </div>
      <Footer />
    </Container>
  );
}