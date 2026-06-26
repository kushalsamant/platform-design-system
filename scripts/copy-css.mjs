import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

await mkdir(dist, { recursive: true });

for (const file of ["tokens.css", "base.css", "pages.css"]) {
  await copyFile(path.join(root, "src", file), path.join(dist, file));
}
