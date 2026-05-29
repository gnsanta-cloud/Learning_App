/**
 * Gemini MD 생성 → JSON import 파이프라인
 *
 * Usage:
 *   npm run gemini:sync -- ethics
 *   npm run gemini:sync -- tech-home
 *   npm run gemini:sync -- all
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const TARGETS = {
  ethics: {
    generateArgs: ["ethics"],
    importScript: "import-gemini-ethics.mjs",
    md: "docs/gemini-code-1780040427395.md",
  },
  "tech-home": {
    generateArgs: ["tech-home"],
    importScript: "import-gemini-md.mjs",
    md: "docs/gemini-code-1780039929126.md",
  },
};

function backupMd(relPath) {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) return;
  const bak = abs.replace(/\.md$/, `.bak-${Date.now()}.md`);
  fs.copyFileSync(abs, bak);
  console.log(`백업: ${path.relative(ROOT, bak)}`);
}

function runNode(script, args = []) {
  const r = spawnSync(process.execPath, [path.join(__dirname, script), ...args], {
    cwd: ROOT,
    stdio: "inherit",
    env: process.env,
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

async function syncOne(key) {
  const t = TARGETS[key];
  console.log(`\n=== ${key} ===\n`);
  backupMd(t.md);
  runNode("gemini-generate-md.mjs", t.generateArgs);
  runNode(t.importScript);
  console.log(`\n✓ ${key} 동기화 완료\n`);
}

const target = process.argv[2] ?? "all";

if (target === "all") {
  for (const key of Object.keys(TARGETS)) {
    await syncOne(key);
  }
} else if (TARGETS[target]) {
  await syncOne(target);
} else {
  console.error("Usage: npm run gemini:sync -- [ethics|tech-home|all]");
  process.exit(1);
}
