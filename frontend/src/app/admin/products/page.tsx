"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";
import Button from "@/components/Button";
import Input from "@/components/Input";

type Category = { _id: string; name: string };
type Product = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  active: boolean;
  featured: boolean;
  category?: { _id: string; name: string };
};

const emptyForm = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  featured: false,
};

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  async function loadProducts() {
    setLoading(true);
    const res = await apiFetch("/admin/products");
    if (res.status === 403) return router.push("/");
    if (res.status === 401) return router.push("/login");
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
    apiFetch("/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  function openCreateForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setShowForm(true);
  }

  function openEditForm(p: Product) {
    setForm({
      name: p.name,
      slug: p.slug,
      shortDescription: "",
      description: "",
      price: String(p.price),
      stock: String(p.stock),
      category: p.category?._id || "",
      featured: p.featured,
    });
    setEditingId(p._id);
    setError("");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const payload = {
      name: form.name,
      slug: form.slug,
      shortDescription: form.shortDescription,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category,
      featured: form.featured,
    };

    const res = editingId
      ? await apiFetch(`/admin/products/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        })
      : await apiFetch("/admin/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });

    if (!res.ok) {
      const data = await res.json();
      setError(data.message || "Could not save product");
      return;
    }

    setShowForm(false);
    loadProducts();
  }

  async function handleDelete(id: string) {
    if (!confirm("Deactivate this product?")) return;
    await apiFetch(`/admin/products/${id}`, { method: "DELETE" });
    loadProducts();
  }

  return (
    <div className="min-h-screen grid grid-cols-[220px_1fr]">
      <AdminSidebar />

      <main className="p-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-[family-name:var(--font-display)] text-2xl">Products</h1>
          <Button variant="primary" onClick={openCreateForm}>
            Add product
          </Button>
        </div>

        {showForm && (
          <div className="bg-card border border-border rounded-lg p-6 mb-8 max-w-lg">
            <h2 className="font-[family-name:var(--font-display)] text-sm mb-4">
              {editingId ? "Edit product" : "New product"}
            </h2>
            <form onSubmit={handleSubmit}>
              <Input
                label="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="Slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                required
              />
              <Input
                label="Short description"
                value={form.shortDescription}
                onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              />
              <Input
                label="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price (NPR)"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
                <Input
                  label="Stock"
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-[family-name:var(--font-display)] text-[11px] tracking-[0.1em] uppercase text-foreground-faint mb-2">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                  className="w-full bg-transparent border border-border-strong rounded-md px-4 py-3.5 text-sm"
                >
                  <option value="" className="bg-background">
                    Select category
                  </option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id} className="bg-background">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2.5 text-sm mb-5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                />
                Featured
              </label>

              {error && <p className="text-accent text-sm mb-4">{error}</p>}

              <div className="flex gap-3">
                <Button variant="primary">{editingId ? "Save changes" : "Create product"}</Button>
                <Button variant="ghost" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <p className="text-foreground-faint">Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] tracking-[0.12em] uppercase text-foreground-faint border-b border-border">
                <th className="pb-3">Name</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Stock</th>
                <th className="pb-3">Status</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-border text-foreground-dim">
                  <td className="py-3">{p.name}</td>
                  <td className="py-3">{p.category?.name || "—"}</td>
                  <td className="py-3">NPR {p.price.toLocaleString()}</td>
                  <td className="py-3">
  {p.stock}{" "}
  <span
    className={
      p.stock === 0
        ? "text-accent text-xs"
        : p.stock < 5
        ? "text-orange-400 text-xs"
        : "text-foreground-faint text-xs"
    }
  >
    ({p.stock === 0 ? "Out of stock" : p.stock < 5 ? "Low stock" : "In stock"})
  </span>
</td>
                  <td className="py-3">
                    <span className={p.active ? "text-accent" : "text-foreground-faint"}>
                      {p.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => openEditForm(p)}
                      className="text-xs text-foreground-faint hover:text-foreground mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-xs text-foreground-faint hover:text-accent"
                    >
                      Deactivate
                    </button>
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