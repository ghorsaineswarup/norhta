import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import Button from "@/components/Button";
import SectionTitle from "@/components/SectionTitle";
import ProductCard from "@/components/ProductCard";
import HomeClient from "@/components/HomeClient";

type FeaturedProduct = {
  slug: string;
  name: string;
  price: number;
  images?: string[];
   featured: boolean;

};

async function getFeaturedProducts(): Promise<FeaturedProduct[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      cache: "no-store",
    });

    if (!res.ok) return [];

    const products: FeaturedProduct[] = await res.json();

    return products
      .filter((p) => p.featured)
      .slice(0, 3);
  } catch {
    return [];
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <HomeClient>
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
          <SectionTitle>A45 — Technical 45L trekking pack</SectionTitle>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            {[
              ["45L", "Capacity"],
              ["1.4kg", "Weight"],
              ["700D", "Ripstop"],
              ["IPX4", "Weather"],
            ].map(([val, label]) => (
              <div
                key={label}
                className="border border-border rounded-md text-center py-6 px-4"
              >
                <div className="font-[family-name:var(--font-display)] text-xl text-accent font-medium">
                  {val}
                </div>

                <div className="text-[10px] tracking-[0.18em] uppercase text-foreground-faint mt-1.5">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 border-t border-border max-w-xl">
          <h2 className="font-[family-name:var(--font-display)] text-3xl mb-4">
            Built where the air gets thin.
          </h2>

          <p className="text-foreground-dim leading-relaxed">
            Designed for unpredictable weather, long approaches and demanding
            terrain — every component earns its place before it earns its
            weight.
          </p>
        </section>

        <section className="py-16 border-t border-border">
          <SectionTitle>Collection</SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((p) => (
                <ProductCard
                  key={p.slug}
                  slug={p.slug}
                  name={p.name}
                  price={`NPR ${p.price.toLocaleString()}`}
                  image={p.images?.[0]}
                />
              ))
            ) : (
              <p className="text-foreground-faint text-sm">
                No featured products yet.
              </p>
            )}
          </div>
        </section>

        <section className="py-16 border-t border-border max-w-xl">
          <h2 className="font-[family-name:var(--font-display)] text-3xl mb-4">
            Born in Kathmandu.
          </h2>

          <p className="text-foreground-dim leading-relaxed">
            NORHTA was created around a simple idea: outdoor equipment should
            be designed with purpose, not decoration. Tested in the Himalayas.
          </p>
        </section>

        <section className="py-16 border-t border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <SectionTitle>Field notes</SectionTitle>

            <p className="text-foreground-dim text-sm">
              Stories, gear releases and mountain notes.
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <input
              placeholder="your@email.com"
              className="bg-transparent border border-border-strong rounded-full px-5 py-3.5 text-sm flex-1 md:w-64 focus:outline-none focus:border-accent"
            />

            <Button variant="primary">Join</Button>
          </div>
        </section>

        <Footer />
      </Container>
    </HomeClient>
  );
}