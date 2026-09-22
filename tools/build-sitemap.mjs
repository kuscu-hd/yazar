#!/usr/bin/env node
/* =====================================================================
   SITEMAP.XML aus dem Seitenregister (tools/pages.mjs).

   Drin steht jede Seite in genau der Form, die auch ihr canonical nennt:
   ohne Endung, /de/ mit Schrägstrich, absolut auf yazardandirekt.com.
   Draußen bleiben Seiten mit noindex (Dankeseiten) und die 404-Seite --
   was nicht in die Suche soll, gehört auch nicht in die sitemap.

   Kein changefreq, kein priority: Suchmaschinen richten sich nicht danach.
   Kein lastmod, weil wir kein echtes Änderungsdatum je Seite führen -- ein
   erfundenes Datum ist schlechter als keins.

   hreflang steht in den Seiten selbst und wird hier nicht wiederholt.

     node tools/build-sitemap.mjs           schreibt sitemap.xml
     node tools/build-sitemap.mjs --check   meldet Abweichung (Exit-Code 1)
   ===================================================================== */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ORIGIN, PAGES, langsOf } from "./pages.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "sitemap.xml");
const CHECK = process.argv.includes("--check");

const urls = [];
for (const page of PAGES) {
  if (page.noindex || page.bare) continue;
  for (const lang of langsOf(page)) urls.push(ORIGIN + page[lang][1]);
}

const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map((u) => `  <url>\n    <loc>${u}</loc>\n  </url>\n`).join("") +
  "</urlset>\n";

if (CHECK) {
  const same = existsSync(OUT) && readFileSync(OUT, "utf8") === xml;
  console.log(same ? `sitemap.xml stimmt (${urls.length} Adressen)` : "sitemap.xml weicht ab");
  process.exit(same ? 0 : 1);
}
writeFileSync(OUT, xml);
console.log(`sitemap.xml geschrieben, ${urls.length} Adressen`);
