#!/usr/bin/env node
/* =====================================================================
   VORSCHAU AUF GITHUB PAGES VERÖFFENTLICHEN.

   GitHub Pages liest hier den Branch gh-pages. Auf dem liegt nichts von
   Hand Gepflegtes: nur das, was tools/build-pages-preview.mjs aus public/
   baut. Deshalb wird er bei jeder Veröffentlichung neu geschrieben.

   Warum nicht über GitHub Actions, wo das von allein liefe: dem Token im
   Schlüsselbund fehlt die Erlaubnis "workflow", es darf also keine Datei
   unter .github/workflows/ ablegen. Sobald das Token sie hat, wäre ein
   Arbeitsablauf der bessere Weg -- dann veraltet die Vorschau nicht.

   Bis dahin gilt: nach Änderungen an public/ dieses Skript noch einmal
   laufen lassen, sonst zeigt die geteilte Adresse den alten Stand.

     node tools/publish-pages.mjs            bauen und hochladen
     node tools/publish-pages.mjs --dry-run  nur bauen und zeigen, was käme
   ===================================================================== */

import { execFileSync } from "node:child_process";
import { cpSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = join(ROOT, "_site");
const BRANCH = "gh-pages";
const DRY = process.argv.includes("--dry-run");

const run = (cmd, args, cwd = ROOT) =>
  execFileSync(cmd, args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] }).trim();

/* ---------- 1. bauen ---------- */
console.log(run("node", ["tools/build-pages-preview.mjs", "_site"]));

/* ---------- 2. woraus gebaut wurde ---------- */
const sha = run("git", ["rev-parse", "--short", "HEAD"]);
const subject = run("git", ["log", "-1", "--format=%s"]);
const dirty = run("git", ["status", "--porcelain", "--", "public"]);
if (dirty) console.log("Hinweis: public/ hat ungespeicherte Änderungen -- die sind mit in der Vorschau.");

/* ---------- 3. auf den Branch legen ---------- */
const work = mkdtempSync(join(tmpdir(), "pages-"));
const exists = run("git", ["branch", "--list", BRANCH]) !== "";
try {
  // Ein eigener Arbeitsordner, damit der eigentliche nicht angefasst wird.
  run("git", exists ? ["worktree", "add", "--force", work, BRANCH] : ["worktree", "add", "--orphan", "-B", BRANCH, work]);

  // Alles Alte weg: gelöschte Seiten sollen auch dort verschwinden.
  for (const name of readdirSync(work)) {
    if (name !== ".git") rmSync(join(work, name), { recursive: true, force: true });
  }
  cpSync(SITE, work, { recursive: true });

  // -f, weil die Vorschau Dateien mit Punkt und Unterstrich enthält.
  run("git", ["add", "-A", "-f", "."], work);
  const staged = run("git", ["diff", "--cached", "--numstat"], work);
  if (!staged) {
    console.log(`${BRANCH}: unverändert, nichts zu tun`);
  } else {
    run("git", ["commit", "-m", `Vorschau aus ${sha} (${subject})`], work);
    const files = staged.split("\n").length;
    if (DRY) {
      console.log(`--dry-run: ${files} Dateien bereit auf ${BRANCH}, nicht gepusht`);
    } else {
      run("git", ["push", "--force", "origin", `${BRANCH}:${BRANCH}`], work);
      console.log(`${BRANCH}: ${files} Dateien gepusht`);
    }
  }
} finally {
  run("git", ["worktree", "remove", "--force", work]);
  rmSync(work, { recursive: true, force: true });
  rmSync(SITE, { recursive: true, force: true });
}
