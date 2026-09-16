"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { useCart } from "@/lib/CartContext";
import { apiFetch } from "@/lib/api";

export default function CartPage() {
  const { items, subtotal, refreshCart, loading } = useCart();

  async function updateQuantity(productId: string, variantSku: string | undefined, quantity: number) {
    if (quantity < 1) return;
    await apiFetch("/cart/update", {
      method: "PUT",
      body: JSON.stringify({ productId, variantSku, quantity }),
    });
    refreshCart();
  }

  async function removeItem(productId: string, variantSku: string | undefined) {
    const params = new URLSearchParams({ productId, ...(variantSku ? { variantSku } : {}) });
    await apiFetch(`/cart/remove?${params.toString()}`, { method: "DELETE" });
    refreshCart();
  }

  return (
    <Container>
      <Navbar />
      <div className="py-16">
        <h1 className="font-[family-name:var(--font-display)] text-2xl mb-10">Your cart</h1>

        {loading ? (
          <p className="text-foreground-faint">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-foreground-faint">Your pack is ready when you are.</p>
        ) : (
          <div className="max-w-lg">
            {items.map((item) => (
              <div
                key={`${item.product._id}-${item.variantSku || ""}`}
                className="flex gap-4 py-5 border-b border-border"
              >
                <div
                  className="w-16 h-16 rounded-md flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, var(--color-accent), transparent 70%)",
                    opacity: 0.14,
                  }}
                />
                <div className="flex-1">
                  <div className="text-sm">{item.product.name}</div>
                  <div className="text-xs text-foreground-faint mt-1">
                    NPR {item.price.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-border-strong rounded-md">
                      <button
                        onClick={() =>
                          updateQuantity(item.product._id, item.variantSku, item.quantity - 1)
                        }
                        className="px-3 py-1 text-sm"
                      >
                        −
                      </button>
                      <span className="px-2 text-xs">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product._id, item.variantSku, item.quantity + 1)
                        }
                        className="px-3 py-1 text-sm"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.product._id, item.variantSku)}
                      className="text-xs text-foreground-faint hover:text-accent"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between mt-6 mb-6">
              <span className="font-[family-name:var(--font-display)] text-sm">Subtotal</span>
              <span className="font-[family-name:var(--font-display)] text-sm text-accent">
                NPR {subtotal.toLocaleString()}
              </span>
            </div>

            <Button variant="primary" href="/checkout" className="w-full">
              Checkout
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </Container>
  );
}