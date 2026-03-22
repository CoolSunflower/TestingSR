import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const distDir = resolve("dist", "spa");
const indexPath = resolve(distDir, "index.html");
const fallbackPath = resolve(distDir, "404.html");

if (!existsSync(indexPath)) {
  throw new Error(`Missing ${indexPath}. Run the pages build first.`);
}

copyFileSync(indexPath, fallbackPath);
console.log("Created GitHub Pages SPA fallback: dist/spa/404.html");
