"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useCart } from "@/lib/CartContext";
import { apiFetch } from "@/lib/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, refreshCart } = useCart();
  const [form, setForm] = useState({
    street: "",
    city: "",
    province: "",
    postalCode: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"esewa" | "khalti" | "cod">("cod");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiFetch("/orders", {
        method: "POST",
        body: JSON.stringify({ shippingAddress: form, paymentMethod }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Could not place order");
        return;
      }

      await refreshCart();
      router.push(`/order-confirmation/${data._id}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <Container>
        <Navbar />
        <div className="py-24">
          <p className="text-foreground-faint">Your cart is empty.</p>
        </div>
        <Footer />
      </Container>
    );
  }

  return (
    <Container>
      <Navbar />
      <div className="py-16 grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-14">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl mb-8">Checkout</h1>
          <form onSubmit={handleSubmit}>
            <Input
              label="Street address"
              value={form.street}
              onChange={(e) => setForm({ ...form, street: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                required
              />
              <Input
                label="Postal code"
                value={form.postalCode}
                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                required
              />
            </div>
            <Input
              label="Province"
              value={form.province}
              onChange={(e) => setForm({ ...form, province: e.target.value })}
              required
            />
            <Input
              label="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />

            <div className="mt-6 mb-6">
              <div className="text-[11px] tracking-[0.1em] uppercase text-foreground-faint mb-3">
                Payment method
              </div>
              <div className="flex gap-3">
                {(["esewa", "khalti", "cod"] as const).map((method) => (
                  <button
                    type="button"
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`px-4 py-2.5 text-sm border rounded-md capitalize ${
                      paymentMethod === method
                        ? "border-accent text-accent"
                        : "border-border-strong text-foreground-dim"
                    }`}
                  >
                    {method === "cod" ? "Cash on delivery" : method}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-accent text-sm mb-4">{error}</p>}
            <Button variant="primary" className="w-full" disabled={loading}>
              {loading ? "Placing order..." : "Place order"}
            </Button>
          </form>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 h-fit">
          <div className="text-[11px] tracking-[0.16em] uppercase text-foreground-faint mb-4">
            Order summary
          </div>
          {items.map((item) => (
            <div
              key={`${item.product._id}-${item.variantSku || ""}`}
              className="flex justify-between text-sm mb-2.5"
            >
              <span className="text-foreground-dim">
                {item.product.name} × {item.quantity}
              </span>
              <span>NPR {(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between mt-4 pt-4 border-t border-border font-[family-name:var(--font-display)]">
            <span>Subtotal</span>
            <span className="text-accent">NPR {subtotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <Footer />
    </Container>
  );
}