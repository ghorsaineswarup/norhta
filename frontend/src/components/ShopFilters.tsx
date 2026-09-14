"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type Category = {
  name: string;
  slug: string;
};

const PRICE_RANGES = [
  { label: "Under NPR 10,000", min: 0, max: 10000 },
  { label: "NPR 10,000–20,000", min: 10000, max: 20000 },
  { label: "NPR 20,000–30,000", min: 20000, max: 30000 },
  { label: "NPR 30,000+", min: 30000, max: undefined },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Rating" },
];

export default function ShopFilters({ categories = [] }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/shop?${params.toString()}`);
    },
    [router, searchParams]
  );

  const activeCategory = searchParams.get("category");
  const activeMin = searchParams.get("minPrice");
  const activeMax = searchParams.get("maxPrice");
  const activeSort = searchParams.get("sort") || "featured";
  const activeSearch = searchParams.get("search") || "";

  return (
    <aside>
      <div className="mb-8">
        <input
          type="text"
          defaultValue={activeSearch}
          placeholder="Search products"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateParam("search", (e.target as HTMLInputElement).value || undefined);
            }
          }}
          className="w-full bg-transparent border border-border-strong rounded-md px-4 py-3 text-sm focus:outline-none focus:border-accent"
        />
      </div>

      <div className="mb-8">
        <h4 className="font-[family-name:var(--font-display)] text-[11px] tracking-[0.16em] uppercase text-foreground-faint mb-4">
          Sort
        </h4>
        <select
          value={activeSort}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="w-full bg-transparent border border-border-strong rounded-md px-3 py-2.5 text-sm"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-background text-foreground">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-8">
        <h4 className="font-[family-name:var(--font-display)] text-[11px] tracking-[0.16em] uppercase text-foreground-faint mb-4">
          Category
        </h4>
        {categories.map((cat) => (
          <label key={cat.slug} className="flex items-center gap-2.5 text-sm text-foreground-dim mb-3 cursor-pointer">
            <input
              type="checkbox"
              checked={activeCategory === cat.slug}
              onChange={() =>
                updateParam("category", activeCategory === cat.slug ? undefined : cat.slug)
              }
            />
            {cat.name}
          </label>
        ))}
      </div>

      <div className="mb-8">
        <h4 className="font-[family-name:var(--font-display)] text-[11px] tracking-[0.16em] uppercase text-foreground-faint mb-4">
          Price
        </h4>
        {PRICE_RANGES.map((range) => {
          const isActive =
            activeMin === String(range.min) &&
            activeMax === (range.max ? String(range.max) : null);
          return (
            <label key={range.label} className="flex items-center gap-2.5 text-sm text-foreground-dim mb-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => {
                  if (isActive) {
                    updateParam("minPrice", undefined);
                    updateParam("maxPrice", undefined);
                  } else {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("minPrice", String(range.min));
                    if (range.max) {
                      params.set("maxPrice", String(range.max));
                    } else {
                      params.delete("maxPrice");
                    }
                    router.push(`/shop?${params.toString()}`);
                  }
                }}
              />
              {range.label}
            </label>
          );
        })}
      </div>
    </aside>
  );
}