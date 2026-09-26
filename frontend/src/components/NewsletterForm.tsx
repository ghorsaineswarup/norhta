"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { apiFetch } from "@/lib/api";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await apiFetch("/newsletter/subscribe", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        setStatus("error");
        return;
      }

      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return <p className="text-accent text-sm">Thanks for subscribing.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full md:w-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="bg-transparent border border-border-strong rounded-full px-5 py-3.5 text-sm flex-1 md:w-64 focus:outline-none focus:border-accent"
      />
      <Button type="submit" variant="primary" disabled={status === "loading"}>
        {status === "loading" ? "..." : "Join"}
      </Button>
      {status === "error" && (
        <p className="text-accent text-xs absolute mt-14">Something went wrong.</p>
      )}
    </form>
  );
}