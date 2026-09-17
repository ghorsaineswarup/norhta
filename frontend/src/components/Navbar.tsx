"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { apiFetch } from "@/lib/api";

export default function Navbar() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const { itemCount, refreshCart } = useCart();

  useEffect(() => {
    apiFetch("/auth/me")
      .then((res) => setLoggedIn(res.ok))
      .catch(() => setLoggedIn(false));
  }, []);

  async function handleLogout() {
    await apiFetch("/auth/logout", { method: "POST" });
    setLoggedIn(false);
    await refreshCart();
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="flex justify-between items-center py-6 border-b border-border">
      <Link
        href="/"
        className="font-[family-name:var(--font-display)] font-bold text-xl tracking-[0.22em]"
      >
        NORHTA
      </Link>

      <ul className="hidden md:flex gap-8 list-none">
        <li>
          <Link
            href="/shop"
            className="font-[family-name:var(--font-display)] text-[11px] tracking-[0.16em] uppercase text-foreground-dim hover:text-foreground transition-colors"
          >
            Shop
          </Link>
        </li>
        <li>
          <Link
            href="/journal"
            className="font-[family-name:var(--font-display)] text-[11px] tracking-[0.16em] uppercase text-foreground-dim hover:text-foreground transition-colors"
          >
            Journal
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="font-[family-name:var(--font-display)] text-[11px] tracking-[0.16em] uppercase text-foreground-dim hover:text-foreground transition-colors"
          >
            About
          </Link>
        </li>
      </ul>

      <div className="flex gap-5 items-center text-[11px] tracking-[0.1em] text-foreground-dim">
        <span>Search</span>
        {loggedIn ? (
          <>
            <Link href="/account" className="hover:text-foreground transition-colors">
              Account
            </Link>
            <button onClick={handleLogout} className="hover:text-foreground transition-colors">
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="hover:text-foreground transition-colors">
            Login
          </Link>
        )}
        <Link href="/cart" className="hover:text-foreground transition-colors">
          Cart ({itemCount})
        </Link>
      </div>
    </nav>
  );
}