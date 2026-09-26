"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { apiFetch } from "@/lib/api";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await apiFetch("/contact", { method: "POST", body: JSON.stringify(form) }).catch(() => {});
    setSent(true);
  }

  return (
    <Container>
      <Navbar />
      <div className="py-24 max-w-sm">
        <h1 className="font-[family-name:var(--font-display)] text-3xl mb-8">Contact</h1>
        {sent ? (
          <p className="text-accent text-sm">Thanks — we'll get back to you soon.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
            <Input label="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            <Button type="submit" variant="primary" className="w-full mt-2">Send</Button>
          </form>
        )}
      </div>
      <Footer />
    </Container>
  );
}