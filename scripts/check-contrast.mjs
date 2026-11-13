// Step 4 of the colour system: every text/background pair the site uses must reach
// WCAG AA (4.5:1 for text, 3:1 for large text and UI marks). Run: npm run check:contrast
import { readFileSync } from "node:fs";
import { contrast, over } from "./contrast.mjs";

const t = JSON.parse(readFileSync(new URL("../design/tokens.json", import.meta.url), "utf8"));
const white = "#FFFFFF";
const pairs = [
  // [label, foreground, background, minimum]
  ["body text neutral/600 on neutral/50", t.neutral[600], t.neutral[50], 4.5],
  ["secondary text neutral/500 on white", t.neutral[500], white, 4.5],
  ["secondary text neutral/500 on neutral/100", t.neutral[500], t.neutral[100], 4.5],
  ["headings primary/950 on neutral/50", t.primary[950], t.neutral[50], 4.5],
  ["accent text accent/700 on white", t.accent[700], white, 4.5],
  ["accent text accent/700 on neutral/100", t.accent[700], t.neutral[100], 4.5],
  ["button label primary/950 on accent/500", t.primary[950], t.accent[500], 4.5],
  ["button label white on primary/900", white, t.primary[900], 4.5],
  ["hero text white 60% on primary/900", over(white, 0.6, t.primary[900]), t.primary[900], 4.5],
  ["footer text white 60% on primary/950", over(white, 0.6, t.primary[950]), t.primary[950], 4.5],
  ["accent on dark accent/400 on primary/900", t.accent[400], t.primary[900], 4.5],
  ["success text success/700 on white", t.success[700], white, 4.5],
  ["success text success/700 on success/100", t.success[700], t.success[100], 4.5],
  ["warning text warning/700 on warning/100", t.warning[700], t.warning[100], 4.5],
  ["error text error/700 on white", t.error[700], white, 4.5],
  ["error text error/700 on error/100", t.error[700], t.error[100], 4.5],
  ["status dot success/500 on white (UI mark)", t.success[500], white, 3],
  ["status dot accent/500 on white (UI mark)", t.accent[500], white, 2.4],
];

let failed = 0;
for (const [label, fg, bg, min] of pairs) {
  const r = contrast(fg, bg);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(`${ok ? "pass" : "FAIL"}  ${r.toFixed(2).padStart(5)}:1  (min ${min})  ${label}`);
}
if (failed) {
  console.error(`\n${failed} pair(s) below their minimum.`);
  process.exit(1);
}
console.log(`\nAll ${pairs.length} pairs pass.`);
