"use client";

import { useState, FormEvent } from "react";

interface WaitlistFormProps {
  className?: string;
}

export default function WaitlistForm({ className = "" }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setState("loading");
    setMessage("");

    // Use env var or fallback to API route
    const actionUrl =
      process.env.NEXT_PUBLIC_WAITLIST_ACTION || "/api/waitlist";

    try {
      const res = await fetch(actionUrl, {
        method: "POST",
        headers: actionUrl.startsWith("/api")
          ? { "Content-Type": "application/json" }
          : { "Content-Type": "application/x-www-form-urlencoded" },
        body: actionUrl.startsWith("/api")
          ? JSON.stringify({ email })
          : new URLSearchParams({ email }).toString(),
      });

      if (!res.ok) throw new Error("Request failed");

      setState("success");
      setMessage("Thanks — you'll hear from us when MindCue launches.");
      setEmail("");
    } catch {
      setState("error");
      setMessage(
        "Something went wrong. Please try again or email support@hoshmand.ai."
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="input flex-1"
          disabled={state === "loading"}
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="btn-primary shrink-0"
        >
          {state === "loading" ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Joining...
            </>
          ) : (
            "Notify me"
          )}
        </button>
      </div>

      <p className="mt-3 text-[12px] text-warm-400">
        No spam. Just a single email when we launch.
      </p>

      {message && (
        <p
          className={`mt-4 text-sm ${
            state === "success" ? "text-[#3D8B6E]" : "text-[#B85C5C]"
          }`}
          role="alert"
        >
          {message}
        </p>
      )}
    </form>
  );
}
