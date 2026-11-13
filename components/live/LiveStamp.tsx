"use client";

import { useEffect, useState } from "react";

// "Live from runf9 · checked 40 seconds ago". The time ticks on the visitor's screen; the page
// itself is re-rendered from the product's card about every 30 seconds (lib/live.ts).
function ago(iso: string, now: number): string {
  const s = Math.max(0, Math.round((now - Date.parse(iso)) / 1000));
  if (s < 10) return "just now";
  if (s < 60) return `${s} seconds ago`;
  const m = Math.round(s / 60);
  if (m < 60) return m === 1 ? "a minute ago" : `${m} minutes ago`;
  const h = Math.round(m / 60);
  if (h < 24) return h === 1 ? "an hour ago" : `${h} hours ago`;
  const d = Math.round(h / 24);
  return d === 1 ? "yesterday" : `${d} days ago`;
}

export default function LiveStamp({
  syncedAt,
  source,
  tone = "light",
  className = "",
}: {
  syncedAt?: string;
  source: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(t);
  }, []);
  if (!syncedAt) return null;
  const dark = tone === "dark";
  return (
    <span
      className={`inline-flex items-center gap-2 text-[12px] font-medium ${dark ? "text-white/70" : "text-warm-600"} ${className}`}
      title={`Read from ${source}`}
    >
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-500 opacity-50 motion-reduce:hidden" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-success-500" />
      </span>
      <span>
        Live from {source}
        {now !== null && <> · checked {ago(syncedAt, now)}</>}
      </span>
    </span>
  );
}
