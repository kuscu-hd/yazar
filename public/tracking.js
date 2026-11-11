/* =====================================================================
   GA4-CONVERSIONS: generate_lead und contact_click

   Baut auf consent.js auf und ändert dort nichts. Gesendet wird nur, wenn
   YazarConsent.status() === 'granted' UND window.gtag existiert. Ohne
   Einwilligung passiert nichts, und nichts wird für später aufgehoben.

   generate_lead
     Alle Formulare sind Netlify Forms ohne JavaScript-Versand: der Browser
     schickt sie per POST ab, Netlify leitet bei Erfolg auf die Dankeseite
     aus action weiter (/tesekkurler, /de/danke, /en/thank-you).
     Deshalb zwei Schritte:
       1. "submit" (fällt nur, wenn die Browserprüfung bestanden ist):
          mit Einwilligung ein Merkzeichen in sessionStorage legen --
          Formularname, Ziel (action) und Zeitpunkt. Keine Feldinhalte.
       2. Dankeseite: Merkzeichen lesen und SOFORT löschen. Nur wenn es
          zu dieser Seite gehört, höchstens 10 Minuten alt ist und die
          Einwilligung besteht, geht generate_lead raus -- genau einmal.
          Parameter: form_name und site_language ("language" ist in gtag
          ein reserviertes Feld und käme nicht als Event-Parameter an).
          Direktaufruf, Neuladen, Zurück-Taste: kein Merkzeichen, kein Event.

   contact_click
     Klicks auf tel:, mailto: und WhatsApp-Links (wa.me, api.whatsapp.com).
     Parameter: method (phone | email | whatsapp), link_location und
     site_language.

   KEINE personenbezogenen Daten: weder Feldinhalte noch Nummer oder
   Adresse des angeklickten Links gehen in ein Event.

   Eingebunden im <head> jeder Seite über tools/sync-shell.mjs, NACH
   consent.js:
     <script src="/tracking.js?v=2" defer></script>
   Wer diese Datei ändert, zählt dort ?v= hoch.
   ===================================================================== */

(function () {
  'use strict';

  if (window.YazarTracking) return;

  var FLAG_KEY = 'yazardandirekt:lead';
  var FLAG_MAX_AGE = 10 * 60 * 1000;   /* ms */

  var CONTACT_PAGES = ['/iletisim', '/de/kontakt', '/en/contact'];

  function lang() {
    return (document.documentElement.getAttribute('lang') || 'tr').slice(0, 2).toLowerCase();
  }

  /* "/tesekkurler.html", "/de/" und "/de/index.html" auf eine Form bringen */
  function normPath(path) {
    path = (path || '/').replace(/index\.html$/, '').replace(/\.html$/, '');
    if (path.length > 1) path = path.replace(/\/+$/, '');
    return path || '/';
  }

  function here() { return normPath(window.location.pathname); }

  function canSend() {
    return !!(window.YazarConsent &&
      window.YazarConsent.status() === 'granted' &&
      typeof window.gtag === 'function');
  }

  function send(name, params) {
    if (!canSend()) return false;
    window.gtag('event', name, params);
    return true;
  }

  /* ── generate_lead ─────────────────────────────────────── */

  /* Sprechende Namen statt der Netlify-Namen. Das Formular "iletisim"
     steht auf der Kontaktseite und auf jeder Leistungsseite. */
  function formName(form) {
    var name = form.getAttribute('name') || '';
    if (name === 'hizli-iletisim') return 'schnellkontakt';
    if (name === 'kitap-basvurusu') return 'amazon-anfrage';
    if (name === 'iletisim') {
      return CONTACT_PAGES.indexOf(here()) >= 0 ? 'kontakt' : 'leistungsanfrage';
    }
    return name ? 'sonstiges' : 'unbekannt';
  }

  function storage() {
    try { return window.sessionStorage; } catch (e) { return null; }
  }

  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (!form || form.tagName !== 'FORM' || event.defaultPrevented) return;
    /* Nur Netlify-Formulare (data-netlify wird beim Ausliefern entfernt,
       data-msg-required bleibt -- siehe script.js) */
    if (!form.hasAttribute('data-msg-required') && !form.hasAttribute('data-netlify')) return;
    /* Ohne Einwilligung kein Merkzeichen */
    if (!canSend()) return;
    /* Honigtopf ausgefüllt: ein Bot, kein Lead */
    var honey = form.querySelector('[name="bot-field"]');
    if (honey && honey.value) return;

    var target = normPath(new URL(form.getAttribute('action') || window.location.href, window.location.href).pathname);
    var store = storage();
    if (!store) return;
    try {
      store.setItem(FLAG_KEY, JSON.stringify({
        form_name: formName(form),
        target: target,
        time: Date.now()
      }));
    } catch (e) {}
  });

  function redeemLead() {
    var store = storage();
    if (!store) return;
    var raw;
    try { raw = store.getItem(FLAG_KEY); } catch (e) { return; }
    if (!raw) return;

    var flag = null;
    try { flag = JSON.parse(raw); } catch (e) {}

    /* Löschen, sobald irgendeine eigene Seite lädt: auf der Dankeseite ist
       das das Einlösen, auf jeder anderen Seite war das Absenden offenbar
       nicht erfolgreich (Netlify-Fehler, Zurück-Taste) -- dann darf ein
       späterer Direktaufruf der Dankeseite nicht mehr zählen. So zählt
       jede Anfrage höchstens einmal, und nichts wartet auf später. */
    try { store.removeItem(FLAG_KEY); } catch (e) {}

    if (!flag || flag.target !== here()) return;   /* nicht die Dankeseite dieses Formulars */

    if (typeof flag.time !== 'number' || Date.now() - flag.time > FLAG_MAX_AGE) return;

    send('generate_lead', {
      form_name: String(flag.form_name || 'unbekannt'),
      site_language: lang()
    });
  }

  /* ── contact_click ─────────────────────────────────────── */

  function contactMethod(href) {
    if (/^tel:/i.test(href)) return 'phone';
    if (/^mailto:/i.test(href)) return 'email';
    if (/^https?:\/\/(wa\.me|api\.whatsapp\.com|(www\.)?whatsapp\.com)\//i.test(href)) return 'whatsapp';
    return null;
  }

  function linkLocation(link) {
    if (link.closest('.wa-float')) return 'whatsapp_button';
    if (link.closest('.nav-panel')) return 'menu';
    if (link.closest('.site-header')) return 'header';
    if (link.closest('.site-footer')) return 'footer';
    if (link.closest('dialog')) return 'dialog';
    if (CONTACT_PAGES.indexOf(here()) >= 0) return 'kontaktseite';
    if (link.closest('.contact-strip')) return 'kontaktleiste';      /* Leiste "So erreichen Sie uns" */
    if (link.closest('.contact-list')) return 'kontaktbereich';      /* Block neben dem Formular */
    return 'inhalt';                                                 /* im Fließtext */
  }

  document.addEventListener('click', function (event) {
    var link = event.target && event.target.closest && event.target.closest('a[href]');
    if (!link) return;
    var method = contactMethod(link.getAttribute('href') || '');
    if (!method) return;
    send('contact_click', {
      method: method,
      link_location: linkLocation(link),
      site_language: lang()
    });
  });

  /* ── Start ─────────────────────────────────────────────── */
  /* consent.js steht vor dieser Datei und lädt gtag bei bestehender
     Einwilligung schon beim Ausführen bzw. bei DOMContentLoaded. Deshalb
     hier ebenfalls erst bei DOMContentLoaded einlösen. */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', redeemLead);
  } else {
    redeemLead();
  }
  /* Aus dem Zurück-Cache wiederhergestellte Seiten führen kein Skript
     neu aus -- ein Merkzeichen von dort aus trotzdem verwerfen. */
  window.addEventListener('pageshow', function (event) { if (event.persisted) redeemLead(); });

  window.YazarTracking = { version: 2 };
})();
