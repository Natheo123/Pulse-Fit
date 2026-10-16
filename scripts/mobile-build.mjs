/**
 * Build statique pour Capacitor.
 * Les Route Handlers (/api) ne sont pas supportés en `output: 'export'`.
 * On les copie hors de `src/app` le temps du build.
 */
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

const apiDir = path.join("src", "app", "api");
const bakDir = path.join(".mobile-stash", "api");

function stashApi() {
  if (!fs.existsSync(apiDir)) return false;
  fs.mkdirSync(path.dirname(bakDir), { recursive: true });
  if (fs.existsSync(bakDir)) fs.rmSync(bakDir, { recursive: true, force: true });
  fs.cpSync(apiDir, bakDir, { recursive: true });
  fs.rmSync(apiDir, { recursive: true, force: true });
  return true;
}

function restoreApi() {
  if (!fs.existsSync(bakDir)) return;
  if (fs.existsSync(apiDir)) fs.rmSync(apiDir, { recursive: true, force: true });
  fs.cpSync(bakDir, apiDir, { recursive: true });
  fs.rmSync(path.join(".mobile-stash"), { recursive: true, force: true });
}

// Nettoyage éventuel d’un ancien stash dans app/
const badBak = path.join("src", "app", ".api-bak-mobile");
if (fs.existsSync(badBak)) {
  if (!fs.existsSync(apiDir)) fs.cpSync(badBak, apiDir, { recursive: true });
  fs.rmSync(badBak, { recursive: true, force: true });
}

const moved = stashApi();

const nextDir = path.join(".next");
if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, { recursive: true, force: true });
}

try {
  const env = { ...process.env, MOBILE_BUILD: "1" };
  const r = spawnSync(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["next", "build"],
    { stdio: "inherit", env, shell: process.platform === "win32" }
  );
  if (r.status !== 0) process.exit(r.status ?? 1);
} finally {
  if (moved) restoreApi();
}

console.log("Mobile static export ready in /out");
