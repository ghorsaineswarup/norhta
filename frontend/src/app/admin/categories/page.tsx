"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";
import Button from "@/components/Button";
import Input from "@/components/Input";

type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  active: boolean;
};

const emptyForm = { name: "", slug: "", description: "" };

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  async function loadCategories() {
    setLoading(true);
    const res = await apiFetch("/admin/categories");
    if (res.status === 403) return router.push("/");
    if (res.status === 401) return router.push("/login");
    const data = await res.json();
    setCategories(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function openCreateForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setShowForm(true);
  }

  function openEditForm(c: Category) {
    setForm({ name: c.name, slug: c.slug, description: c.description || "" });
    setEditingId(c._id);
    setError("");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = editingId
      ? await apiFetch(`/admin/categories/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        })
      : await apiFetch("/admin/categories", {
          method: "POST",
          body: JSON.stringify(form),
        });

    if (!res.ok) {
      const data = await res.json();
      setError(data.message || "Could not save category");
      return;
    }

    setShowForm(false);
    loadCategories();
  }

  async function handleDelete(id: string) {
    if (!confirm("Deactivate this category?")) return;
    await apiFetch(`/admin/categories/${id}`, { method: "DELETE" });
    loadCategories();
  }

  return (
    <div className="min-h-screen grid grid-cols-[220px_1fr]">
      <AdminSidebar />

      <main className="p-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-[family-name:var(--font-display)] text-2xl">Categories</h1>
          <Button variant="primary" onClick={openCreateForm}>
            Add category
          </Button>
        </div>

        {showForm && (
          <div className="bg-card border border-border rounded-lg p-6 mb-8 max-w-lg">
            <h2 className="font-[family-name:var(--font-display)] text-sm mb-4">
              {editingId ? "Edit category" : "New category"}
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
                label="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />

              {error && <p className="text-accent text-sm mb-4">{error}</p>}

              <div className="flex gap-3">
                <Button variant="primary">{editingId ? "Save changes" : "Create category"}</Button>
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
                <th className="pb-3">Slug</th>
                <th className="pb-3">Status</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id} className="border-b border-border text-foreground-dim">
                  <td className="py-3">{c.name}</td>
                  <td className="py-3">{c.slug}</td>
                  <td className="py-3">
                    <span className={c.active ? "text-accent" : "text-foreground-faint"}>
                      {c.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => openEditForm(c)}
                      className="text-xs text-foreground-faint hover:text-foreground mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
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