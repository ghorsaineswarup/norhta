"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import Button from "@/components/Button";
import { apiFetch } from "@/lib/api";
import { useParams } from "next/navigation";

type Order = {
  _id: string;
  total: number;
  orderStatus: string;
  items: { name: string; quantity: number; price: number }[];
};

export default function OrderConfirmationPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    apiFetch(`/orders/${params.id}`)
      .then((res) => res.json())
      .then(setOrder);
  }, [params.id]);

  return (
    <Container>
      <Navbar />
      <div className="py-24 max-w-md">
        <h1 className="font-[family-name:var(--font-display)] text-2xl mb-2">
          Order confirmed
        </h1>
        {order ? (
          <>
            <p className="text-foreground-faint text-sm mb-8">
              Order #{order._id.slice(-8).toUpperCase()}
            </p>
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm mb-2 text-foreground-dim">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>NPR {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between mt-4 pt-4 border-t border-border font-[family-name:var(--font-display)]">
              <span>Total</span>
              <span className="text-accent">NPR {order.total.toLocaleString()}</span>
            </div>
          </>
        ) : (
          <p className="text-foreground-faint">Loading...</p>
        )}
        <Link href="/shop">
          <Button variant="ghost" className="mt-8">
            Continue shopping
          </Button>
        </Link>
      </div>
      <Footer />
    </Container>
  );
}