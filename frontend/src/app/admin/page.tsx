"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";

type Stats = {
  totalRevenue: number;
  orderCount: number;
  customerCount: number;
  productCount: number;
  recentOrders: {
    _id: string;
    user: { name: string; email: string };
    total: number;
    orderStatus: string;
    createdAt: string;
  }[];
};

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiFetch("/admin/stats")
      .then((res) => {
        if (res.status === 403) {
          router.push("/");
          return null;
        }
        if (res.status === 401) {
          router.push("/login");
          return null;
        }
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (data) setStats(data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return <div className="p-10 text-foreground-faint">Loading...</div>;
  }

  if (error || !stats) {
    return <div className="p-10 text-foreground-faint">Could not load dashboard.</div>;
  }

  return (
    <div className="min-h-screen grid grid-cols-[220px_1fr]">
      <AdminSidebar />

      <main className="p-10">
        <h1 className="font-[family-name:var(--font-display)] text-2xl mb-8">Dashboard</h1>

        <div className="grid grid-cols-4 gap-4 mb-10">
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="text-[10px] tracking-[0.14em] uppercase text-foreground-faint">
              Total revenue
            </div>
            <div className="font-[family-name:var(--font-display)] text-xl font-bold mt-2">
              NPR {stats.totalRevenue.toLocaleString()}
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="text-[10px] tracking-[0.14em] uppercase text-foreground-faint">
              Orders
            </div>
            <div className="font-[family-name:var(--font-display)] text-xl font-bold mt-2">
              {stats.orderCount}
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="text-[10px] tracking-[0.14em] uppercase text-foreground-faint">
              Customers
            </div>
            <div className="font-[family-name:var(--font-display)] text-xl font-bold mt-2">
              {stats.customerCount}
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="text-[10px] tracking-[0.14em] uppercase text-foreground-faint">
              Products
            </div>
            <div className="font-[family-name:var(--font-display)] text-xl font-bold mt-2">
              {stats.productCount}
            </div>
          </div>
        </div>

        <div className="text-[11px] tracking-[0.16em] uppercase text-foreground-faint mb-4">
          Recent orders
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] tracking-[0.12em] uppercase text-foreground-faint border-b border-border">
              <th className="pb-3">Order</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Total</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentOrders.map((order) => (
              <tr key={order._id} className="border-b border-border text-foreground-dim">
                <td className="py-3">#{order._id.slice(-8).toUpperCase()}</td>
                <td className="py-3">{order.user?.name || "—"}</td>
                <td className="py-3">NPR {order.total.toLocaleString()}</td>
                <td className="py-3 text-accent">{order.orderStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}