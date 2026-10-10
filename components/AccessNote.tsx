// Small lock label for products whose web app is open by invitation only.
export default function AccessNote({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[12px] font-medium ${tone === "dark" ? "text-white/55" : "text-warm-500"}`}
    >
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
      Invite-only beta
    </span>
  );
}
