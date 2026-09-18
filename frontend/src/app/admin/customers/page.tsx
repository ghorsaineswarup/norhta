"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";

type Customer = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
};

export default function AdminCustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/admin/customers")
      .then((res) => {
        if (res.status === 403) return router.push("/");
        if (res.status === 401) return router.push("/login");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setCustomers(data);
      })
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="min-h-screen grid grid-cols-[220px_1fr]">
      <AdminSidebar />

      <main className="p-10">
        <h1 className="font-[family-name:var(--font-display)] text-2xl mb-8">Customers</h1>

        {loading ? (
          <p className="text-foreground-faint">Loading...</p>
        ) : customers.length === 0 ? (
          <p className="text-foreground-faint">No customers yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] tracking-[0.12em] uppercase text-foreground-faint border-b border-border">
                <th className="pb-3">Name</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Phone</th>
                <th className="pb-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id} className="border-b border-border text-foreground-dim">
                  <td className="py-3">{c.name}</td>
                  <td className="py-3">{c.email}</td>
                  <td className="py-3">{c.phone || "—"}</td>
                  <td className="py-3">{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}