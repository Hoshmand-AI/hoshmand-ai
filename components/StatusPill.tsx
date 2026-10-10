type Status = "shipping" | "in-development";

export default function StatusPill({ status, tone = "light" }: { status: Status; tone?: "light" | "dark" }) {
  const shipping = status === "shipping";
  const color = shipping ? "#3D8B6E" : "#B8862E";
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.08em]"
      style={{
        borderColor: shipping ? "rgba(61,139,110,0.25)" : "rgba(200,150,62,0.3)",
        backgroundColor: shipping ? "rgba(61,139,110,0.08)" : "rgba(200,150,62,0.08)",
        color: tone === "dark" && !shipping ? "#D4A94F" : color,
      }}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ backgroundColor: color }} />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      </span>
      {shipping ? "Shipping" : "In Development"}
    </span>
  );
}
