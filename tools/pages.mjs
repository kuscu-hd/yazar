/* =====================================================================
   SEITENREGISTER -- die eine Liste, aus der alle Werkzeuge lesen.

   Eine Zeile je Seite, alle Sprachen nebeneinander:
     [Datei, Adresse]   Adresse = die kanonische, endungslose Form
     section            Punkt der Kopfzeile, zu dem die Seite gehört
     noindex            nicht in die Suche und nicht in die sitemap.xml
     bare               ohne canonical und ohne hreflang (die 404-Seite)
     only               Sprachen, die es schon gibt (sonst alle)

   Wer eine Seite hinzufügt, trägt sie hier ein und lässt die Werkzeuge
   laufen: tools/sync-shell.mjs, tools/build-sitemap.mjs, tools/build-jsonld.mjs.
   ===================================================================== */

export const ORIGIN = "https://yazardandirekt.com";
// Die Reihenfolge hier ist die Reihenfolge im Umschalter oben rechts.
export const LANGS = ["tr", "de", "en"];

export const PAGES = [
  { id: "home", section: null, tr: ["index.html", "/"], de: ["de/index.html", "/de/"], en: ["en/index.html", "/en/"] },
  { id: "services", section: "services", tr: ["hizmetlerimiz.html", "/hizmetlerimiz"], de: ["de/leistungen.html", "/de/leistungen"], en: ["en/services.html", "/en/services"] },
  { id: "consult", section: "services", tr: ["yazar-danismanligi.html", "/yazar-danismanligi"], de: ["de/autorenberatung.html", "/de/autorenberatung"], en: ["en/author-consulting.html", "/en/author-consulting"] },
  { id: "editing", section: "services", tr: ["editorluk-hizmetleri.html", "/editorluk-hizmetleri"], de: ["de/lektorat.html", "/de/lektorat"], en: ["en/editing.html", "/en/editing"] },
  { id: "design", section: "services", tr: ["tasarim.html", "/tasarim"], de: ["de/gestaltung.html", "/de/gestaltung"], en: ["en/design.html", "/en/design"] },
  { id: "translation", section: "services", tr: ["ceviri.html", "/ceviri"], de: ["de/uebersetzung.html", "/de/uebersetzung"], en: ["en/translation.html", "/en/translation"] },
  { id: "print", section: "services", tr: ["basim-dagitim.html", "/basim-dagitim"], de: ["de/druck-und-vertrieb.html", "/de/druck-und-vertrieb"], en: ["en/printing-and-distribution.html", "/en/printing-and-distribution"] },
  { id: "ebook", section: "services", tr: ["ekitap-formati.html", "/ekitap-formati"], de: ["de/e-book-format.html", "/de/e-book-format"], en: ["en/e-book-format.html", "/en/e-book-format"] },
  { id: "amazon", section: "amazon", tr: ["amazonda-yayinla.html", "/amazonda-yayinla"], de: ["de/auf-amazon-veroeffentlichen.html", "/de/auf-amazon-veroeffentlichen"], en: ["en/publish-on-amazon.html", "/en/publish-on-amazon"] },
  { id: "about", section: "about", tr: ["hakkimizda.html", "/hakkimizda"], de: ["de/ueber-uns.html", "/de/ueber-uns"], en: ["en/about-us.html", "/en/about-us"] },
  { id: "global", section: "amazon", tr: ["yurtdisi-hizmetler.html", "/yurtdisi-hizmetler"], de: ["de/international.html", "/de/international"], en: ["en/international.html", "/en/international"] },
  { id: "contact", section: "contact", tr: ["iletisim.html", "/iletisim"], de: ["de/kontakt.html", "/de/kontakt"], en: ["en/contact.html", "/en/contact"] },
  // Dankeseite nach dem Absenden: kein Menüpunkt, noindex, nicht in der sitemap.
  { id: "thanks", section: null, noindex: true, tr: ["tesekkurler.html", "/tesekkurler"], de: ["de/danke.html", "/de/danke"], en: ["en/thank-you.html", "/en/thank-you"] },
  // Die Fehlerseite. Netlify liefert 404.html aus dem Wurzelverzeichnis des
  // veröffentlichten Ordners mit Status 404 aus. "bare": ohne canonical und
  // ohne hreflang -- sie hat keine eigene Adresse, unter der man sie sucht.
  { id: "notfound", section: null, noindex: true, bare: true, only: ["tr"], tr: ["404.html", "/404"], de: ["de/404.html", "/de/404"] },
  // Rechtstexte.
  // Die beiden Rechtstexte gibt es nur auf Türkisch und Deutsch: sie sind
  // verbindliche Erklärungen nach türkischem Recht und werden nicht
  // nebenbei übersetzt.
  { id: "kvkk", section: null, only: ["tr", "de"], tr: ["aydinlatma-metni.html", "/aydinlatma-metni"], de: ["de/datenschutzhinweise.html", "/de/datenschutzhinweise"] },
  { id: "privacy", section: null, only: ["tr", "de"], tr: ["gizlilik-ve-guvenlik-politikasi.html", "/gizlilik-ve-guvenlik-politikasi"], de: ["de/datenschutz-und-sicherheit.html", "/de/datenschutz-und-sicherheit"] },
];

export const SERVICE_IDS = ["consult", "editing", "design", "translation", "print", "ebook"];

export const page = (id) => PAGES.find((p) => p.id === id);
export const url = (id, lang) => page(id)[lang][1];
export const langsOf = (p) => p.only || LANGS;

/* Adresse einer Seite in der gewünschten Sprache -- gibt es sie dort nicht,
   die türkische. Damit kann die Fußzeile einer englischen Seite auf die
   türkischen Rechtstexte zeigen, statt ins Leere zu führen. */
export const urlOr = (id, lang) => {
  const p = page(id);
  return (langsOf(p).includes(lang) ? p[lang] : p.tr)[1];
};
export const langOf = (id, lang) => (langsOf(page(id)).includes(lang) ? lang : "tr");
