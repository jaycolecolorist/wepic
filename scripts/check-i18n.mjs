// Verifies en.json and ar.json have exactly the same keys (and list lengths). Run: npm run check:i18n
import { readFileSync } from "node:fs";
const load = (l) => JSON.parse(readFileSync(new URL(`../locales/${l}.json`, import.meta.url), "utf8"));
const en = load("en"), ar = load("ar");
const problems = [];
function walk(a, b, path) {
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) return problems.push(`${path}: array in en, not in ar`);
    if (a.length !== b.length) problems.push(`${path}: ${a.length} items in en, ${b.length} in ar`);
    return;
  }
  if (a && typeof a === "object") {
    for (const k of Object.keys(a)) if (!(k in b)) problems.push(`${path}.${k}: missing in ar`); else walk(a[k], b[k], `${path}.${k}`);
    for (const k of Object.keys(b)) if (!(k in a)) problems.push(`${path}.${k}: missing in en`);
    return;
  }
  if (typeof b !== "string" || !b.trim()) problems.push(`${path}: empty in ar`);
}
walk(en, ar, "root");
if (problems.length) { console.error("Translation problems:\n" + problems.join("\n")); process.exit(1); }
console.log("✓ en.json and ar.json match");
