/* =====================================================================
   COOKIE-EINWILLIGUNG UND GOOGLE ANALYTICS 4

   Logik übernommen von avkus.de (assets/js/consent.js). Geändert sind nur
   Mess-ID, Speicherschlüssel, Texte in drei Sprachen und Pfade -- dazu vier
   Abweichungen, die die Vorgaben für diese Seite verlangen:
     - der Banner erscheint sofort bei DOMContentLoaded, nicht erst nach
       "load" plus Verzögerung;
     - beide Knöpfe sehen gleich aus (avkus: "Akzeptieren" gefüllt);
     - wird nach einer Zustimmung auf derselben Seite widerrufen, bekommt das
       schon geladene gtag ein consent-update auf "denied", damit es bis zum
       nächsten Seitenwechsel keine Cookies neu setzt;
     - "Cookie-Einstellungen"-Links brauchen kein onclick: jedes Element mit
       data-consent-settings öffnet den Banner (später eine CSP ohne
       'unsafe-inline' möglich).

   gtag.js steht in KEINER Seite. Es wird ausschließlich hier nachgeladen,
   und zwar erst nach "Kabul et" / "Akzeptieren" / "Accept". Vorher geht
   keine einzige Anfrage an Google, auch kein cookieloser Ping.

   Eingebunden im <head> jeder Seite über tools/sync-shell.mjs:
     <script src="/consent.js?v=2" defer></script>
   Wer diese Datei ändert, zählt dort ?v= hoch (Browser-Cache).

   Öffentliche Schnittstelle:
     YazarConsent.status()   -> 'granted' | 'denied' | null
     YazarConsent.show()     -> Banner erneut zeigen
     YazarConsent.reset()    -> Entscheidung verwerfen, GA-Cookies löschen,
                                neu fragen (das tun die Footer-Links)
   ===================================================================== */

(function () {
  'use strict';

  var GA_ID          = 'G-416G4JPBKV';
  var STORAGE_KEY    = 'yazardandirekt:consent';
  var POLICY_VERSION = 1;          /* hochzählen -> alle werden erneut gefragt */

  if (window.YazarConsent) return;  /* doppelte Einbindung abfangen */

  /* ── Sprache und Texte ─────────────────────────────────
     <html lang> setzt tools/sync-shell.mjs auf jeder Seite. */
  var TEXT = {
    tr: {
      title: 'Gizlilik',
      body: 'Bu sitenin nasıl kullanıldığını anlamak ve geliştirmek için Google Analytics kullanmak istiyoruz. ' +
        'Bu yalnızca onayınızla gerçekleşir — reddederseniz hiçbir Google hizmeti yüklenmez. ' +
        'Kararınızı istediğiniz zaman sayfanın altındaki “Çerez Ayarları” bağlantısından ya da ' +
        '{link} sayfasından değiştirebilirsiniz.',
      link: 'Gizlilik Politikası',
      privacy: '/gizlilik-ve-guvenlik-politikasi',
      decline: 'Reddet',
      accept: 'Kabul et'
    },
    de: {
      title: 'Datenschutz',
      body: 'Wir möchten Google Analytics einsetzen, um die Nutzung dieser Website zu verstehen und sie zu verbessern. ' +
        'Das geschieht nur mit Ihrer Einwilligung — bei Ablehnung wird kein Google-Dienst geladen. ' +
        'Ihre Entscheidung können Sie jederzeit über „Cookie-Einstellungen“ unten auf der Seite oder in der ' +
        '{link} ändern.',
      link: 'Datenschutzerklärung',
      privacy: '/de/datenschutz-und-sicherheit',
      decline: 'Ablehnen',
      accept: 'Akzeptieren'
    },
    en: {
      title: 'Privacy',
      body: 'We would like to use Google Analytics to understand how this website is used and to improve it. ' +
        'This only happens with your consent — if you decline, no Google service is loaded. ' +
        'You can change your decision at any time via “Cookie Settings” at the bottom of the page or in our ' +
        '{link}.',
      link: 'Privacy Policy',
      privacy: '/en/privacy-policy',
      decline: 'Decline',
      accept: 'Accept'
    }
  };

  var lang = (document.documentElement.getAttribute('lang') || 'tr').slice(0, 2).toLowerCase();
  var T = TEXT[lang] || TEXT.tr;

  /* ── Speicher ────────────────────────────────────────────
     localStorage kann blockiert sein (Privatmodus, Cookie-
     Sperren). Dann wird nur für die Sitzung gemerkt.         */
  var fallback = null;

  function readRaw() {
    try { return window.localStorage.getItem(STORAGE_KEY); }
    catch (e) { return fallback; }
  }

  function writeRaw(value) {
    try { window.localStorage.setItem(STORAGE_KEY, value); }
    catch (e) { fallback = value; }
  }

  function clearRaw() {
    fallback = null;
    try { window.localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  function status() {
    var raw = readRaw();
    if (!raw) return null;
    var data;
    try { data = JSON.parse(raw); } catch (e) { return null; }
    if (!data || data.version !== POLICY_VERSION) return null;
    return data.status === 'granted' || data.status === 'denied' ? data.status : null;
  }

  function remember(value) {
    writeRaw(JSON.stringify({
      status: value,
      version: POLICY_VERSION,
      date: new Date().toISOString()
    }));
  }

  /* ── Google Analytics 4 ──────────────────────────────────
     Wird ausschließlich hier geladen — bei Ablehnung wird
     kein Google-Skript angefragt und kein Cookie gesetzt.    */
  var analyticsLoaded = false;

  function loadAnalytics() {
    if (analyticsLoaded) {
      /* Auf derselben Seite erst widerrufen, dann wieder zugestimmt */
      window.gtag('consent', 'update', { analytics_storage: 'granted' });
      return;
    }
    analyticsLoaded = true;

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;

    /* Consent Mode v2: alles verweigert, nur Analytics freigegeben */
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied'
    });
    gtag('consent', 'update', { analytics_storage: 'granted' });

    gtag('js', new Date());
    /* GA4 kürzt IP-Adressen grundsätzlich; anonymize_ip wird ignoriert
       und ist hier nur als ausdrückliche Absichtserklärung gesetzt.
       cookie_expires: 36720000 s = 425 Tage = 14 Monate (statt 2 Jahre),
       so steht es in der Datenschutzerklärung. */
    gtag('config', GA_ID, { anonymize_ip: true, cookie_expires: 36720000 });

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(script);
  }

  /* Ein schon geladenes gtag anhalten (Widerruf ohne Seitenwechsel) */
  function stopAnalytics() {
    if (analyticsLoaded && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: 'denied' });
    }
  }

  /* Bei Ablehnung und nach Widerruf verbliebene GA-Cookies entfernen */
  function dropAnalyticsCookies() {
    var host = window.location.hostname;
    var domains = ['', host, '.' + host];
    var parts = host.split('.');
    if (parts.length > 2) domains.push('.' + parts.slice(-2).join('.'));

    document.cookie.split(';').forEach(function (entry) {
      var name = entry.split('=')[0].trim();
      if (!/^(_ga|_gid|_gat)/.test(name)) return;
      domains.forEach(function (domain) {
        document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT' +
          (domain ? '; domain=' + domain : '');
      });
    });
  }

  /* ── Styles ──────────────────────────────────────────────
     Farben und Schrift wie die Fußzeile (styles.css: --ink,
     --ink-on-dark, --gold, --sans). Beide Knöpfe gleich groß
     und gleich gestaltet — keiner ist hervorgehoben.         */
  var CSS = [
    '.yd-cc{position:fixed;left:0;right:0;bottom:0;z-index:9000;',
    'background:#16121a;border-top:1px solid rgba(244,241,238,.16);',
    'box-shadow:0 -8px 32px rgba(22,18,26,.28);',
    'font-family:Inter,Satoshi,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#f4f1ee;',
    'transform:translateY(110%);transition:transform 520ms cubic-bezier(.16,1,.3,1)}',

    '.yd-cc.is-open{transform:translateY(0)}',

    '.yd-cc__inner{max-width:1280px;margin:0 auto;',
    'padding:22px clamp(20px,5vw,72px);padding-bottom:max(22px,env(safe-area-inset-bottom));',
    'display:flex;align-items:center;gap:clamp(20px,4vw,48px);flex-wrap:wrap}',

    '.yd-cc__text{flex:1 1 380px;min-width:0}',

    '.yd-cc__eyebrow{display:flex;align-items:center;gap:10px;',
    'font-size:10px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;',
    'color:#d9a527;margin:0 0 8px}',
    ".yd-cc__eyebrow::before{content:'';display:block;width:26px;height:1px;background:currentColor}",

    '.yd-cc__body{margin:0;font-size:14.5px;line-height:1.6;',
    'color:rgba(244,241,238,.86);max-width:78ch}',

    '.yd-cc__link{color:#f4f1ee;text-decoration:underline;text-underline-offset:3px}',
    '.yd-cc__link:hover{color:#d9a527}',

    '.yd-cc__actions{display:grid;grid-template-columns:1fr 1fr;gap:12px;flex:0 0 auto}',

    '.yd-cc__btn{font-family:inherit;font-size:12px;font-weight:600;',
    'letter-spacing:.1em;text-transform:uppercase;padding:13px 26px;min-width:9.5em;',
    'border:2px solid #f4f1ee;border-radius:0;cursor:pointer;white-space:nowrap;',
    'background:transparent;color:#f4f1ee;text-align:center;',
    'transition:background-color 250ms cubic-bezier(0,0,.2,1),color 250ms cubic-bezier(0,0,.2,1),',
    'transform 150ms cubic-bezier(0,0,.2,1)}',
    '.yd-cc__btn:hover{background:#f4f1ee;color:#16121a}',
    '.yd-cc__btn:active{transform:scale(.98)}',
    '.yd-cc__btn:focus-visible{outline:2px solid #d9a527;outline-offset:3px}',

    '@media (max-width:720px){',
    '.yd-cc__inner{padding:20px clamp(20px,5vw,72px);padding-bottom:max(20px,env(safe-area-inset-bottom));gap:18px}',
    '.yd-cc__actions{width:100%}',
    '.yd-cc__btn{min-width:0;padding:14px 12px}}',

    '@media (prefers-reduced-motion:reduce){',
    '.yd-cc{transition:none}.yd-cc__btn{transition:none}}'
  ].join('');

  function injectStyles() {
    if (document.getElementById('yd-cc-styles')) return;
    var style = document.createElement('style');
    style.id = 'yd-cc-styles';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  /* ── Banner ──────────────────────────────────────────────*/
  var banner = null;

  function buildBanner() {
    injectStyles();

    var el = document.createElement('aside');
    el.className = 'yd-cc';
    el.id = 'yd-cc';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'false');
    el.setAttribute('aria-labelledby', 'yd-cc-title');
    el.setAttribute('aria-describedby', 'yd-cc-desc');
    el.setAttribute('tabindex', '-1');

    var link = '<a class="yd-cc__link" href="' + T.privacy + '">' + T.link + '</a>';

    el.innerHTML =
      '<div class="yd-cc__inner">' +
        '<div class="yd-cc__text">' +
          '<p class="yd-cc__eyebrow" id="yd-cc-title">' + T.title + '</p>' +
          '<p class="yd-cc__body" id="yd-cc-desc">' + T.body.replace('{link}', link) + '</p>' +
        '</div>' +
        '<div class="yd-cc__actions">' +
          '<button type="button" class="yd-cc__btn" data-yd-cc="decline">' + T.decline + '</button>' +
          '<button type="button" class="yd-cc__btn" data-yd-cc="accept">' + T.accept + '</button>' +
        '</div>' +
      '</div>';

    el.querySelector('[data-yd-cc="accept"]').addEventListener('click', function () { decide('granted'); });
    el.querySelector('[data-yd-cc="decline"]').addEventListener('click', function () { decide('denied'); });

    document.body.appendChild(el);
    return el;
  }

  function show(focus) {
    if (!banner) banner = buildBanner();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        banner.classList.add('is-open');
        if (focus) banner.focus();
      });
    });
  }

  function hide() {
    if (!banner) return;
    var el = banner;
    banner = null;
    el.classList.remove('is-open');
    var done = false;
    var remove = function () {
      if (done) return;
      done = true;
      if (el.parentNode) el.parentNode.removeChild(el);
    };
    el.addEventListener('transitionend', remove, { once: true });
    setTimeout(remove, 700);   /* Fallback, falls keine Transition läuft */
  }

  function decide(value) {
    remember(value);
    if (value === 'granted') loadAnalytics();
    else { stopAnalytics(); dropAnalyticsCookies(); }
    hide();
  }

  function reset() {
    clearRaw();
    stopAnalytics();
    dropAnalyticsCookies();
    if (!banner) show(true);
  }

  /* "Cookie-Einstellungen" / "Çerez Ayarları" / "Cookie Settings":
     Fußzeile jeder Seite und Datenschutzerklärung. Ohne JavaScript führt
     der Link auf die Datenschutzerklärung, mit JavaScript öffnet er den
     Banner. */
  document.addEventListener('click', function (event) {
    var target = event.target && event.target.closest && event.target.closest('[data-consent-settings]');
    if (!target) return;
    event.preventDefault();
    reset();
  });

  /* ── Start ───────────────────────────────────────────────*/
  function init() {
    var current = status();

    if (current === 'granted') { loadAnalytics(); return; }
    if (current === 'denied')  { return; }

    /* Noch keine Entscheidung: Banner sofort zeigen */
    show(false);
  }

  window.YazarConsent = {
    status: status,
    accept: function () { decide('granted'); },
    decline: function () { decide('denied'); },
    show: function () { if (!banner) show(true); },
    reset: reset
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
