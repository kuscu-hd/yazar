/* =====================================================================
   SEITENREGISTER -- die eine Liste, aus der alle Werkzeuge lesen.

   Eine Zeile je Seite, beide Sprachen nebeneinander:
     [Datei, Adresse]   Adresse = die kanonische, endungslose Form
     section            Punkt der Kopfzeile, zu dem die Seite gehört
     noindex            nicht in die Suche und nicht in die sitemap.xml
     bare               ohne canonical und ohne hreflang (die 404-Seite)
     only               Sprachen, die es schon gibt (sonst beide)

   Wer eine Seite hinzufügt, trägt sie hier ein und lässt die Werkzeuge
   laufen: tools/sync-shell.mjs, tools/build-sitemap.mjs, tools/build-jsonld.mjs.
   ===================================================================== */

export const ORIGIN = "https://yazardandirekt.com";
export const LANGS = ["tr", "de"];

export const PAGES = [
  { id: "home", section: null, tr: ["index.html", "/"], de: ["de/index.html", "/de/"] },
  { id: "services", section: "services", tr: ["hizmetlerimiz.html", "/hizmetlerimiz"], de: ["de/leistungen.html", "/de/leistungen"] },
  { id: "consult", section: "services", tr: ["yazar-danismanligi.html", "/yazar-danismanligi"], de: ["de/autorenberatung.html", "/de/autorenberatung"] },
  { id: "editing", section: "services", tr: ["editorluk-hizmetleri.html", "/editorluk-hizmetleri"], de: ["de/lektorat.html", "/de/lektorat"] },
  { id: "design", section: "services", tr: ["tasarim.html", "/tasarim"], de: ["de/gestaltung.html", "/de/gestaltung"] },
  { id: "translation", section: "services", tr: ["ceviri.html", "/ceviri"], de: ["de/uebersetzung.html", "/de/uebersetzung"] },
  { id: "print", section: "services", tr: ["basim-dagitim.html", "/basim-dagitim"], de: ["de/druck-und-vertrieb.html", "/de/druck-und-vertrieb"] },
  { id: "ebook", section: "services", tr: ["ekitap-formati.html", "/ekitap-formati"], de: ["de/e-book-format.html", "/de/e-book-format"] },
  { id: "amazon", section: "amazon", tr: ["amazonda-yayinla.html", "/amazonda-yayinla"], de: ["de/auf-amazon-veroeffentlichen.html", "/de/auf-amazon-veroeffentlichen"] },
  { id: "about", section: "about", tr: ["hakkimizda.html", "/hakkimizda"], de: ["de/ueber-uns.html", "/de/ueber-uns"] },
  { id: "global", section: "amazon", tr: ["yurtdisi-hizmetler.html", "/yurtdisi-hizmetler"], de: ["de/international.html", "/de/international"] },
  { id: "contact", section: "contact", tr: ["iletisim.html", "/iletisim"], de: ["de/kontakt.html", "/de/kontakt"] },
  // Dankeseite nach dem Absenden: kein Menüpunkt, noindex, nicht in der sitemap.
  { id: "thanks", section: null, noindex: true, tr: ["tesekkurler.html", "/tesekkurler"], de: ["de/danke.html", "/de/danke"] },
  // Die Fehlerseite. Netlify liefert 404.html aus dem Wurzelverzeichnis des
  // veröffentlichten Ordners mit Status 404 aus. "bare": ohne canonical und
  // ohne hreflang -- sie hat keine eigene Adresse, unter der man sie sucht.
  { id: "notfound", section: null, noindex: true, bare: true, only: ["tr"], tr: ["404.html", "/404"], de: ["de/404.html", "/de/404"] },
  // Rechtstexte.
  { id: "kvkk", section: null, tr: ["aydinlatma-metni.html", "/aydinlatma-metni"], de: ["de/datenschutzhinweise.html", "/de/datenschutzhinweise"] },
  { id: "privacy", section: null, tr: ["gizlilik-ve-guvenlik-politikasi.html", "/gizlilik-ve-guvenlik-politikasi"], de: ["de/datenschutz-und-sicherheit.html", "/de/datenschutz-und-sicherheit"] },
];

export const SERVICE_IDS = ["consult", "editing", "design", "translation", "print", "ebook"];

export const page = (id) => PAGES.find((p) => p.id === id);
export const url = (id, lang) => page(id)[lang][1];
export const langsOf = (p) => p.only || LANGS;
