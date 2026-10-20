#!/usr/bin/env node
/* =====================================================================
   DAS LAUFENDE BAND DER VERTRIEBSKANÄLE.

   Es steht auf den drei Startseiten und auf allen achtzehn Hizmet-Seiten
   -- einundzwanzig Stellen. Von Hand gepflegt hieße: ein Logo austauschen
   und einundzwanzig Dateien anfassen, ohne eine zu vergessen. Die Liste
   steht deshalb nur hier.

     node tools/build-platforms.mjs           setzt das Band überall ein
     node tools/build-platforms.mjs --check   schreibt nichts, meldet nur,
                                              welche Seite abweicht

   Eingesetzt wird zwischen die Markierungen:

     <!-- platforms -->   ...   <!-- /platforms -->

   AUFBAU
   Das Band ist eine Liste, gefolgt von derselben Liste noch einmal. Die
   Zweitschrift schließt den Umlauf ohne Sprung. Sie trägt aria-hidden,
   sonst läse ein Vorleseprogramm jeden Namen zweimal -- aber dieselben
   Verweise, denn sie läuft genauso durchs Bild wie die erste; ohne wären
   die Zeichen bei jedem zweiten Vorbeikommen tot. tabindex="-1" hält sie
   trotzdem aus der Tabulatorfolge, damit kein Ziel zweimal ansteuerbar
   ist.

   Ada Kitap hat keine eigene Seite, das Zeichen steht ohne Verweis da.

   Die Laufzeit des Bandes steht in styles.css (platform-run). Wer hier
   Zeichen hinzufügt oder entfernt, zieht sie dort nach: rund 5,6 Sekunden
   je Zeichen, sonst ändert sich die Geschwindigkeit.

   Dieses Skript liegt außerhalb von public/ und wird nicht veröffentlicht.
   ===================================================================== */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const CHECK = process.argv.includes("--check");

/* Datei, Name, Maße der Datei, Startseite des Kanals (null = keine). */
const LOGOS = [
  ["amazon.webp", "Amazon", 265, 80, "https://www.amazon.com"],
  ["trendyol.svg", "Trendyol", 197, 80, "https://www.trendyol.com"],
  ["kitapyurdu.webp", "Kitapyurdu", 621, 150, "https://www.kitapyurdu.com"],
  ["amazon-kindle.svg", "Amazon Kindle", 361, 80, "https://www.amazon.com/kindle"],
  ["dr.webp", "D&amp;R", 217, 160, "https://www.dr.com.tr"],
  ["hepsiburada.svg", "Hepsiburada", 470, 80, "https://www.hepsiburada.com"],
  ["bkmkitap.webp", "BKM Kitap", 369, 160, "https://www.bkmkitap.com"],
  ["kobo.webp", "Kobo", 147, 80, "https://www.kobo.com"],
  ["kirmizi-kedi.webp", "Kırmızı Kedi", 167, 160, "https://www.kirmizikedi.com"],
  ["google-books.webp", "Google Books", 243, 80, "https://books.google.com"],
  ["ada.webp", "Ada Kitap", 407, 160, null],
];

const LABEL = {
  tr: "Kitabınızın ulaştığı platformlar",
  de: "Plattformen, auf denen Ihr Buch erscheint",
  en: "Platforms your book appears on",
};

/* Die Seiten mit ihrer Sprache: drei Startseiten und die achtzehn
   Hizmet-Seiten. Ermittelt wird das aus den Markierungen selbst -- wer
   das Band auf eine weitere Seite setzen will, trägt dort die beiden
   Markierungen ein und lässt das Skript laufen. */
function seiten() {
  const out = [];
  (function walk(d) {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (statSync(p).isDirectory()) walk(p);
      else if (e.endsWith(".html") && readFileSync(p, "utf8").includes("<!-- platforms -->")) out.push(p);
    }
  })(ROOT);
  return out.sort();
}

const liste = (hidden) => {
  const rows = [`  <ul class="platforms-list"${hidden ? ' aria-hidden="true"' : ""}>`];
  for (const [src, alt, w, h, href] of LOGOS) {
    const img = `<img src="/assets/platforms/${src}" alt="${hidden ? "" : alt}" width="${w}" height="${h}" loading="lazy" />`;
    rows.push('    <li class="platform-logo">');
    if (href) {
      rows.push(`      <a href="${href}" target="_blank" rel="noopener"${hidden ? ' tabindex="-1"' : ""}>`);
      rows.push(`        ${img}`);
      rows.push("      </a>");
    } else {
      rows.push(`      ${img}`);
    }
    rows.push("    </li>");
  }
  rows.push("  </ul>");
  return rows;
};

const block = (lang) => [
  '<div class="platforms">',
  `  <p class="platforms-label">${LABEL[lang]}</p>`,
  '  <div class="platform-marquee">',
  '    <div class="platform-track">',
  ...liste(false).map((l) => "    " + l),
  ...liste(true).map((l) => "    " + l),
  "    </div>",
  "  </div>",
  "</div>",
];

function fill(html, lines, file) {
  const open = "<!-- platforms -->";
  const close = "<!-- /platforms -->";
  const a = html.indexOf(open);
  const b = html.indexOf(close);
  if (a < 0 || b < a || html.indexOf(open, a + 1) >= 0) {
    throw new Error(`${file}: Markierung ${open} fehlt, steht doppelt oder falsch herum`);
  }
  const lineStart = html.lastIndexOf("\n", a) + 1;
  const indent = html.slice(lineStart, a);
  const body = lines.map((l) => (l ? indent + l : "")).join("\n");
  return html.slice(0, a + open.length) + "\n" + body + "\n" + indent + html.slice(b);
}

const dateien = seiten();
if (!dateien.length) {
  console.error("Keine Seite trägt die Markierung <!-- platforms -->");
  process.exit(1);
}
let changed = 0;
for (const path of dateien) {
  const rel = path.slice(ROOT.length + 1);
  const before = readFileSync(path, "utf8");
  const lang = before.match(/<html lang="([^"]+)"/)?.[1] || "tr";
  if (!LABEL[lang]) throw new Error(`${rel}: Sprache "${lang}" kenne ich nicht`);
  const after = fill(before, block(lang), rel);
  if (after !== before) {
    changed++;
    if (CHECK) console.log(`weicht ab: ${rel}`);
    else writeFileSync(path, after);
  }
}
if (CHECK) {
  console.log(changed ? `${changed} von ${dateien.length} Seiten weichen ab` : `alle ${dateien.length} Seiten stimmen`);
  process.exit(changed ? 1 : 0);
}
console.log(`${dateien.length} Seiten geprüft, ${changed} neu geschrieben`);
