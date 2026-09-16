"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import { getToken, clearToken } from "@/lib/auth";
import { apiFetch } from "@/lib/api";

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

const TABS = ["Orders", "Wishlist", "Profile"] as const;

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Orders");
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => {
        clearToken();
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
          <p className="text-foreground-faint text-sm">No orders yet.</p>
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