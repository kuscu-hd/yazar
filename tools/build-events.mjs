#!/usr/bin/env node
/* =====================================================================
   VERANSTALTUNGEN AUS EINER TABELLE.

   Der Abschnitt "Yazar-Okur Buluşmaları" steht auf sechs Seiten -- drei
   Startseiten und drei Hakkımızda-Seiten -- und hat dort überall denselben
   Inhalt. Gepflegt wird er nicht mehr im HTML, sondern in einer Tabelle:

     node tools/build-events.mjs           schreibt den Block in alle sechs
     node tools/build-events.mjs --check   schreibt nichts, meldet nur, welche
                                           Seite abweicht (Exit-Code 1)

   WOHER DIE DATEN KOMMEN
   Steht EVENTS_CSV_URL in der Umgebung, wird von dort geholt -- das ist die
   als CSV veröffentlichte Google-Tabelle, und so läuft es auf Netlify.
   Fehlt die Adresse oder ist Google gerade nicht erreichbar, gilt die
   mitgelieferte content/events.csv. Die Seite baut dann mit dem zuletzt
   bekannten Stand statt gar nicht.

   Nach einem erfolgreichen Abruf wird content/events.csv aktualisiert.
   Wer lokal baut, hat die Datei danach geändert im Arbeitsbaum und checkt
   sie mit ein; damit bleibt der Rückfall im Repository aktuell.

   AUFBAU DER TABELLE -- eine Zeile je Veranstaltung UND Sprache:

     id | sprache | tag | monat | art | titel | wo | text

   Die id hält die drei Sprachfassungen einer Veranstaltung zusammen; in
   welcher Reihenfolge die ids zuerst auftauchen, in der stehen sie auf der
   Seite. Fehlt zu einer id eine Sprache, bricht der Lauf ab: eine Seite,
   auf der eine Veranstaltung fehlt, wäre schlimmer als ein geplatzter Bau.
   Netlify behält bei einem Fehlschlag die zuletzt gelungene Fassung online.

   Jahreszahlen trägt der Abschnitt bewusst nicht -- sie standen auch auf der
   bisherigen Seite nicht und sind nicht bestätigt. Eine Spalte dafür wäre
   später leicht ergänzt.

   Dieses Skript liegt außerhalb von public/ und wird nicht veröffentlicht.
   ===================================================================== */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");
const LOCAL = join(ROOT, "content", "events.csv");
const CHECK = process.argv.includes("--check");
const SOURCE = process.env.EVENTS_CSV_URL;

/* Die sechs Seiten mit ihrer Sprache. Jede trägt die Markierungen
   <!-- events --> und <!-- /events --> um den Block. */
const TARGETS = [
  ["index.html", "tr"],
  ["hakkimizda.html", "tr"],
  ["de/index.html", "de"],
  ["de/ueber-uns.html", "de"],
  ["en/index.html", "en"],
  ["en/about-us.html", "en"],
];

const LANGS = ["tr", "de", "en"];
const COLUMNS = ["id", "sprache", "tag", "monat", "art", "titel", "wo", "text"];

/* ---------- CSV lesen ----------
   Eigener Leser statt einer Abhängigkeit: das Projekt hat keine
   node_modules und soll keine bekommen. Anführungszeichen, Kommas und
   Zeilenumbrüche innerhalb eines Feldes nach RFC 4180, "" ist ein
   einfaches Anführungszeichen. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  // Ein BOM aus Google Sheets würde sonst im ersten Spaltennamen stecken.
  const s = text.replace(/^﻿/, "").replace(/\r\n?/g, "\n");
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (quoted) {
      if (c === '"') {
        if (s[i + 1] === '"') { field += '"'; i++; } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((v) => v.trim() !== ""));
}

function readTable(text, herkunft) {
  const rows = parseCsv(text);
  if (!rows.length) throw new Error(`${herkunft}: die Tabelle ist leer`);
  const head = rows[0].map((h) => h.trim().toLowerCase());
  for (const col of COLUMNS) {
    if (!head.includes(col)) {
      throw new Error(`${herkunft}: die Spalte "${col}" fehlt. Erwartet: ${COLUMNS.join(", ")}`);
    }
  }
  const idx = Object.fromEntries(COLUMNS.map((c) => [c, head.indexOf(c)]));
  const events = new Map();
  const order = [];
  rows.slice(1).forEach((r, n) => {
    const zeile = n + 2; // Kopfzeile ist Zeile 1
    const get = (c) => (r[idx[c]] ?? "").trim();
    const id = get("id");
    const lang = get("sprache").toLowerCase();
    if (!id) throw new Error(`${herkunft}, Zeile ${zeile}: die Spalte "id" ist leer`);
    if (!LANGS.includes(lang)) {
      throw new Error(`${herkunft}, Zeile ${zeile}: "${get("sprache")}" ist keine der Sprachen ${LANGS.join(", ")}`);
    }
    for (const c of ["tag", "monat", "art", "titel", "wo", "text"]) {
      if (!get(c)) throw new Error(`${herkunft}, Zeile ${zeile} (${id}/${lang}): die Spalte "${c}" ist leer`);
    }
    if (!events.has(id)) { events.set(id, {}); order.push(id); }
    if (events.get(id)[lang]) throw new Error(`${herkunft}, Zeile ${zeile}: ${id}/${lang} steht zweimal in der Tabelle`);
    events.get(id)[lang] = {
      tag: get("tag"), monat: get("monat"), art: get("art"),
      titel: get("titel"), wo: get("wo"), text: get("text"),
    };
  });
  for (const id of order) {
    const fehlt = LANGS.filter((l) => !events.get(id)[l]);
    if (fehlt.length) throw new Error(`${herkunft}: zu "${id}" fehlt die Zeile für ${fehlt.join(" und ")}`);
  }
  if (!order.length) throw new Error(`${herkunft}: keine einzige Veranstaltung gefunden`);
  return { order, events };
}

/* ---------- Quelle wählen ---------- */
async function load() {
  if (SOURCE) {
    try {
      const res = await fetch(SOURCE, { redirect: "follow" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      // Eine nicht freigegebene Tabelle liefert eine Anmeldeseite, keine
      // Tabelle. Ohne diese Probe landete HTML in der CSV-Zerlegung und
      // der Fehler käme erst viel später und unverständlich.
      if (/^\s*</.test(text)) {
        throw new Error("die Antwort ist HTML, keine CSV -- ist die Tabelle im Web veröffentlicht?");
      }
      const table = readTable(text, "die Tabelle");
      if (!CHECK) {
        mkdirSync(dirname(LOCAL), { recursive: true });
        writeFileSync(LOCAL, text.replace(/^﻿/, ""));
      }
      console.log(`Tabelle geholt: ${table.order.length} Veranstaltungen`);
      return table;
    } catch (err) {
      // Nur der Abruf darf scheitern und zurückfallen. Eine Tabelle, die da
      // ist, aber nicht stimmt, muss den Lauf abbrechen -- sonst ginge eine
      // fehlerhafte Zeile still unter.
      if (err instanceof TypeError || /HTTP|HTML/.test(err.message)) {
        console.warn(`Abruf fehlgeschlagen (${err.message}) -- es gilt content/events.csv`);
      } else throw err;
    }
  }
  if (!existsSync(LOCAL)) throw new Error("weder EVENTS_CSV_URL noch content/events.csv");
  const table = readTable(readFileSync(LOCAL, "utf8"), "content/events.csv");
  console.log(`${SOURCE ? "Rückfall auf" : "Quelle:"} content/events.csv: ${table.order.length} Veranstaltungen`);
  return table;
}

/* ---------- Block bauen ---------- */
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function block({ order, events }, lang) {
  const lines = ['<ol class="events">'];
  for (const id of order) {
    const e = events.get(id)[lang];
    lines.push(
      "  <li>",
      '    <p class="event-date">',
      `      <span class="event-day">${esc(e.tag)}</span>`,
      `      <span class="event-month">${esc(e.monat)}</span>`,
      "    </p>",
      '    <div class="event-say">',
      `      <p class="event-kind">${esc(e.art)}</p>`,
      `      <h3>${esc(e.titel)}</h3>`,
      `      <p class="event-where">${esc(e.wo)}</p>`,
      `      <p class="event-text">${esc(e.text)}</p>`,
      "    </div>",
      "  </li>",
    );
  }
  lines.push("</ol>");
  return lines;
}

/* Einsetzen zwischen die Markierungen, Einrückung von der öffnenden
   übernehmen -- dasselbe Verfahren wie in sync-shell.mjs. */
function fill(html, lines, file) {
  const open = "<!-- events -->";
  const close = "<!-- /events -->";
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

/* Wer im Bauprotokoll von Netlify nach dem Fehler sucht, soll einen Satz
   finden und keinen Aufrufstapel: alles, was hier schiefgeht, ist ein
   Fehler in der Tabelle und wird dort behoben, nicht im Code. */
let table;
try {
  table = await load();
} catch (err) {
  console.error("\nVeranstaltungen nicht übernommen: " + err.message + "\n");
  process.exit(1);
}

let changed = 0;
for (const [file, lang] of TARGETS) {
  const path = join(PUBLIC, file);
  if (!existsSync(path)) throw new Error(`${file} fehlt`);
  const before = readFileSync(path, "utf8");
  const after = fill(before, block(table, lang), file);
  if (after !== before) {
    changed++;
    if (CHECK) console.log(`weicht ab: ${file}`);
    else writeFileSync(path, after);
  }
}
if (CHECK) {
  console.log(changed ? `${changed} von ${TARGETS.length} Seiten weichen ab` : `alle ${TARGETS.length} Seiten stimmen`);
  process.exit(changed ? 1 : 0);
}
console.log(`${TARGETS.length} Seiten geprüft, ${changed} neu geschrieben`);
