"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import { apiFetch } from "@/lib/api";
import OrderTimeline from "@/components/OrderTimeline";

type UserInfo = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
};

type WishlistProduct = {
  _id: string;
  name: string;
  slug: string;
  price: number;
};

type Order = {
  _id: string;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  items: { name: string; quantity: number; price: number }[];
};

const TABS = ["Orders", "Wishlist", "Profile"] as const;

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Orders");
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    apiFetch("/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => {
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    if (activeTab !== "Wishlist" || !user) return;
    setWishlistLoading(true);
    apiFetch("/wishlist")
      .then((res) => res.json())
      .then((data) => setWishlist(data.products || []))
      .finally(() => setWishlistLoading(false));
  }, [activeTab, user]);

  useEffect(() => {
    if (activeTab !== "Orders" || !user) return;
    setOrdersLoading(true);
    apiFetch("/orders/my-orders")
      .then((res) => res.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .finally(() => setOrdersLoading(false));
  }, [activeTab, user]);

  async function removeFromWishlist(productId: string) {
    await apiFetch(`/wishlist/remove/${productId}`, { method: "DELETE" });
    setWishlist((prev) => prev.filter((p) => p._id !== productId));
  }

  if (loading) {
    return (
      <Container>
        <Navbar />
        <div className="py-24 text-foreground-faint">Loading...</div>
      </Container>
    );
  }

  if (!user) return null;

  return (
    <Container>
      <Navbar />
      <div className="py-16">
        <h1 className="font-[family-name:var(--font-display)] text-2xl mb-1">
          Welcome back, {user.name}
        </h1>
        <p className="text-foreground-faint text-sm mb-10">{user.email}</p>

        <div className="flex gap-8 border-b border-border mb-8">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-[family-name:var(--font-display)] text-[11px] tracking-[0.14em] uppercase pb-3.5 border-b-2 -mb-px ${
                activeTab === tab
                  ? "text-accent border-accent"
                  : "text-foreground-faint border-transparent"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Orders" && (
          <div>
            {ordersLoading ? (
              <p className="text-foreground-faint text-sm">Loading...</p>
            ) : orders.length === 0 ? (
              <p className="text-foreground-faint text-sm">No expeditions yet.</p>
            ) : (
              <div className="max-w-lg space-y-3">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-card border border-border rounded-lg p-5"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-[family-name:var(--font-display)] text-sm">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-foreground-faint mb-4">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className="mb-4">
                      <OrderTimeline status={order.orderStatus} />
                    </div>
                    {order.items.map((item, i) => (
                      <div key={i} className="text-sm text-foreground-dim">
                        {item.name} × {item.quantity}
                      </div>
                    ))}
                    <div className="text-sm mt-2 pt-2 border-t border-border">
                      Total: <span className="text-accent">NPR {order.total.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "Wishlist" && (
          <div>
            {wishlistLoading ? (
              <p className="text-foreground-faint text-sm">Loading...</p>
            ) : wishlist.length === 0 ? (
              <p className="text-foreground-faint text-sm">Your field kit is empty.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
                {wishlist.map((p) => (
                  <div
                    key={p._id}
                    className="bg-card border border-border rounded-lg p-4"
                  >
                    <div className="text-sm">{p.name}</div>
                    <div className="text-xs text-foreground-faint mt-1">
                      NPR {p.price.toLocaleString()}
                    </div>
                    <button
                      onClick={() => removeFromWishlist(p._id)}
                      className="text-xs text-foreground-faint hover:text-accent mt-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "Profile" && (
          <div className="max-w-sm text-sm space-y-3">
            <div>
              <span className="text-foreground-faint">Name: </span>
              {user.name}
            </div>
            <div>
              <span className="text-foreground-faint">Email: </span>
              {user.email}
            </div>
            <div>
              <span className="text-foreground-faint">Phone: </span>
              {user.phone || "Not set"}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </Container>
  );
}