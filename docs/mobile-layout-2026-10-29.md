# Mobile Anpassungen, 29. Oktober 2026

## Sicherer Ausgangsstand

Vor Änderungen war das Arbeitsverzeichnis sauber. Der ursprüngliche Stand ist
Commit `f410d4f`, dauerhaft lokal markiert als `mobile-before-2026-10-29`.
Zusätzlich wurde `/private/tmp/yazar-kuscu-hd-before-mobile-2026-10-29.bundle`
angelegt. Die temporäre Zusatzdatei ist nicht die primäre Sicherung; der Git-Tag
bleibt im Repository erhalten. Zum Zeitpunkt der Sicherung war noch nichts
gepusht oder veröffentlicht. Der Nutzer hat den Push anschließend freigegeben;
der Sicherungs-Tag wurde zusammen mit der Änderung zu origin übertragen.
Die erste veröffentlichte mobile Fassung (`5d56fd0`) ist zusätzlich als
`mobile-v1-2026-10-29` gesichert.

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
- Rechts fünf antippbare Abschnittspunkte in TR, DE und EN; die bestehende
  Fortschrittsleiste oben bleibt bestehen. Keine doppelte Prozentanzeige.
- Möglichst große Buchdarstellung im freien Bereich direkt vor dem aktiven
  Text; eigenes Querformat. Leere Ränder um das stehende Cover können über den
  Bildschirmrand hinausreichen, damit das Buch selbst größer erscheint.
- Getrennte Bereiche für CTAs, Farbauswahl und WhatsApp.
- Farbauswahl in zwei Reihen, Auswahlzustand auch per `aria-pressed`.
- Ein vertikaler Wisch wechselt mobil zum nächsten/vorherigen Buchabschnitt.
  Der letzte Vorwärts-Wisch verlässt die Animation zum normalen Seiteninhalt.
  Horizontale Gesten und Pinch-Zoom werden nicht für Kapitelwechsel verwendet.
  Bei reduzierter Bewegung erfolgen die Sprünge ohne Scrollanimation.
- Die Kapitelpunkte und die Größenanpassung gelten nur bis 900 px Breite; die
  ursprüngliche Desktop-Darstellung und ihr Scrollverhalten bleiben erhalten.
- Mobiles Kontaktformular mit 16-px-Eingaben und innenliegendem Schließenknopf.

Während der Farbauswahl hat die große Buchdarstellung Vorrang. Wenn Buch und
vollständiger Beschreibungstext nicht gemeinsam passen, wird der Absatz
vorübergehend ausgeblendet; Titel, Service-Link und Farben bleiben erreichbar.
Vor und nach der Auswahl ist der Absatz wieder sichtbar; die verlinkte
Leistungsseite enthält die vollständigen Informationen.

## Prüfung

Lokale Browserprüfung in Chrome mit Touch-Emulation; alle drei Sprachen,
11 Bildschirmgrößen von 320 × 568 bis 1440 × 900 px, einschließlich
Querformat und Zwischenhöhen. 165 Szenenprüfungen bestanden. Geprüft werden
Szenenpositionen, Dialog öffnen/schließen, Farbauswahl, Logo vor/zurück und
Navigation über die Abschnittspunkte. Zusätzliche Touch-Tests prüfen Vorwärts-/
Rückwärts-Wischen, horizontale Gesten, den Ausstieg zum normalen Seiteninhalt
und den Wechsel auf Desktop, jeweils mit und ohne reduzierte Bewegung.
Desktop-Screenshots bei 1024 und 1440 px sind bildgleich mit dem ursprünglichen
Stand vor den mobilen Änderungen (`mobile-before-2026-10-29`).
Ein echter iPhone-Safari-Test und eine Formularübermittlung an Netlify sind
hierdurch nicht abgedeckt. Es werden keine Testnachrichten abgeschickt.
