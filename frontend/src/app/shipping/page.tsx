import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";

export default function ShippingPage() {
  return (
    <Container>
      <Navbar />
      <div className="py-24 max-w-xl">
        <h1 className="font-[family-name:var(--font-display)] text-3xl mb-8">Shipping</h1>
        <div className="space-y-4 text-foreground-dim text-sm leading-relaxed">
          <p>Kathmandu Valley: NPR 100, 1–2 business days.</p>
          <p>Outside Valley: NPR 200, 3–5 business days.</p>
          <p>Free shipping on all orders above NPR 10,000.</p>
        </div>
      </div>
      <Footer />
    </Container>
  );
}