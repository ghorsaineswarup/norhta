import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import Button from "@/components/Button";
import SectionTitle from "@/components/SectionTitle";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  return (
    <Container>
      <Navbar />

      <div className="flex flex-col items-center justify-center text-center gap-6 py-32">
        <div className="font-[family-name:var(--font-display)] font-bold text-5xl md:text-8xl tracking-[0.18em] uppercase">
          Norhta
        </div>
        <p className="font-[family-name:var(--font-display)] text-sm tracking-[0.28em] uppercase text-foreground-dim">
          Engineered for the edge
        </p>
        <div className="flex gap-4 flex-wrap justify-center mt-2">
          <Button href="/shop" variant="primary">
            Shop the A45
          </Button>
          <Button href="/about" variant="ghost">
            Explore the system
          </Button>
        </div>
      </div>

      <section className="py-16 border-t border-border">
        <SectionTitle>Collection</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ProductCard slug="a45" name="A45" price="NPR 18,900" />
          <ProductCard slug="alpine-x1" name="Alpine X1" price="NPR 24,500" />
          <ProductCard slug="trek-01" name="Trek-01" price="NPR 16,800" />
        </div>
      </section>

      <Footer />
    </Container>
  );
}