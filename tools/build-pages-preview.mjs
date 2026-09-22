#!/usr/bin/env node
/* =====================================================================
   VORSCHAU FÜR GITHUB PAGES.

   Netlify liefert public/ als Wurzel aus, GitHub Pages liefert ein
   Projekt-Repository aber unter einem Präfix aus:
   https://kuscu-hd.github.io/yazar/ . Im HTML stehen wurzelabsolute Pfade
   (/styles.css, /assets/..., /hizmetlerimiz) -- die landen dort eine Ebene
   zu hoch und die Seite käme ohne Gestaltung.

   Dieses Skript schreibt deshalb eine KOPIE von public/ mit dem Präfix
   davor. public/ selbst bleibt unangetastet: die echte Seite auf Netlify
   soll nichts davon merken.

   Außerdem in der Kopie:
     - noindex auf jeder Seite und robots.txt mit Disallow -- die Vorschau
       soll nicht in die Suche geraten und der echten Seite nicht ins
       Gehege kommen.
     - _redirects und _headers fallen weg: das versteht Pages nicht.
     - sitemap.xml fällt weg: sie nennt die Adressen der echten Seite.
     - .nojekyll, sonst schluckt Jekyll Dateien mit Unterstrich.

   Was die Vorschau NICHT kann: die Formulare (es gibt dort keinen
   Empfänger, ein Absenden endet in einer Fehlerseite) und alle
   Weiterleitungen aus _redirects.

     node tools/build-pages-preview.mjs _site           Präfix aus dem Repo-Namen
     node tools/build-pages-preview.mjs _site /yazar    Präfix von Hand
   ===================================================================== */

import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "public");
const OUT = join(ROOT, process.argv[2] || "_site");

// In der Werkstatt von GitHub steht der Repo-Name in der Umgebung.
const repo = (process.env.GITHUB_REPOSITORY || "").split("/")[1];
const BASE = (process.argv[3] || (repo ? `/${repo}` : "/yazar")).replace(/\/$/, "");

const SKIP = new Set(["_redirects", "_headers", "sitemap.xml"]);

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

/* Pfade, die mit einem einzelnen "/" beginnen, bekommen das Präfix.
   "//host" und "https://..." bleiben, wie sie sind. */
const prefixPaths = (text) =>
  text
    .replace(/\b(href|src|action)="\/(?!\/)/g, `$1="${BASE}/`)
    .replace(/url\("\/(?!\/)/g, `url("${BASE}/`)
    // script.js setzt den Logopfad als CSS-Variable
    .replace(/"\/assets\//g, `"${BASE}/assets/`);

const NOINDEX = '<meta name="robots" content="noindex" />';

function convert(file, rel) {
  const target = join(OUT, rel);
  mkdirSync(dirname(target), { recursive: true });
  if (/\.(html|js|css|txt)$/.test(rel)) {
    let text = readFileSync(file, "utf8");
    text = prefixPaths(text);
    if (rel.endsWith(".html") && !text.includes('name="robots"')) {
      // Direkt hinter die Zeichensatzangabe, die jede Seite hat.
      text = text.replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />\n    ${NOINDEX}`);
    }
    writeFileSync(target, text);
    return;
  }
  cpSync(file, target);
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const rel = relative(SRC, path);
    if (SKIP.has(rel)) continue;
    if (statSync(path).isDirectory()) walk(path);
    else convert(path, rel);
  }
}
walk(SRC);

// Die Vorschau bittet Suchmaschinen, sie ganz zu lassen.
writeFileSync(join(OUT, "robots.txt"), "User-agent: *\nDisallow: /\n");
writeFileSync(join(OUT, ".nojekyll"), "");

const pages = readdirSync(OUT).filter((f) => f.endsWith(".html")).length;
console.log(`Vorschau in ${relative(ROOT, OUT)} mit Präfix ${BASE}: ${pages} Seiten im Wurzelordner, robots.txt auf Disallow`);
