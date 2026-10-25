// Lists the Pagefind index chunks and fragments so the search dialog can warm the
// browser cache with all of them on first use; search then keeps working offline.
// Runs after `pagefind` in the postbuild step.
import { readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve("out/pagefind");
const files = ["index", "fragment"].flatMap((dir) =>
  readdirSync(path.join(root, dir)).map((name) => `/pagefind/${dir}/${name}`),
);
writeFileSync(path.join(root, "manifest.json"), JSON.stringify(files));
console.log(`pagefind manifest: ${files.length} files`);
