# Mobile Anpassungen, 29. Oktober 2026

## Sicherer Ausgangsstand

Vor Änderungen war das Arbeitsverzeichnis sauber. Der ursprüngliche Stand ist
Commit `f410d4f`, dauerhaft lokal markiert als `mobile-before-2026-10-29`.
Zusätzlich wurde `/private/tmp/yazar-kuscu-hd-before-mobile-2026-10-29.bundle`
angelegt. Die temporäre Zusatzdatei ist nicht die primäre Sicherung; der Git-Tag
bleibt im Repository erhalten. Zum Zeitpunkt der Sicherung war noch nichts
gepusht oder veröffentlicht. Der Nutzer hat den Push anschließend freigegeben;
der Sicherungs-Tag wird zusammen mit der Änderung zu origin übertragen.

## Diese Anpassung zurücknehmen

Nur die beiden betroffenen Dateien auf den gesicherten Stand zurücksetzen:

```sh
git restore --source=mobile-before-2026-10-29 -- public/styles.css public/script.js
```

Dies verwirft auch etwaige spätere lokale Änderungen an diesen beiden Dateien.
Daher vor einem späteren Rollback zunächst `git diff` prüfen und neue Arbeiten
sichern. Andere Dateien werden durch diesen Befehl nicht zurückgesetzt.
Eine bereits veröffentlichte Version muss anschließend über den üblichen
Veröffentlichungsweg ersetzt werden; der lokale Befehl verändert die Live-Seite
nicht. Die Rücknahme wird als neuer Commit gepusht, ohne die Git-Historie
umzuschreiben.

## Umfang

- Kompakter mobiler Header, Menü innerhalb des Bildschirms.
- Rechts Scrollhinweis und Fortschritt der Buchanimation in TR, DE und EN.
- An Handybreite und -höhe angepasste Buch-/Textanordnung; eigenes Querformat.
- Getrennte Bereiche für CTAs, Farbauswahl und WhatsApp.
- Farbauswahl in zwei Reihen, Auswahlzustand auch per `aria-pressed`.
- Kein automatisches Einrasten auf Geräten mit Touch-Bedienung.
- Mobiles Kontaktformular mit 16-px-Eingaben und innenliegendem Schließenknopf.

Wenn auf schmalen oder niedrigen Hochformat-Displays der Platz nicht reicht,
wird während der Farbauswahl der beschreibende Absatz kurz ausgeblendet, um
Titel, Service-Link und Farben erreichbar zu halten.
Vor und nach der Auswahl ist der Absatz wieder sichtbar; die verlinkte
Leistungsseite enthält die vollständigen Informationen.

## Prüfung

Lokale Browserprüfung in Chrome mit Touch-Emulation; alle drei Sprachen,
11 Bildschirmgrößen von 320 × 568 bis 1440 × 900 px, einschließlich
Querformat und Zwischenhöhen. 165 Szenenprüfungen bestanden. Geprüft werden
Szenenpositionen,
Dialog öffnen/schließen, Farbauswahl, Logo vor/zurück und Scrollverhalten.
Ein echter iPhone-Safari-Test und eine Formularübermittlung an Netlify sind
hierdurch nicht abgedeckt. Es werden keine Testnachrichten abgeschickt.
