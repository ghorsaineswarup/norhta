"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { apiFetch } from "@/lib/api";

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePay() {
    setLoading(true);
    setError("");
    const res = await apiFetch(`/orders/${params.orderId}/pay`, { method: "POST" });
    if (!res.ok) {
      const data = await res.json();
      setError(data.message || "Payment failed");
      setLoading(false);
      return;
    }
    router.push(`/order-confirmation/${params.orderId}`);
  }

  return (
    <Container>
      <Navbar />
      <div className="py-24 max-w-sm mx-auto text-center">
        <div className="text-[11px] tracking-[0.2em] uppercase text-foreground-faint mb-3">
          Sandbox payment
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl mb-6">
          Confirm payment
        </h1>
        <p className="text-foreground-dim text-sm mb-8">
          This is a demo payment flow. No real transaction will occur.
        </p>
        {error && <p className="text-accent text-sm mb-4">{error}</p>}
        <Button variant="primary" className="w-full" onClick={handlePay} disabled={loading}>
          {loading ? "Processing..." : "Pay now"}
        </Button>
      </div>
    </Container>
  );
}