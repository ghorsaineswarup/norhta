import Link from "next/link";

type ProductCardProps = {
  slug: string;
  name: string;
  price: string;
};

export default function ProductCard({ slug, name, price }: ProductCardProps) {
  return (
    <Link
      href={`/product/${slug}`}
      className="block bg-card border border-border rounded-xl overflow-hidden transition-transform duration-200 hover:-translate-y-1"
    >
      <div
        className="aspect-[4/3]"
        style={{
          background:
            "linear-gradient(135deg, var(--color-accent) 0%, transparent 70%)",
          opacity: 0.14,
        }}
      />
      <div className="p-5">
        <div className="font-[family-name:var(--font-display)] text-sm tracking-[0.03em]">
          {name}
        </div>
        <div className="text-foreground-dim text-sm mt-1.5">{price}</div>
      </div>
    </Link>
  );
}