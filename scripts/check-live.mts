import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Checks the live product layer (lib/live.ts) and the guide against sample product cards.
// Run: npm run check:live
import { parseCard, applyCard } from "../lib/live";
import { projects } from "../lib/projects";
import { reply, siteFacts, actionCatalogue } from "../lib/guide";
import { splitWordmark } from "../components/Wordmark";
const fixture = (f: string) => JSON.parse(readFileSync(fileURLToPath(new URL(`./fixtures/${f}`, import.meta.url)), "utf8"));
const ok = (c: boolean, m: string) => { if (!c) { console.error("FAIL", m); process.exitCode = 1; } else console.log("ok  ", m); };
const runf9 = parseCard(fixture("runf9-card.json"), "https://planora-chi.vercel.app/api/product")!;
const mh = parseCard(fixture("mailhandled-card.json"), "https://mailhandled.ai/api/product")!;
ok(!!runf9 && runf9.logo?.mark === "https://planora-chi.vercel.app/brand/runf9-mark.svg", "RunF9 card parses, logo resolved on its own origin");
ok(!!mh && mh.logo?.mark === "https://mailhandled.ai/mark.svg", "MailHandled card parses");
ok(parseCard({ schema: "hoshmand.product/1", name: "<b>x</b>" }, "https://a.example/p") === null, "a name with markup is refused");
ok(parseCard({ schema: "other", name: "X" }, "https://a.example/p") === null, "an unknown schema is refused");
const bad = parseCard({ schema: "hoshmand.product/1", name: "X", logo: { mark: "https://evil.example/a.svg" }, url: "http://x.example" }, "https://a.example/p")!;
ok(!bad.logo && !bad.url, "off-origin logo and non-https url are dropped");
const live = projects.map((p) => p.slug === "runf9" ? applyCard(p, { ...runf9, name: "RunF10", formerNames: ["RunF9", "Planora"] }, new Date().toISOString()) : p.slug === "mailhandled" ? applyCard(p, mh, new Date().toISOString()) : p);
const r = live.find((p) => p.slug === "runf9")!;
ok(r.name === "RunF10" && r.approach.includes("RunF10") && !/\bRunF9\b/.test(r.approach), "a rename reaches the studio's own paragraphs");
ok(reply("is planora ready?", live).text.startsWith("Planora is now called RunF10."), "a question about the old name is answered with the new one");
ok(reply("help with my construction schedule", live).actions.some((a) => a.label === "Open RunF10"), "need → product uses the live name");
ok(siteFacts(live).includes("RunF10 (formerly RunF9, Planora)") && siteFacts(live).includes("Recent updates"), "the AI guide's facts carry the new name and updates");
ok(actionCatalogue(live)["open:runf9"]?.label === "Open RunF10", "action buttons use the live name");
ok(splitWordmark("RunF9").join("|") === "Run|F9" && splitWordmark("MailHandled").join("|") === "Mail|Handled" && splitWordmark("SafeClaw").join("|") === "Safe|Claw", "wordmarks split from any name");
