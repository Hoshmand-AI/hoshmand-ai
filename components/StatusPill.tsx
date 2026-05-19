type Status = "shipping" | "in-development";

export default function StatusPill({ status }: { status: Status }) {
  if (status === "shipping") {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider"
        style={{
          borderColor: "rgba(61,139,110,0.2)",
          backgroundColor: "rgba(61,139,110,0.08)",
          color: "#3D8B6E",
        }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#3D8B6E]" />
        Shipping
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider"
      style={{
        borderColor: "rgba(200,150,62,0.25)",
        backgroundColor: "rgba(200,150,62,0.07)",
        color: "#B8862E",
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full bg-[#C8963E] animate-pulse"
        style={{ animationDuration: "2s" }}
      />
      In Development
    </span>
  );
}
