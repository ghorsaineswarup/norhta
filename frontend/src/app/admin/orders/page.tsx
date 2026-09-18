"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";

type Order = {
  _id: string;
  user: { name: string; email: string };
  total: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
};

const STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    setLoading(true);
    const res = await apiFetch("/admin/orders");
    if (res.status === 403) return router.push("/");
    if (res.status === 401) return router.push("/login");
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(id: string, orderStatus: string) {
    await apiFetch(`/admin/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ orderStatus }),
    });
    loadOrders();
  }

  return (
    <div className="min-h-screen grid grid-cols-[220px_1fr]">
      <AdminSidebar />

      <main className="p-10">
        <h1 className="font-[family-name:var(--font-display)] text-2xl mb-8">Orders</h1>

        {loading ? (
          <p className="text-foreground-faint">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-foreground-faint">No orders yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] tracking-[0.12em] uppercase text-foreground-faint border-b border-border">
                <th className="pb-3">Order</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-border text-foreground-dim">
                  <td className="py-3">#{order._id.slice(-8).toUpperCase()}</td>
                  <td className="py-3">{order.user?.name || "—"}</td>
                  <td className="py-3">NPR {order.total.toLocaleString()}</td>
                  <td className="py-3 capitalize">{order.paymentStatus}</td>
                  <td className="py-3">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="bg-transparent border border-border-strong rounded-md px-2 py-1.5 text-xs capitalize"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s} className="bg-background capitalize">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}