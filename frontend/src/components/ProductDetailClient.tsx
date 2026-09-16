"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { useCart } from "@/lib/CartContext";
import { apiFetch } from "@/lib/api";

type Product = {
  name: string;
  shortDescription?: string;
  description?: string;
  price: number;
  images: string[];
  specifications?: Record<string, string>;
  stock: number;
  variants: { sku: string; color?: string; size?: string; stock: number }[];
  category?: { name: string };
};

const TABS = ["Description", "Specs", "Shipping"] as const;

export default function ProductDetailClient({
  product,
  productId,
}: {
  product: Product;
  productId: string;
}) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Description");
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0]?.sku || null
  );
  const [cartMessage, setCartMessage] = useState("");
  const { addToCart } = useCart();

  const availableStock = selectedVariant
    ? product.variants.find((v) => v.sku === selectedVariant)?.stock ?? product.stock
    : product.stock;

  const colors = Array.from(
    new Set(product.variants?.map((v) => v.color).filter(Boolean))
  );

  return (
    <section className="py-10 grid grid-cols-1 md:grid-cols-2 gap-14">
      <div>
        <div
          className="aspect-square rounded-xl"
          style={{
            background: "linear-gradient(135deg, var(--color-accent) 0%, transparent 70%)",
            opacity: 0.14,
          }}
        />
        <div className="grid grid-cols-4 gap-2.5 mt-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-square bg-card border border-border rounded-md"
            />
          ))}
        </div>
      </div>

      <div>
        {product.category && (
          <div className="text-[11px] tracking-[0.16em] uppercase text-foreground-faint mb-2">
            {product.category.name}
          </div>
        )}
        <h1 className="font-[family-name:var(--font-display)] font-bold text-3xl uppercase tracking-[0.04em]">
          {product.name}
        </h1>
        {product.shortDescription && (
          <p className="text-foreground-dim mt-2">{product.shortDescription}</p>
        )}
        <div className="font-[family-name:var(--font-display)] text-2xl text-accent mt-5">
          NPR {product.price.toLocaleString()}
        </div>

        {colors.length > 0 && (
          <div className="mt-6">
            <div className="text-[11px] tracking-[0.1em] uppercase text-foreground-faint mb-2.5">
              Color
            </div>
            <div className="flex gap-2.5">
              {product.variants.map((v) => (
                <button
                  key={v.sku}
                  onClick={() => setSelectedVariant(v.sku)}
                  className={`px-4.5 py-2.5 text-sm border rounded-md ${
                    selectedVariant === v.sku
                      ? "border-accent text-accent"
                      : "border-border-strong text-foreground-dim"
                  }`}
                >
                  {v.color}
                  {v.size ? ` / ${v.size}` : ""}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <div className="text-[11px] tracking-[0.1em] uppercase text-foreground-faint mb-2.5">
            Quantity
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-border-strong rounded-md">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-2.5 text-lg"
              >
                −
              </button>
              <span className="px-2 text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))}
                className="px-4 py-2.5 text-lg"
              >
                +
              </button>
            </div>
            <span className="text-xs text-foreground-faint">
              {availableStock > 0 ? `${availableStock} in stock` : "Out of stock"}
            </span>
          </div>
        </div>

        <div className="flex gap-3 mt-7">
          <Button
            variant="primary"
            className="flex-1"
            disabled={availableStock === 0}
            onClick={async () => {
              const error = await addToCart(productId, quantity, selectedVariant || undefined);
              setCartMessage(error || "Added to cart");
              setTimeout(() => setCartMessage(""), 3000);
            }}
          >
            {availableStock === 0 ? "Out of stock" : "Add to cart"}
          </Button>
          <Button
            variant="ghost"
            onClick={async () => {
              await apiFetch("/wishlist/add", {
                method: "POST",
                body: JSON.stringify({ productId }),
              });
              setCartMessage("Added to wishlist");
              setTimeout(() => setCartMessage(""), 3000);
            }}
          >
            ♡ Wishlist
          </Button>
        </div>
        {cartMessage && <p className="text-sm mt-3 text-accent">{cartMessage}</p>}

        <div className="flex gap-7 border-b border-border mt-10">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-[family-name:var(--font-display)] text-[11px] tracking-[0.14em] uppercase pb-3.5 border-b-2 -mb-px ${
                activeTab === tab
                  ? "text-foreground border-accent"
                  : "text-foreground-faint border-transparent"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="py-6 text-foreground-dim text-sm leading-relaxed">
          {activeTab === "Description" && (product.description || "No description available.")}
          {activeTab === "Specs" && (
            product.specifications && Object.keys(product.specifications).length > 0 ? (
              <dl className="grid grid-cols-2 gap-y-2.5">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="contents">
                    <dt className="text-foreground-faint">{key}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              "No specifications listed."
            )
          )}
          {activeTab === "Shipping" &&
            "Kathmandu Valley: NPR 100. Outside Valley: NPR 200. Free shipping on orders above NPR 10,000."}
        </div>
      </div>
    </section>
  );
}