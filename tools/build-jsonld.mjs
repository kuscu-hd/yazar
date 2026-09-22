#!/usr/bin/env node
/* =====================================================================
   STRUKTURIERTE DATEN (JSON-LD) je Seite.

   Grundsatz: nichts behaupten, was nicht auf der Seite steht. Deshalb liest
   dieses Skript die Angaben aus der fertigen Seite -- Überschrift, Einleitung,
   Fragen und Antworten, die Rubrik über dem Titel -- und schreibt sie in einen
   Block zwischen den Markierungen:

     <!-- shell:jsonld -->  ...  <!-- /shell:jsonld -->

   Was auf welcher Seite steht:
     Startseiten            Organization
     Leistungsseiten und
     /amazonda-yayinla      Service + FAQPage + BreadcrumbList
     Übersicht, Über uns,
     International, Recht   BreadcrumbList
     Kontakt                BreadcrumbList + FAQPage
     Danke, 404             nichts

   Bewusst NICHT dabei: Anschrift und Firmierung (beide unbestätigt) sowie
   sameAs -- die Symbole in der Fußzeile der alten Seite zeigen auf "#", es
   gibt also keine echten Profiladressen.

     node tools/build-jsonld.mjs           schreibt die Blöcke
     node tools/build-jsonld.mjs --check   meldet Abweichungen (Exit-Code 1)
   ===================================================================== */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ORIGIN, PAGES, SERVICE_IDS, url, langsOf } from "./pages.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const CHECK = process.argv.includes("--check");
const OPEN = "<!-- shell:jsonld -->";
const CLOSE = "<!-- /shell:jsonld -->";

const ORG_ID = `${ORIGIN}/#organization`;
const ORG = {
  name: "Yazardan Direkt",
  email: "info@yazardandirekt.com",
  telephone: "+902163011213", // wie im tel:-Link der Seite
  logo: `${ORIGIN}/assets/yazar_logo.png`,
};

const HOME_LABEL = { tr: "ANASAYFA", de: "STARTSEITE" };

/* ---------- aus der Seite lesen ---------- */

const strip = (x) =>
  x
    .replace(/<br\s*\/?>/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

function read(html) {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const lede = html.match(/<p class="lede"[^>]*>([\s\S]*?)<\/p>/);
  const kicker = html.match(/<a class="kicker kicker-link" href="([^"]+)">([\s\S]*?)<\/a>/);
  const faq = [...html.matchAll(/<details>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>\s*<\/details>/g)].map(
    (m) => [strip(m[1]), strip(m[2])]
  );
  return {
    h1: h1 ? strip(h1[1]) : null,
    lede: lede ? strip(lede[1]) : null,
    kicker: kicker ? { href: kicker[1], name: strip(kicker[2]) } : null,
    faq,
  };
}

/* ---------- Bausteine ---------- */

const organization = () => ({
  "@type": "Organization",
  "@id": ORG_ID,
  name: ORG.name,
  url: `${ORIGIN}/`,
  logo: ORG.logo,
  email: ORG.email,
  telephone: ORG.telephone,
});

const service = (page, lang, data) => ({
  "@type": "Service",
  "@id": `${ORIGIN}${page[lang][1]}#service`,
  name: data.h1,
  description: data.lede,
  provider: { "@id": ORG_ID },
  url: `${ORIGIN}${page[lang][1]}`,
  inLanguage: lang,
});

const faqPage = (page, lang, data) => ({
  "@type": "FAQPage",
  "@id": `${ORIGIN}${page[lang][1]}#faq`,
  inLanguage: lang,
  mainEntity: data.faq.map(([q, a]) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
});

function breadcrumb(page, lang, data) {
  const items = [{ name: HOME_LABEL[lang], item: `${ORIGIN}${url("home", lang)}` }];
  // Die Rubrik über dem Titel ist der sichtbare Weg zurück zur Übersicht.
  if (data.kicker) items.push({ name: data.kicker.name, item: ORIGIN + data.kicker.href });
  items.push({ name: data.h1, item: `${ORIGIN}${page[lang][1]}` });
  return {
    "@type": "BreadcrumbList",
    "@id": `${ORIGIN}${page[lang][1]}#breadcrumb`,
    itemListElement: items.map((x, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: x.name,
      item: x.item,
    })),
  };
}

/* ---------- je Seite zusammenstellen ---------- */

function graphFor(page, lang, html) {
  const data = read(html);
  const nodes = [];
  if (page.id === "home") {
    nodes.push(organization());
  } else if (page.id === "thanks" || page.id === "notfound") {
    return null;
  } else {
    if (SERVICE_IDS.includes(page.id) || page.id === "amazon") nodes.push(service(page, lang, data));
    if (data.faq.length) nodes.push(faqPage(page, lang, data));
    nodes.push(breadcrumb(page, lang, data));
  }
  return { "@context": "https://schema.org", "@graph": nodes };
}

/* Innerhalb von <script> darf kein "<" stehen bleiben. */
const toJson = (obj) => JSON.stringify(obj, null, 2).replace(/</g, "\\u003c");

function region(page, lang, html, file) {
  const graph = graphFor(page, lang, html);
  if (!graph) return "";
  // Prüfen, dass jede Angabe wirklich auf der Seite steht.
  const visible = strip(html.replace(/<script[\s\S]*?<\/script>/g, ""));
  const check = (v) => {
    if (typeof v === "string" && v.length > 3 && !v.startsWith("http") && !v.startsWith("+") && !v.includes("@")) {
      if (!visible.includes(v)) throw new Error(`${file}: "${v.slice(0, 60)}" steht nicht auf der Seite`);
    }
  };
  JSON.stringify(graph, (k, v) => (k === "name" || k === "description" || k === "text" ? (check(v), v) : v));
  if (page.id === "home") {
    for (const v of [ORG.name, ORG.email]) {
      if (!html.includes(v)) throw new Error(`${file}: ${v} steht nicht auf der Seite`);
    }
    if (!html.includes(`tel:${ORG.telephone}`)) throw new Error(`${file}: Telefonnummer fehlt`);
    if (!html.includes('src="/assets/yazar_logo.png"')) throw new Error(`${file}: Logo fehlt`);
  }
  const body = toJson(graph)
    .split("\n")
    .map((l) => "      " + l)
    .join("\n");
  return `    <script type="application/ld+json">\n${body}\n    </script>\n`;
}

let changed = 0;
let checked = 0;
const summary = [];
for (const page of PAGES) {
  for (const lang of langsOf(page)) {
    const file = page[lang][0];
    const path = join(ROOT, file);
    const before = readFileSync(path, "utf8");
    let html = before;
    if (!html.includes(OPEN)) html = html.replace("  </head>", `    ${OPEN}\n    ${CLOSE}\n  </head>`);
    const block = region(page, lang, html, file);
    const a = html.indexOf(OPEN);
    const b = html.indexOf(CLOSE);
    html = html.slice(0, a + OPEN.length) + "\n" + block + "    " + html.slice(b);
    if (block === "") html = html.replace(`    ${OPEN}\n    ${CLOSE}\n`, ""); // Danke/404: keine Angaben
    checked++;
    const types = (block.match(/"@type": "(Organization|Service|FAQPage|BreadcrumbList)"/g) || []).map((x) =>
      x.split('"')[3]
    );
    summary.push(`${file.padEnd(40)} ${types.join(", ") || "-"}`);
    if (html !== before) {
      changed++;
      if (CHECK) console.log(`weicht ab: ${file}`);
      else writeFileSync(path, html);
    }
  }
}
if (!CHECK) console.log(summary.join("\n"));
if (CHECK) {
  console.log(changed ? `${changed} von ${checked} Seiten weichen ab` : `alle ${checked} Seiten stimmen`);
  process.exit(changed ? 1 : 0);
}
console.log(`${checked} Seiten geprüft, ${changed} neu geschrieben`);
