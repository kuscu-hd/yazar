#!/usr/bin/env node
/* =====================================================================
   HÜLLE ALLER SEITEN: <head>, Kopfzeile mit Menütafel, Fußzeile.

   Jede Seite trägt diese Blöcke ausgeschrieben -- das Projekt bleibt reines
   HTML ohne Bauschritt, Netlify liefert die Dateien so aus, wie sie hier
   liegen. Damit die Blöcke auf allen Seiten gleich bleiben, stehen sie nur
   in dieser Datei und werden zwischen Markierungen eingesetzt:

     <!-- shell:head -->   ...   <!-- /shell:head -->
     <!-- shell:header --> ...   <!-- /shell:header -->
     <!-- shell:footer --> ...   <!-- /shell:footer -->

   Dazu setzt das Skript <html lang="..">. Alles andere gehört der Seite und
   wird nie angefasst -- Texte im Inhalt ändert man direkt in der Seite.

     node tools/sync-shell.mjs           setzt die Blöcke in alle Seiten ein
     node tools/sync-shell.mjs --check   schreibt nichts, meldet nur, welche
                                         Seite abweicht (Exit-Code 1)

   Menü oder Fußzeile ändern: hier ändern, Skript laufen lassen, die
   geänderten Seiten mit einchecken.

   Kein Teil der ausgelieferten Seite -- wird in der Deploy-Phase vom
   Veröffentlichen ausgenommen.
   ===================================================================== */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHECK = process.argv.includes("--check");

/* ---------------------------------------------------------------------
   SEITENREGISTER.  Eine Zeile je Seite, beide Sprachen nebeneinander.
   "section" ist der Punkt der Kopfzeile, zu dem die Seite gehört.
   --------------------------------------------------------------------- */

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
];

const LANGS = ["tr", "de"];
const ORIGIN = "https://yazardandirekt.com";

/* TITEL UND BESCHREIBUNG je Seite und Sprache. Titel eindeutig, höchstens
   etwa 60 Zeichen; Beschreibung etwa 120 bis 160 Zeichen. */
const META = {
  home: {
    tr: ["Yazardan Direkt | Standartların Ötesinde Yayıncılık",
      "Standartların ötesinde yayıncılık. Yazar danışmanlığı, editörlük, tasarım, çeviri, basım-dağıtım ve Amazon'da yayınlama."],
    de: ["Yazardan Direkt | Verlagsarbeit jenseits des Üblichen",
      "Verlagsarbeit jenseits des Üblichen. Autorenberatung, Lektorat, Gestaltung, Übersetzung, Druck und Vertrieb sowie Veröffentlichung auf Amazon."],
  },
  services: {
    tr: ["Yayıncılık Hizmetleri | Yazardan Direkt",
      "Yazar danışmanlığı, editörlük, tasarım, çeviri, basım-dağıtım ve e-kitap: modüler hizmetlerle tek bir adımı ya da tüm yayın sürecini birlikte yürütüyoruz."],
    de: ["Leistungen für Autorinnen und Autoren | Yazardan Direkt",
      "Autorenberatung, Lektorat, Gestaltung, Übersetzung, Druck und Vertrieb, E-Book-Format – modular: ein einzelner Schritt oder der ganze Weg zum Buch."],
  },
  consult: {
    tr: ["Yazar Danışmanlığı | Yazardan Direkt",
      "Fikrinizin şekillenmesinden yayın kararına kadar kişiye özel, stratejik yazar danışmanlığı: hedef kitle, tür, başlık, zamanlama ve yayın modeli."],
    de: ["Autorenberatung | Yazardan Direkt",
      "Persönliche, strategische Beratung von der Idee bis zur Entscheidung über die Veröffentlichung: Zielgruppe, Genre, Titel, Zeitplanung und Modell."],
  },
  editing: {
    tr: ["Kitap Editörlüğü | Yazardan Direkt",
      "Editörlük bir metni değiştirmekten çok onun özünü parlatmaktır: yazım tutarlılığı, anlatım dili, yapı ve akışta yazarın sesine saygılı editörlük."],
    de: ["Lektorat | Yazardan Direkt",
      "Lektorat heißt, den Kern eines Textes zum Leuchten zu bringen: sprachliche Stimmigkeit, Ausdruck, Aufbau und Fluss – mit Achtung vor Ihrer Stimme."],
  },
  design: {
    tr: ["Kitap Kapağı ve Sayfa Tasarımı | Yazardan Direkt",
      "Kapaktan sayfa yerleşimine, tipografiden illüstrasyona: kitabınızın ruhunu yansıtan, baskıya ve dijital formatlara uygun kitap tasarımı."],
    de: ["Buchgestaltung: Umschlag und Satz | Yazardan Direkt",
      "Vom Umschlag bis zum Seitenlayout, von der Typografie bis zur Illustration: Buchgestaltung, die den Geist Ihres Werkes trägt – für Druck und Bildschirm."],
  },
  translation: {
    tr: ["Kitap Çevirisi | Yazardan Direkt",
      "Anlamı korumak, kültürü aktarmak: alanında yetkin çevirmenler, iki aşamalı kontrol ve editörle uyumlu bir süreçle, İngilizce başta olmak üzere kitap çevirisi."],
    de: ["Buchübersetzung | Yazardan Direkt",
      "Den Sinn bewahren, die Kultur vermitteln: Buchübersetzung durch fachkundige Übersetzerinnen und Übersetzer, zweistufig geprüft und mit dem Lektorat abgestimmt."],
  },
  print: {
    tr: ["Basım ve Dağıtım | Yazardan Direkt",
      "İstek üzerine basımdan yüksek tirajlara, kitabevi ağından Her Yerde Kitap'a: kitabınızın okura ulaşması için baskı ve dağıtım süreci."],
    de: ["Druck und Vertrieb | Yazardan Direkt",
      "Von Print-on-Demand bis zu hohen Auflagen, vom Buchhandel bis zu Her Yerde Kitap: Druck und Vertrieb, damit Ihr Buch seine Lesenden erreicht."],
  },
  ebook: {
    tr: ["E-Kitap Formatı: ePub ve Mobi | Yazardan Direkt",
      "Eserinizi tüm dijital platformlara uygun ePub ve Mobi dosyalarına dönüştürüyoruz: içindekiler, bağlantılar, görsel düzen ve dosya kontrolü dahil."],
    de: ["E-Book-Format: ePub und Mobi | Yazardan Direkt",
      "Wir machen Ihr Werk zu ePub- und Mobi-Dateien für alle digitalen Plattformen – mit Inhaltsverzeichnis, Verlinkungen, stimmigem Layout und Dateiprüfung."],
  },
  amazon: {
    tr: ["Amazon'da Yayınla | Yazardan Direkt",
      "Kitabınızı İngilizceye çevirip Amazon'da Kindle ve Print-on-Demand olarak yayımlayın. Amazon ve İstanbul Books hakkında sık sorulan sorular."],
    de: ["Auf Amazon veröffentlichen | Yazardan Direkt",
      "Ihr Buch ins Englische übersetzt und auf Amazon als Kindle-E-Book und Print-on-Demand veröffentlicht. Häufige Fragen zu Amazon und İstanbul Books."],
  },
  about: {
    tr: ["Hakkımızda | Yazardan Direkt",
      "Üretimi yücelten, emeği kutsayan bir yayınevi: Yazardan Direkt'in yayıncılık anlayışı, ekibi ve yazarlarımızın anlattıkları."],
    de: ["Über uns | Yazardan Direkt",
      "Ein Verlag, der das Schaffen erhöht und die Arbeit achtet: die Haltung von Yazardan Direkt, das Team und was unsere Autorinnen und Autoren sagen."],
  },
  global: {
    tr: ["Yurt Dışında Yayın: Amazon ve İstanbul Books | Yazardan Direkt",
      "İngilizce eserleriniz için Amazon, Türkçe kitaplarınız için İstanbul Books: eserinizi istek üzerine basımla dünyanın dört bir yanındaki okurlarla buluşturuyoruz."],
    de: ["Amazon und İstanbul Books | Yazardan Direkt",
      "Amazon für Ihre englischsprachigen Werke, İstanbul Books für Ihre türkischsprachigen Bücher: per Print-on-Demand zu Lesenden in aller Welt."],
  },
  contact: {
    tr: ["İletişim | Yazardan Direkt",
      "Eserinizi bize ulaştırın: +90-0216-301-1213, info@yazardandirekt.com, hafta içi 09:00–18:00. Ön değerlendirmenin ardından danışmanınız size ulaşır."],
    de: ["Kontakt | Yazardan Direkt",
      "Senden Sie uns Ihr Werk: +90-0216-301-1213, info@yazardandirekt.com, Montag bis Freitag 9–18 Uhr. Nach der Sichtung meldet sich Ihre Ansprechperson."],
  },
};

const SERVICE_IDS = ["consult", "editing", "design", "translation", "print", "ebook"];
const url = (id, lang) => PAGES.find((p) => p.id === id)[lang][1];

/* Vorläufige Nummern -- noch nicht bestätigt. Beide stehen nur hier. */
const MOBILE = { tel: "+905333568256", show: "+90 533 356 8256" };
const WHATSAPP = "https://wa.me/905398225698?text=Merhaba%2C%20destek%20almak%20istiyorum.";
const PROVISIONAL = "<!-- PROVISIONAL: number not yet confirmed -->";

const EXTERNAL = {
  shop: "https://heryerdekitap.com",
  blog: "https://heryerdekitap.com/her-yerde-kitap-blog-ve-haberler",
  authors: "https://heryerdekitap.com/brand",
};

/* ---------------------------------------------------------------------
   TEXTE DER HÜLLE
   --------------------------------------------------------------------- */

const TEXT = {
  tr: {
    brand: "Yazardan Direkt",
    menuMain: "Ana menü",
    menuAll: "Tüm menü",
    menuOpen: "Menüyü aç",
    menuClose: "Menüyü kapat",
    langLabel: "Dil seçimi",
    langName: { tr: "Türkçe", de: "Almanca" },
    nav: {
      home: "ANASAYFA",
      services: "HİZMETLERİMİZ",
      about: "HAKKIMIZDA",
      amazon: "AMAZONDA YAYINLA",
      contact: "İLETİŞİM",
      team: "EKİBİMİZ",
      global: "Sınırların Ötesi",
      faq: "SIK SORULAN SORULAR",
      shop: "HERYERDEKİTAP – KİTAP SATIŞ",
      blog: "BLOG",
      authors: "YAZARLARIMIZ",
    },
    service: {
      consult: "Yazar Danışmanlığı",
      editing: "Editörlük Hizmetleri",
      design: "Tasarım",
      translation: "Çeviri",
      print: "Basım-Dağıtım",
      ebook: "E-Kitap Formatı",
    },
    credo:
      "Üretimi yücelten, emeği kutsayan bir yerden bakıyoruz dünyaya. Sözün kıymetini sadece çok satanlarda değil, doğru yüreklerde arıyoruz.",
    footer: {
      credo:
        "Gücün yazarda, anlamın okurda olduğuna inanıyoruz. Bir kitabın raflarda yer alması değil, bir kalpte yer bulması önemlidir.",
      services: "Hizmetler",
      company: "Kurum",
      reach: "Bize ulaşın",
      rights: "Tüm hakları saklıdır.",
      top: "Başa dön",
      about: "Hakkımızda",
      team: "Ekibimiz",
      amazon: "Amazon'da Yayınla",
      global: "Sınırların Ötesi",
      shop: "HeryerdeKitap – Kitap Satış",
      blog: "Blog",
      authors: "Yazarlarımız",
      faq: "Sık sorulan sorular",
      whatsapp: "WhatsApp Desteği",
    },
  },

  /* Deutsch: die Texte aus der früheren i18n.js, unverändert übernommen.
     Neu ist nur "WhatsApp" (die türkische Fassung "WhatsApp Desteği"
     stammt von der alten Seite) -- in den Seiten als unreviewed markiert. */
  de: {
    brand: "Yazardan Direkt",
    menuMain: "Hauptmenü",
    menuAll: "Gesamtes Menü",
    menuOpen: "Menü öffnen",
    menuClose: "Menü schließen",
    langLabel: "Sprachwahl",
    langName: { tr: "Türkisch", de: "Deutsch" },
    nav: {
      home: "STARTSEITE",
      services: "LEISTUNGEN",
      about: "ÜBER UNS",
      amazon: "AUF AMAZON VERÖFFENTLICHEN",
      contact: "KONTAKT",
      team: "UNSER TEAM",
      global: "Über die Grenzen",
      faq: "HÄUFIGE FRAGEN",
      shop: "HERYERDEKİTAP – BUCHVERKAUF",
      blog: "BLOG",
      authors: "UNSERE AUTORINNEN & AUTOREN",
    },
    service: {
      consult: "Autorenberatung",
      editing: "Lektorat",
      design: "Gestaltung",
      translation: "Übersetzung",
      print: "Druck und Vertrieb",
      ebook: "E-Book-Format",
    },
    credo:
      "Wir sehen die Welt von einem Ort aus, der das Schaffen erhöht und die Arbeit achtet. Den Wert des Wortes suchen wir nicht allein in Bestsellerlisten, sondern in den richtigen Herzen.",
    footer: {
      credo:
        "Wir glauben, dass die Kraft bei den Schreibenden und der Sinn bei den Lesenden liegt. Nicht dass ein Buch im Regal steht, ist wichtig, sondern dass es in einem Herzen Platz findet.",
      services: "Leistungen",
      company: "Verlag",
      reach: "Erreichen Sie uns",
      rights: "Alle Rechte vorbehalten.",
      top: "Nach oben",
      about: "Über uns",
      team: "Unser Team",
      amazon: "Auf Amazon veröffentlichen",
      global: "Über die Grenzen",
      shop: "HeryerdeKitap – Buchverkauf",
      blog: "Blog",
      authors: "Unsere Autorinnen & Autoren",
      faq: "Häufige Fragen",
      whatsapp: "WhatsApp",
    },
  },
};

/* ---------------------------------------------------------------------
   BAUSTEINE
   --------------------------------------------------------------------- */

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const attr = (s) => esc(s).replace(/"/g, "&quot;");

const WA_ICON =
  '<svg class="whatsapp-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';

/* aria-current steht nur am Link auf genau diese Seite. Eine Unterseite
   markiert ihren Bereich in der Kopfzeile mit .is-active. */
function link(href, text, here, extra = "") {
  const current = href === here ? ' aria-current="page"' : "";
  return `<a href="${attr(href)}"${extra}${current}>${esc(text)}</a>`;
}

/* Jede Seite nennt sich selbst als kanonisch und verweist per hreflang
   auf beide Fassungen, sich selbst eingeschlossen. x-default ist die
   türkische Fassung -- die Seite ist türkisch, Deutsch ist die Übersetzung. */
function head(page, lang) {
  const [title, description] = META[page.id][lang];
  const abs = (l) => ORIGIN + page[l][1];
  return [
    `<meta charset="UTF-8" />`,
    `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`,
    ...(lang === "de" ? [`<!-- DE: unreviewed -->`] : []),
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${attr(description)}" />`,
    `<link rel="canonical" href="${abs(lang)}" />`,
    `<link rel="alternate" hreflang="tr" href="${abs("tr")}" />`,
    `<link rel="alternate" hreflang="de" href="${abs("de")}" />`,
    `<link rel="alternate" hreflang="x-default" href="${abs("tr")}" />`,
    `<link rel="icon" href="data:," />`,
    `<link rel="stylesheet" href="/styles.css" />`,
    `<script src="/script.js" defer></script>`,
  ];
}

function header(page, lang) {
  const t = TEXT[lang];
  const here = page[lang][1];
  const other = lang === "tr" ? "de" : "tr";
  const home = page.id === "home" ? "#top" : url("home", lang);

  const primary = [
    ["services", url("services", lang), t.nav.services],
    ["about", url("about", lang), t.nav.about],
    ["amazon", url("amazon", lang), t.nav.amazon],
    ["contact", url("contact", lang), t.nav.contact],
  ].map(([section, href, text]) => {
    const active = href !== here && section === page.section ? ' class="is-active"' : "";
    return `    ${link(href, text, here, active)}`;
  });

  // Umschalter: ein Link auf dieselbe Seite in der anderen Sprache.
  const switcher = ["tr", "de"].map((l) => {
    const on = l === lang;
    const cls = on ? ' class="is-on"' : "";
    const cur = on ? ' aria-current="true"' : "";
    return `    <a href="${attr(page[l][1])}" hreflang="${l}" title="${attr(t.langName[l])}"${cls}${cur}>${l.toUpperCase()}</a>`;
  });

  const sub = (href, text) => `          ${link(href, text, here)}`;
  const services = SERVICE_IDS.map((id) => sub(url(id, lang), t.service[id]));

  return [
    `<header class="site-header">`,
    `  <a class="brand" href="${home}" aria-label="${attr(t.brand)}">`,
    `    <img src="/assets/yazar_logo.png" alt="Yazardan Direkt" />`,
    `  </a>`,
    ``,
    `  <nav class="nav-primary" aria-label="${attr(t.menuMain)}">`,
    ...primary,
    `  </nav>`,
    ``,
    `  <nav class="lang-switch" aria-label="${attr(t.langLabel)}">`,
    switcher[0],
    `    <span class="lang-switch-sep" aria-hidden="true"></span>`,
    switcher[1],
    `  </nav>`,
    ``,
    `  <button`,
    `    class="nav-toggle"`,
    `    type="button"`,
    `    aria-expanded="false"`,
    `    aria-controls="nav-panel"`,
    `    aria-label="${attr(t.menuOpen)}"`,
    `    data-label-open="${attr(t.menuOpen)}"`,
    `    data-label-close="${attr(t.menuClose)}"`,
    `  >`,
    `    <span class="nav-toggle-bar" aria-hidden="true"></span>`,
    `    <span class="nav-toggle-bar" aria-hidden="true"></span>`,
    `    <span class="nav-toggle-bar" aria-hidden="true"></span>`,
    `  </button>`,
    `</header>`,
    ``,
    `<!-- Die vollständige Tafel, in der Reihenfolge des Menüs der alten Seite.`,
    `     Heryerdekitap, Blog und Yazarlarımız führen wie dort nach`,
    `     heryerdekitap.com. -->`,
    `<div class="nav-panel" id="nav-panel" hidden>`,
    `  <nav class="nav-full" aria-label="${attr(t.menuAll)}">`,
    `    ${link(url("home", lang), t.nav.home, here)}`,
    `    <div class="nav-branch">`,
    `      ${link(url("services", lang), t.nav.services, here)}`,
    `      <div class="nav-sub">`,
    ...services,
    `      </div>`,
    `    </div>`,
    `    <div class="nav-branch">`,
    `      ${link(url("about", lang), t.nav.about, here)}`,
    `      <div class="nav-sub">`,
    sub(url("about", lang) + "#ekip", t.nav.team),
    `      </div>`,
    `    </div>`,
    `    <div class="nav-branch">`,
    `      ${link(url("amazon", lang), t.nav.amazon, here)}`,
    `      <div class="nav-sub">`,
    sub(url("global", lang), t.nav.global),
    `      </div>`,
    `    </div>`,
    `    ${link(EXTERNAL.shop, t.nav.shop, here)}`,
    `    ${link(EXTERNAL.blog, t.nav.blog, here)}`,
    `    ${link(EXTERNAL.authors, t.nav.authors, here)}`,
    `    <div class="nav-branch">`,
    `      ${link(url("contact", lang), t.nav.contact, here)}`,
    `      <div class="nav-sub">`,
    sub(url("contact", lang) + "#sss", t.nav.faq),
    `      </div>`,
    `    </div>`,
    `  </nav>`,
    `  <p class="nav-credo">${esc(t.credo)}</p>`,
    `  <div class="nav-panel-contact">`,
    `    <a href="tel:+902163011213">+90-0216-301-1213</a>`,
    `    <a href="mailto:info@yazardandirekt.com">info@yazardandirekt.com</a>`,
    `  </div>`,
    `</div>`,
  ];
}

function footer(page, lang) {
  const t = TEXT[lang];
  const f = t.footer;
  const here = page[lang][1];
  const a = (href, text) => `        ${link(href, text, here)}`;
  return [
    `<footer class="site-footer">`,
    `  <div class="wrap">`,
    `    <div class="site-footer-top">`,
    `      <div>`,
    `        <img class="site-footer-logo" src="/assets/yazar_logo.png" alt="Yazardan Direkt" />`,
    `        <p class="site-footer-credo">${esc(f.credo)}</p>`,
    `      </div>`,
    `      <nav class="site-footer-nav" aria-label="${attr(f.services)}">`,
    `        <p class="site-footer-head">${esc(f.services)}</p>`,
    ...SERVICE_IDS.map((id) => a(url(id, lang), t.service[id])),
    `      </nav>`,
    `      <nav class="site-footer-nav" aria-label="${attr(f.company)}">`,
    `        <p class="site-footer-head">${esc(f.company)}</p>`,
    a(url("about", lang), f.about),
    a(url("about", lang) + "#ekip", f.team),
    a(url("amazon", lang), f.amazon),
    a(url("global", lang), f.global),
    a(EXTERNAL.shop, f.shop),
    a(EXTERNAL.blog, f.blog),
    a(EXTERNAL.authors, f.authors),
    a(url("contact", lang) + "#sss", f.faq),
    `      </nav>`,
    `      <div class="site-footer-nav">`,
    `        <p class="site-footer-head">${esc(f.reach)}</p>`,
    `        <a href="tel:+902163011213">+90-0216-301-1213</a>`,
    `        ${PROVISIONAL}`,
    `        <a href="tel:${MOBILE.tel}">${MOBILE.show}</a>`,
    `        <a href="mailto:info@yazardandirekt.com">info@yazardandirekt.com</a>`,
    `        ${PROVISIONAL}`,
    ...(lang === "de" ? [`        <!-- DE: unreviewed -->`] : []),
    `        <a class="whatsapp-link" href="${attr(WHATSAPP)}" rel="noopener">`,
    `          ${WA_ICON}`,
    `          <span>${esc(f.whatsapp)}</span>`,
    `        </a>`,
    `      </div>`,
    `    </div>`,
    `    <div class="site-footer-base">`,
    `      <p>© <span class="site-footer-year">2026</span> Yazardan Direkt. <span>${esc(f.rights)}</span></p>`,
    `      <a href="#top">${esc(f.top)}</a>`,
    `    </div>`,
    `  </div>`,
    `</footer>`,
  ];
}

/* ---------------------------------------------------------------------
   EINSETZEN
   --------------------------------------------------------------------- */

const REGIONS = { head, header, footer };

function fill(html, name, lines, file) {
  const open = `<!-- shell:${name} -->`;
  const close = `<!-- /shell:${name} -->`;
  const a = html.indexOf(open);
  const b = html.indexOf(close);
  if (a < 0 || b < a || html.indexOf(open, a + 1) >= 0) {
    throw new Error(`${file}: Markierung ${open} fehlt, steht doppelt oder falsch herum`);
  }
  // Einrückung von der öffnenden Markierung übernehmen.
  const lineStart = html.lastIndexOf("\n", a) + 1;
  const indent = html.slice(lineStart, a);
  const body = lines.map((l) => (l ? indent + l : "")).join("\n");
  return html.slice(0, a + open.length) + "\n" + body + "\n" + indent + html.slice(b);
}

let changed = 0;
let checked = 0;
for (const page of PAGES) {
  for (const lang of LANGS) {
    const file = page[lang][0];
    const path = join(ROOT, file);
    if (!existsSync(path)) throw new Error(`${file} fehlt`);
    const before = readFileSync(path, "utf8");
    let html = before.replace(/<html lang="[^"]*">/, `<html lang="${lang}">`);
    for (const [name, build] of Object.entries(REGIONS)) html = fill(html, name, build(page, lang), file);
    checked++;
    if (html !== before) {
      changed++;
      if (CHECK) console.log(`weicht ab: ${file}`);
      else writeFileSync(path, html);
    }
  }
}
if (CHECK) {
  console.log(changed ? `${changed} von ${checked} Seiten weichen ab` : `alle ${checked} Seiten stimmen`);
  process.exit(changed ? 1 : 0);
}
console.log(`${checked} Seiten geprüft, ${changed} neu geschrieben`);
