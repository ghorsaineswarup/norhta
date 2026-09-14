import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import ProductDetailClient from "@/components/ProductDetailClient";
import ProductCard from "@/components/ProductCard";

type Product = {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  price: number;
  images: string[];
  specifications?: Record<string, string>;
  stock: number;
  variants: { sku: string; color?: string; size?: string; stock: number }[];
  category?: { name: string; slug: string };
};

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getRelatedProducts(categorySlug: string, currentSlug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?category=${categorySlug}`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const products: Product[] = await res.json();
    return products.filter((p) => p.slug !== currentSlug).slice(0, 3);
  } catch {
    return [];
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const related = product.category
    ? await getRelatedProducts(product.category.slug, product.slug)
    : [];

  return (
    <Container>
      <Navbar />

      <ProductDetailClient product={product} />

      {related.length > 0 && (
        <section className="py-16 border-t border-border">
          <h2 className="font-[family-name:var(--font-display)] text-[11px] tracking-[0.2em] uppercase text-foreground-faint mb-6">
            You may also like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {related.map((p) => (
              <ProductCard
                key={p.slug}
                slug={p.slug}
                name={p.name}
                price={`NPR ${p.price.toLocaleString()}`}
              />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </Container>
  );
}