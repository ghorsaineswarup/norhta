"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-r border-border p-6">
      <div className="font-[family-name:var(--font-display)] text-xs tracking-[0.14em] uppercase mb-8">
        NORHTA Admin
      </div>
      <nav className="flex flex-col gap-1 text-sm">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={
              pathname === item.href
                ? "text-accent px-3 py-2"
                : "text-foreground-dim px-3 py-2 hover:text-foreground"
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
