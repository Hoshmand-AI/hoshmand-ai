// Brand wordmark: bold DM Sans first part + gold DM Serif Display second part.
export const WORDMARK_SPLIT: Record<string, [string, string]> = {
  mindcue: ["MindCue", " AI"],
  care360: ["Care", "360"],
  mailhandled: ["Mail", "Handled"],
  safeclaw: ["Safe", "Claw"],
  planora: ["Plan", "ora"],
};

export default function Wordmark({ slug, name, className = "", tone = "dark" }: { slug: string; name: string; className?: string; tone?: "light" | "dark" }) {
  const [first, second] = WORDMARK_SPLIT[slug] ?? [name, ""];
  return (
    <span className={`whitespace-nowrap leading-none tracking-tight ${className}`}>
      <span className="font-bold">{first}</span>
      <span className={`font-serif font-normal ${tone === "dark" ? "text-gold-400" : "text-gold-500"}`}>{second}</span>
    </span>
  );
}
