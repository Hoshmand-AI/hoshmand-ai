"use client";

import { useEffect } from "react";

// Registers the Saraf service worker so the app is installable on phone and
// desktop. Scoped to /saraf so it never affects the rest of the site.
export default function PwaRegister() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return; // avoid caching during dev
    navigator.serviceWorker.register("/saraf-sw.js", { scope: "/saraf" }).catch(() => {});
  }, []);
  return null;
}
