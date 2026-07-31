/**
 * Source-link check.
 *
 * Every registered URL is requested. Sources marked `automatedAccess: false`
 * are expected to fail here: they open normally in a browser but block
 * automated requests, and the integrity suite separately guarantees that
 * nothing rests solely on one. Any other failure is a real broken link.
 *
 * Run with:  npm run test:links
 */
import { SOURCES } from "../lib/sources";

const UA = {
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36",
  accept: "text/html,application/xhtml+xml",
};

async function main() {
 const broken: string[] = [];
const expectedBlocks: string[] = [];
const unexpectedlyOpen: string[] = [];

/** Sequential with a retry, because bursting requests triggers rate limits
 *  that look exactly like a broken link and are not one. */
 async function reachable(url: string, id: string): Promise<boolean> {
   for (let attempt = 0; attempt < 2; attempt++) {
     try {
       const r = await fetch(url, { redirect: "follow", headers: UA });
       if (r.ok) return true;
       if (attempt === 1) console.log(`      ${r.status}  ${id}  ${url}`);
     } catch (e) {
       if (attempt === 1) console.log(`      ERR  ${id}  ${(e as Error).message}`);
     }
     await new Promise((res) => setTimeout(res, 1500));
   }
   return false;
 }

 for (const s of SOURCES) {
   const ok = await reachable(s.url, s.id);
   if (s.automatedAccess && !ok) broken.push(`${s.id} -> ${s.url}`);
   if (!s.automatedAccess && !ok) expectedBlocks.push(s.id);
   if (!s.automatedAccess && ok) unexpectedlyOpen.push(s.id);
   await new Promise((res) => setTimeout(res, 120));
 }

console.log(
  `\n${SOURCES.length} sources checked. ` +
    `${broken.length} broken, ${expectedBlocks.length} blocked as declared, ` +
    `${unexpectedlyOpen.length} declared blocked but reachable.`,
);
if (unexpectedlyOpen.length > 0) {
  console.log(
    `  Note: ${unexpectedlyOpen.join(", ")} now respond. The declaration is ` +
      `conservative, not wrong, so this is not a failure.`,
  );
}
if (broken.length > 0) {
  console.log("\nBROKEN LINKS:");
  for (const b of broken) console.log("  " + b);
}
console.log(broken.length === 0 ? "\nALL LINK CHECKS PASSED" : "\nLINK CHECK FAILED");
process.exit(broken.length === 0 ? 0 : 1);
}

void main();
