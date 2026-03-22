import { execSync } from "node:child_process";
import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const repoFromEnv = process.env.GITHUB_REPOSITORY?.split("/")[1];
const repoName = repoFromEnv || "TestingSR";
const basePath = `/${repoName}/`;

console.log(`Building GitHub Pages bundle with base: ${basePath}`);
execSync(`npx vite build --base=${basePath}`, { stdio: "inherit" });

const distDir = resolve("dist", "spa");
const indexPath = resolve(distDir, "index.html");
const fallbackPath = resolve(distDir, "404.html");

if (!existsSync(indexPath)) {
  throw new Error(`Missing ${indexPath}. Build failed or output path changed.`);
}

copyFileSync(indexPath, fallbackPath);
console.log("Created SPA fallback: dist/spa/404.html");
