# Architektur — LCARS RolandOS Projektverwaltung

## Inhaltsverzeichnis

- [Überblick](#überblick)
- [Datenfluss und Quellen](#datenfluss-und-quellen)
- [Verzeichnisstruktur](#verzeichnisstruktur)
- [Komponenten](#komponenten)
- [Administrationsfunktionen](#administrationsfunktionen)
- [Sound-System](#sound-system)
- [Qualitätssicherung](#qualitätssicherung)

## Überblick

Das System ist eine vollständig statische Webanwendung ohne Build-Schritt und ohne externe Abhängigkeiten. Die Oberfläche bildet das LCARS-Interface (Library Computer Access/Retrieval System) aus Star Trek: The Next Generation so genau wie möglich nach: schwarzer Hintergrund, Okudagramm-Farbpalette (Orange, Peach, Lilac, Violet), Elbow-Bögen in Kopf- und Fußleiste, Seitenleiste aus farbigen Blocktasten mit rechtsbündiger Beschriftung, Großbuchstaben-Typografie in kondensierter Schrift sowie akustisches Feedback auf jede Interaktion.

## Datenfluss und Quellen

Die einzige Datenquelle zur Laufzeit ist die Datei `data/lcars-data.json`. Sie ist das Ergebnis der Zusammenführung aller aufgefundenen Projektdatenquellen, ohne Überlappungen und ohne Duplikate. Bei inhaltlichen Konflikten gewinnt die jeweils neueste Quelle.

| Quelle | Herkunft | Stand |
|---|---|---|
| A | `projektuebersicht_neu.json` / `.md` (Repo dizir71/Projekte) | 2025-05-09 |
| B | `settings_auto2025.json` (Repo dizir71/Projekte) | 2025-05-09 |
| C | `roland-gedaechtnis.md` (Google Drive, Gedächtnis-Export) | 2026-05-04 |
| D | Repo `dizir71/openclaw-2026` | 2026-05-04 |

Zusammengeführte (vormals überlappende) Projekte: Schweizerhof am See (A+C), The-Center.net (A+C), auto2025/SUV-Dashboard (A+B+C), OCR-Projekt/OCR-Webinterface (A+C), Job-Suche Wien/JobFinder v3 (A+C). Jeder Eintrag trägt seine Quellenkennungen im Feld `quellen`.

Der Abgleich mit dem lokalen Verzeichnis `/Users/user/Projects/RolandOS` (insbesondere `export_md/export_15072026_RolandOS_LCARSv3.md`) steht aus, bis dieses Verzeichnis über GitHub oder Google Drive bereitgestellt wird; die Zusammenführungslogik (Quellenkennung, Neueste-Quelle-gewinnt, Duplikatprüfung über Projekt-IDs) ist dafür vorbereitet.

## Verzeichnisstruktur

    Projekte/
    ├── index.html              Einstiegspunkt, LCARS-Rahmenlayout
    ├── css/
    │   └── lcars.css           LCARS-Design (Farben, Elbows, Panels, Roter Alarm)
    ├── js/
    │   ├── lcars-sound.js      WebAudio-Sound-Engine (synthetisierte Töne)
    │   └── lcars-app.js        Hauptanwendung, alle Panels und Admin-Funktionen
    ├── data/
    │   └── lcars-data.json     Zusammengeführtes Datenmodell (Quellen A–D)
    ├── docs/
    │   ├── architektur.md      Dieses Dokument
    │   └── roland.md           Standards, Konventionen und Präferenzen
    ├── export_md/
    │   └── projekte-gesamt.md  Konsolidierter Markdown-Gesamtexport
    ├── tests/
    │   └── lcars.test.mjs      Playwright-Testsuite (Loop bis fehlerfrei)
    └── start_lcars.sh          Startet lokalen Webserver und öffnet die Seite

## Komponenten

Die Anwendung besteht aus drei Schichten. `index.html` liefert das statische LCARS-Rahmenlayout (Kopfleiste mit Elbow, Seitenleiste, Inhaltsbereich, Fußleiste). `js/lcars-app.js` lädt das Datenmodell per `fetch`, rendert alle Panels DOM-basiert (keine Templates, kein Framework) und führt das Logbuch. `js/lcars-sound.js` kapselt die WebAudio-API; der AudioContext wird bei der ersten Nutzerinteraktion aktiviert (Browser-Autoplay-Richtlinie).

## Administrationsfunktionen

| Panel | Funktion |
|---|---|
| Dashboard | Projektübersicht, Sortierung per Spaltenkopf nach Name/Status/Kategorie, kein Suchfeld (Vorgabe aus Quelle C) |
| Projektdetails | Vollständige Darstellung aller Projektdaten inklusive Quellenvermerk |
| Systemstatus | Ampelanzeige grün/gelb/rot je Subsystem, Systemumgebung, Roter Alarm |
| Logbuch | Laufendes Ereignisprotokoll mit Zeitstempel Europe/Vienna, Download, Leeren |
| Konfiguration | Crawler-Intervall, Maximalpreis, Antriebe, Einträge pro Seite (5/10/50), sichtbare Spalten, Anbieter hinzufügen/entfernen mit Duplikatprüfung; Persistenz in localStorage |
| Konventionen | Alle Konventionen, Regeln und Präferenzen aus dem Gedächtnis-Export |
| Datenexport | Download als JSON, Markdown und ZIP mit Pfadangabe (eigener Store-ZIP-Writer, CRC32) |
| Diagnostik | Selbsttest: Datenintegrität, Duplikatfreiheit, Pflichtfelder, Quellenverweise, Renderbarkeit aller Panels, Sound-Engine, Konfigurationsspeicher, ZIP-Generator |
| Audio | Töne an/aus, Lautstärke, Testtöne |

## Sound-System

Alle Töne werden zur Laufzeit über die WebAudio-API synthetisiert; es gibt keine Audiodateien und keine externen Ressourcen. Tonvokabular: Hover-Blip (1,4 kHz), Zwei-Ton-Bestätigung (880/1320 Hz), aufsteigender Panelwechsel-Sweep, absteigender Verweigerungs-Doppelton, Erfolgs-Trill sowie ein Sägezahn-Klaxon-Zyklus für den Roten Alarm.

## Qualitätssicherung

`tests/lcars.test.mjs` startet einen lokalen Webserver, lädt die Seite in Chromium (Playwright) und prüft in einer Schleife bis zur Fehlerfreiheit: Laden ohne Konsolenfehler, Rendern aller Panels, Sortierung, Konfigurationspersistenz, Anbieter-Hinzufügen inklusive Duplikatabwehr, alle Export-Downloads, vollständige Diagnostik mit Ergebnis „alle Systeme betriebsbereit" sowie Roter Alarm an/aus.
