"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import { getToken, clearToken } from "@/lib/auth";

type UserInfo = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

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
          <span className="font-[family-name:var(--font-display)] text-[11px] tracking-[0.14em] uppercase text-accent pb-3.5 border-b-2 border-accent">
            Orders
          </span>
          <span className="font-[family-name:var(--font-display)] text-[11px] tracking-[0.14em] uppercase text-foreground-faint pb-3.5">
            Wishlist
          </span>
          <span className="font-[family-name:var(--font-display)] text-[11px] tracking-[0.14em] uppercase text-foreground-faint pb-3.5">
            Profile
          </span>
        </div>

        <p className="text-foreground-faint text-sm">No orders yet.</p>
      </div>
      <Footer />
    </Container>
  );
}