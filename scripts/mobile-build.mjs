/**
 * Build statique pour Capacitor (output: export).
 */
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

const nextDir = path.join(".next");
if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, { recursive: true, force: true });
}

const env = { ...process.env, MOBILE_BUILD: "1" };
const r = spawnSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["next", "build"],
  { stdio: "inherit", env, shell: process.platform === "win32" }
);
if (r.status !== 0) process.exit(r.status ?? 1);

console.log("Mobile static export ready in /out");
