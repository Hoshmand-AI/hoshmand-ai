"use client";

import { useState } from "react";

export default function ProjectNotifyForm({ slug }: { slug: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setState("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, project: slug }),
      });
      const data = await res.json();
      setState(data.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="text-[12px] font-medium text-[#3D8B6E]">
        ✓ You're on the list — we'll email you when it's ready.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 min-w-0 rounded-md border border-warm-300 bg-warm-50 px-3 py-2 text-[13px] text-navy-950 placeholder:text-warm-400 focus:border-navy-700 focus:outline-none transition-colors"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="shrink-0 rounded-md bg-navy-900 px-4 py-2 text-[12px] font-semibold text-white hover:bg-navy-800 transition-colors duration-150 disabled:opacity-50"
      >
        {state === "loading" ? "..." : "Notify me"}
      </button>
      {state === "error" && (
        <p className="text-[11px] text-[#B85C5C] mt-1">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
