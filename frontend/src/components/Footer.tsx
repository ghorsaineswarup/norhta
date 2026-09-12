import Link from "next/link";

const footerColumns = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/shop" },
      { label: "Packs", href: "/shop?category=packs" },
      { label: "Jackets", href: "/shop?category=jackets" },
      { label: "Footwear", href: "/shop?category=footwear" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our story", href: "/about" },
      { label: "Journal", href: "/journal" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Login", href: "/login" },
      { label: "Orders", href: "/account/orders" },
      { label: "Wishlist", href: "/account/wishlist" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="pt-16 pb-10">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
        <div>
          <div className="font-[family-name:var(--font-display)] font-bold text-base tracking-[0.2em]">
            NORHTA
          </div>
          <p className="text-foreground-faint text-xs mt-3">
            Engineered for the edge.
          </p>
        </div>

        {footerColumns.map((col) => (
          <div key={col.title}>
            <h4 className="font-[family-name:var(--font-display)] text-[11px] tracking-[0.16em] uppercase text-foreground-faint mb-4">
              {col.title}
            </h4>
            {col.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block text-sm text-foreground-dim hover:text-foreground mb-2.5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-12 pt-6 border-t border-border text-[11px] tracking-[0.14em] uppercase text-foreground-faint">
        <div>Est. Nepal</div>
        <div>Kathmandu, Nepal</div>
      </div>
    </footer>
  );
}