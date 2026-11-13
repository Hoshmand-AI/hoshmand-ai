// Brand wordmark: bold DM Sans first part + gold DM Serif Display second part.
// Names come live from each product's card, so the split is worked out from the name itself:
// at the last place a capital follows a lower-case letter ("MailHandled" → Mail|Handled,
// "RunF9" → Run|F9). The overrides below are only for names that rule reads wrongly.
const OVERRIDES: Record<string, [string, string]> = {
  "MindCue AI": ["MindCue", " AI"],
  Care360: ["Care", "360"],
};

export function splitWordmark(name: string): [string, string] {
  if (OVERRIDES[name]) return OVERRIDES[name];
  for (let i = name.length - 1; i > 0; i--) {
    if (/[A-Z]/.test(name[i]) && /[a-z]/.test(name[i - 1])) return [name.slice(0, i), name.slice(i)];
  }
  return [name, ""];
}

export default function Wordmark({ name, className = "", tone = "dark" }: { slug?: string; name: string; className?: string; tone?: "light" | "dark" }) {
  const [first, second] = splitWordmark(name);
  return (
    <span className={`whitespace-nowrap leading-none tracking-tight ${className}`}>
      <span className="font-bold">{first}</span>
      <span className={`font-serif font-normal ${tone === "dark" ? "text-gold-400" : "text-gold-700"}`}>{second}</span>
    </span>
  );
}
