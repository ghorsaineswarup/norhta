import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";

type Product = {
  slug: string;
  name: string;
  price: number;
  category?: { name: string };
};

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <Container>
      <Navbar />

      <div className="py-16">
        <h1 className="font-[family-name:var(--font-display)] text-3xl mb-2">Shop</h1>
        <p className="text-foreground-faint text-sm mb-10">
          {products.length} products
        </p>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map((p) => (
              <ProductCard
                key={p.slug}
                slug={p.slug}
                name={p.name}
                price={`NPR ${p.price.toLocaleString()}`}
              />
            ))}
          </div>
        ) : (
          <p className="text-foreground-faint">No products available right now.</p>
        )}
      </div>

      <Footer />
    </Container>
  );
}