# LCARS — RolandOS Projektverwaltung

## Inhaltsverzeichnis

- [Überblick](#überblick)
- [Start](#start)
- [Tests](#tests)
- [Dokumentation](#dokumentation)

## Überblick

Dieses Repository enthält die LCARS-Projektverwaltung im Stil von Star Trek: The Next Generation. Die Oberfläche ist eine vollständig statische Webanwendung ohne Build-Schritt und ohne externe Abhängigkeiten, mit akustischem Feedback über die WebAudio-API. Alle Projektdaten stammen aus dem zusammengeführten Datenmodell `data/lcars-data.json`, das die Quellen `projektuebersicht_neu`, `settings_auto2025`, den Gedächtnis-Export `roland-gedaechtnis.md` und das Repository `openclaw-2026` ohne Überlappungen und Duplikate vereint.

## Start

Die Seite benötigt einen lokalen Webserver (wegen des `fetch`-Zugriffs auf das Datenmodell). Start mit dem beiliegenden Skript:

    ./start_lcars.sh

Das Skript startet einen Webserver auf Port 8734 im Hintergrund und öffnet die Oberfläche im Standardbrowser. Die Interface-Töne werden nach der ersten Interaktion aktiv (Browser-Richtlinie); im Panel Audio lassen sie sich ein- und ausschalten und in der Lautstärke regeln.

## Tests

Die Testsuite prüft in Chromium die komplette Oberfläche und alle Administrationsfunktionen (Dashboard-Sortierung, Projektdetails, Systemstatus, Logbuch, Konfiguration mit Persistenz und Duplikatabwehr, alle Exporte, Diagnostik, Roter Alarm, Audio) sowie die Abwesenheit von Konsolenfehlern:

    node tests/lcars.test.mjs

## Dokumentation

Die Architektur ist in `docs/architektur.md` beschrieben, die als Standard gesetzten Konventionen und Präferenzen in `docs/roland.md`. Der konsolidierte Gesamtexport aller Projektdaten liegt in `export_md/projekte-gesamt.md`. Die historischen Quelldateien `projektuebersicht_neu.*` und `settings_auto2025.json` bleiben unverändert als Referenz erhalten.
