import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import ShopFilters from "@/components/ShopFilters";

type Product = {
  slug: string;
  name: string;
  price: number;
  images?: string[];
  category?: { name: string; slug: string };
};

type Category = {
  name: string;
  slug: string;
};

async function getProducts(searchParams: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  if (searchParams.search) params.set("search", searchParams.search);
  if (searchParams.category) params.set("category", searchParams.category);
  if (searchParams.minPrice) params.set("minPrice", searchParams.minPrice);
  if (searchParams.maxPrice) params.set("maxPrice", searchParams.maxPrice);
  if (searchParams.sort) params.set("sort", searchParams.sort);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?${params.toString()}`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ]);

  return (
    <Container>
      <Navbar />

      <div className="py-16">
        <h1 className="font-[family-name:var(--font-display)] text-3xl mb-2">Shop</h1>
        <p className="text-foreground-faint text-sm mb-10">
          {products.length} products
        </p>

        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10">
          <ShopFilters categories={categories} />

          <div>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map((p: Product) => (
                  <ProductCard
                    key={p.slug}
                    slug={p.slug}
                    name={p.name}
                    price={`NPR ${p.price.toLocaleString()}`}
                    image={p.images?.[0]}

                  />
                ))}
              </div>
            ) : (
              <p className="text-foreground-faint">
                No products match your filters.
              </p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </Container>
  );
}