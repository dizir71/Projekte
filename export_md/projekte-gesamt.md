# LCARS Projektverwaltung Roland Simmer

Konsolidierter Gesamtexport, erzeugt am 2026-07-15 aus folgenden Quellen:

- **A**: projektuebersicht_neu.json / .md (Repo dizir71/Projekte, 2025-05-09)
- **B**: settings_auto2025.json (Repo dizir71/Projekte, 2025-05-09)
- **C**: roland-gedaechtnis.md (Google Drive, Export 2026-05-04)
- **D**: Repo dizir71/openclaw-2026 (Stand 2026-05-04)

Homogener Zusammenschluss aller gefundenen Datenquellen ohne Duplikate. Überlappende Projekte (Schweizerhof, The-Center.net, auto2025/SUV-Dashboard, OCR, Job-Suche/JobFinder) wurden zu je einem Eintrag zusammengeführt; bei Konflikten gilt die neueste Quelle (C).

## Projekte

### Schweizerhof am See

Status: aktiv · Kategorie: Web · Quellen: A, C · Domain: www.schweizerhof-am-see.at

```json
{
  "struktur": [
    "Galerie nur auf Startseite",
    "Separater Menüpunkt 'Galerie' unter 'Unterkunft'",
    "Headerhöhe: 40px",
    "Logo doppelt so groß mit Weiß-Glühen",
    "Designfarben: Blau, harmonisch",
    "Stil: Alpine, modern, kontrastreich",
    "Responsives Layout, animierter Hintergrund (Blautöne)",
    "Buchungsbutton stilvoll",
    "Responsive Hamburger-Navigation mit Menü-Button neben dem Logo auf mobilen Geräten"
  ],
  "constraints": "Nur override.css, nur jQuery 3.1.1, kein Template- oder Head-Zugriff",
  "bilderpfad": "/userdaten/customerData/11417/slideshow/gallerie/",
  "galerie": "UniteGallery oder FancyBox",
  "warhammer": "Nur echter Content im Unterordner kunst/warhammer/",
  "hotelvertragsbedingungen_2025": "Überarbeitete AGBH 2006 mit Deckblatt und Logo, gültig ab 2025: §4.1 Ankunft 15:00, §4.3 Abreise 11:00, §5.3 von 3 Monaten auf 1 Monat, §5.5–5.8 neue Stornierungsregeln. Layout: Helvetica Bold Überschriften, Georgia Fließtext, Dunkelblau als Akzent"
}
```

### The-Center.net

Status: aktiv · Kategorie: Web · Quellen: A, C · Domain: the-center.net (früher online-web.com)

```json
{
  "fokus": "CMS-Entwicklung (TYPO3, Python, HTML5), Sicherheit, Mittelstand",
  "ci": {
    "logo": "Minimalistisch, nur Buchstaben 'TCN'; Gelb erscheint auch im C-Symbol; dreifarbiges C (Blau, Gelb, Türkis)",
    "designfarben": "Dunkelblau, dunkles Gelb, Türkis",
    "logo_sw": "Muss in Schwarzweiß stark wirken",
    "stil": "Apfel-/Uhr-Stil mit Rostrot als Akzentfarbe"
  },
  "technik": [
    "TYPO3-Sitepackage + statische HTML-Version",
    "Demo basiert auf demo.typo3.org",
    "Barrierefrei nach WCAG (Pflicht)",
    "App mit automatisierten Tests, GitHub (dizir71), Updates alle 10 Min"
  ]
}
```

### auto2025 (SUV-Dashboard)

Status: aktiv · Kategorie: Dashboard · Quellen: A, B, C

```json
{
  "ziel": "Große Hunde, SUV mit Platz, tiefer Ladekante, AHK, evtl. Sitzbelüftung",
  "marken": [
    "Porsche",
    "Mercedes ML",
    "Lexus",
    "VW",
    "Skoda"
  ],
  "ausschluss": [
    "BMW"
  ],
  "crawler": {
    "intervall_minuten": 30,
    "livefeed": "angebote.json",
    "max_preis": 30000,
    "antriebe": [
      "Benzin",
      "Elektro",
      "Hybrid",
      "Diesel"
    ],
    "admin_konfigurierbar": true,
    "crawler_pfad": "/run/suv_crawler/"
  },
  "plattformen": [
    "mobile.de",
    "autoscout24.de",
    "willhaben.at",
    "heycar.de",
    "carwow.de",
    "autohero.de",
    "autouncle.de",
    "pkw.de",
    "auto1.com",
    "autotrader",
    "autoservice.de",
    "autovermarktung.de",
    "car-universe.de",
    "autohaus24.de",
    "gebrauchtwagen.at",
    "autoscout24.at",
    "bazar.at",
    "gebrauchtwagen-markt.at",
    "12gebrauchtwagen.de"
  ],
  "server": {
    "domain": "www.schweizerhof-am-see.at",
    "ssh_host": "host25.duckdns.org",
    "ftp_pfad": "/www/AI/",
    "web_pfade": {
      "daten": "AI/data/angebote.json",
      "dashboard": "AI/dashboard/index.html",
      "admin": "AI/admin/index.html",
      "assets": "AI/assets/"
    }
  },
  "dashboard": {
    "standard_sortierung": "ez",
    "eintraege_pro_seite": 10,
    "eintraege_optionen": [
      5,
      10,
      50
    ],
    "sichtbare_spalten": [
      "fahrzeug",
      "preis",
      "ez",
      "km",
      "antrieb",
      "bewertung"
    ],
    "funktionen": [
      "Admin-Modul mit Statusanzeige (grün/gelb/rot) + Logs",
      "Spaltenanzeige und Sortierung konfigurierbar",
      "Pagination mit Seitenwahl",
      "ZIP-Ausgabe mit Pfadangabe",
      "Filter aktiviert",
      "Admin-Funktion zum Hinzufügen weiterer Autoanbieter/Plattformen"
    ]
  }
}
```

### OCR-Projekt / OCR-Webinterface

Status: aktiv · Kategorie: Automatisierung · Quellen: A, C

```json
{
  "technik": "Tesseract, Vue.js/React",
  "zugriff": "/home/user/scans + Google Drive",
  "funktionen": [
    "Automatisches Scannen bestimmter Verzeichnisse, erkannte Texte im selben Verzeichnis gespeichert",
    "Zentraler Index im Stammverzeichnis: analysiert alle Dokumente, sortiert nach Thema, durchsuchbar, beantwortet inhaltliche Fragen"
  ]
}
```

### Ernährungsdatenbank

Status: aktiv · Kategorie: Daten · Quellen: A, C

```json
{
  "fokus": "Zuckerarten, Glykämie, Mikronährstoffe (keine Kalorien)",
  "update": "Automatisch alle 4 Monate",
  "quellenabgleich": "Offizielle/wissenschaftliche Quellen, Abgleich mit mindestens 2 weiteren Quellen",
  "funktionen": "Filter nach Zubereitung, Diät, Allergien, Exklusion"
}
```

### JobFinder v3 (Job-Suche Wien)

Status: aktiv · Kategorie: App · Quellen: A, C

```json
{
  "app": "Flask-App unter ~/Desktop/Github/jobfinder_v3/, Port 5056, ZSH, Python-venv, ANTHROPIC_API_KEY in ~/.zshrc, Start via Jobfinder.command",
  "suche": {
    "ort": "Wien",
    "art": "Vollzeit, sofort bewerbbar",
    "radius": "10–35 km",
    "ausschluesse": [
      "Sozialarbeit",
      "Erwachsenenbildung",
      "Eventmanagement"
    ],
    "erwuenscht": [
      "Migration",
      "Kommunikation",
      "Politik",
      "Beratung",
      "Arbeits-/Mietrecht",
      "internationale Zusammenarbeit"
    ]
  },
  "funktionen": [
    "Drei Foto-Slots; CV und Fotos persistent in data/profile.json",
    "Inserat-Upload mit OCR und Claude",
    "Firmencrawler via Overpass API mit 7-Tage-Cache",
    "Alle 400+ Firmen A–Z mit und ohne Stellenanzeigen",
    "Vorschau-Panel nur wenn Inhalt vorhanden",
    "Positionen und Quellen per Checkbox wählbar"
  ],
  "ui": "Blau (Jobsuche), Grün (Bewerbung), Violett (Crawler), Amber (Archiv); Sub-Tabs in helleren Varianten, Sub-Sub-Tabs noch heller"
}
```

### YUMY (Aktien-Dashboard)

Status: aktiv · Kategorie: Dashboard · Quellen: C

```json
{
  "architektur": "Einheitliches Dashboard ohne separates Frontend/Backend; alles läuft lokal als eine Flask-App (zentrale Datei: aktien.py)",
  "speicherung": "SQLite statt CSV, inklusive historischer Daten",
  "daten": "Preisdaten je Aktie via Twelve Data API, gespeichert für 12 Monate, Weboberfläche zeigt die letzten 30 Tage",
  "funktionen": [
    "Neue Aktien über die Oberfläche hinzufügbar"
  ]
}
```

### Google Drive Auto-Organizer

Status: aktiv · Kategorie: Automatisierung · Quellen: C

```json
{
  "technik": "Dateioperationen über Claude's MCP-Server-Integration (gdrive MCP, keine direkten API-Keys)",
  "workflow": "Scan → KI-Analyse → Vorschau → Bestätigen → Ausführen",
  "funktionen": [
    "Pro Themenordner wird eine zusammenfassung.md angelegt"
  ]
}
```

### Projekte-Archive

Status: aktiv · Kategorie: Infrastruktur · Quellen: C

```json
{
  "beschreibung": "GitHub-Repository für archivierte Projektübersichten",
  "struktur": [
    "/json/",
    "/pdf/",
    "/md/",
    "/zip/"
  ],
  "funktionen": [
    "Automatische Commits und Uploads"
  ]
}
```

### Lokaler MCP-Server

Status: aktiv · Kategorie: Infrastruktur · Quellen: C

```json
{
  "basis": "YouTube-Video 'How I build Agentic MCP Servers for Claude Code' von IndyDevDan (02.06.2025)",
  "funktionen": [
    "Tool-Kombinationen",
    "MCP-Prompts",
    "Automatisierte Workflows",
    "Claude Code Integration"
  ]
}
```

### Cron-Manager

Status: aktiv · Kategorie: Automatisierung · Quellen: C

```json
{
  "beschreibung": "Cron-Manager mit Log-Viewer, gespeichert im Haupt-Git-Verzeichnis ~/Desktop/GitHub/"
}
```

### Daily GitHub Push

Status: aktiv · Kategorie: Automatisierung · Quellen: C

```json
{
  "beschreibung": "Täglicher Cron-Job um 02:00 Uhr, der automatisch das gesamte Verzeichnis ~/Desktop/GitHub auf den jeweiligen main-Branch pusht"
}
```

### Intelligentes Skript-Management

Status: aktiv · Kategorie: Automatisierung · Quellen: C

```json
{
  "beschreibung": "Neue Skripte in ~/info/scripts werden automatisch erkannt, mit chmod +x ausführbar gemacht, mit Beschreibung in README.md eingetragen, via SSH zu GitHub dizir71 synchronisiert und optional automatisch gestartet"
}
```

### Zentraler .env-Speicher (Server cont)

Status: aktiv · Kategorie: Infrastruktur · Quellen: C

```json
{
  "beschreibung": "Alle .env-Daten zentral auf dem externen Server ssh cont in ~/Info, nur für berechtigte Nutzer, durch separate Berechtigungsdatei geschützt, nicht direkt in Skripte eingebettet"
}
```

### iTerm2/ZSH/Powerlevel10k-Konfigurationstrennung

Status: aktiv · Kategorie: Infrastruktur · Quellen: C

```json
{
  "beschreibung": "Alle individuellen Einstellungen für iTerm2, ZSH, Prompt und Powerlevel10k in separatem Verzeichnis (iTerm2 crasht regelmäßig bei ~/Desktop/GitHub/ als Arbeitsverzeichnis). SSH-Login-Profil für cont im unteren rechten Pane von WezTerm"
}
```

### OpenClaw 2026

Status: aktiv · Kategorie: Infrastruktur · Quellen: D

```json
{
  "repo": "dizir71/openclaw-2026 (privat)",
  "komponenten": [
    "OpenClaw Manager (Node, manager/server.mjs)",
    "Docker-Stack (docker-compose)",
    "Whisper-Service (Docker)",
    "Skripte: Stack-Control, Speech-Stack, Dashboard, Cleanup"
  ]
}
```

## Konventionen

- **Zeitanzeige** (Quellen: C): Jede Antwort beginnt mit der aktuellen Uhrzeit (Europe/Vienna, Quelle angeben). Vom Nutzer angegebene Zeit wird neue Referenzzeit
- **Speicherwarnungen** (Quellen: C): Rechtzeitige Warnung vor vollem Chat-Speicher, damit ein Backup erstellt werden kann
- **Lebensmitteldaten** (Quellen: C): Neue Lebensmittel automatisch aus offiziellen/wissenschaftlichen Quellen, Abgleich mit mindestens zwei weiteren Quellen
- **Skript-Speicherorte** (Quellen: C): Nicht-Projektskripte nach ~/Desktop/GitHub/scripts/. Global gültige nach ~/global/. Allgemeine nach /info/scripts/ (nach Thema sortiert, macOS+Linux, SSH-Sync zu GitHub dizir71). Alle Skripte chmod +x. Python-Skripte immer mit venv
- **Zentrales Verzeichnis ~/info/** (Quellen: C): Zentraler Speicher für Skripte, Scan-Ergebnisse, Logs und Systemdaten, synchronisiert zwischen MacBook Pro und iMac
- **Easybooking/TYPO3** (Quellen: A, C): Skripte nur in HTML-Inhaltselementen vom Typ 'HTML'. CSS ausschließlich via override.css — immer vollständig ausgeben, keine Fragmente. Nur jQuery 3.1.1. Kein Template- oder Head-Zugriff
- **Rechtsdokumente** (Quellen: C): Höchste Formatierungsgenauigkeit nach CI: Georgia (Fließtext), Helvetica Bold (Überschriften), Farben, Einrückungen, Zeilenabstände. Fehlerhafte oder unvollständige Ausgaben nicht akzeptabel
- **README und Dokumentation** (Quellen: C): Kein Copy-/Code-Box-Stil. Gültiges Markdown als Fließtext, Inhaltsverzeichnis mit internen Links, vollständige Inhalte, Code in Courier Monospace, Verzeichnisbäume in Monospace mit Baumsymbolen, keine Abkürzungen/Auslassungen
- **Gemeinderatsanfragen** (Quellen: C): Word-Template: Arial 12 pt, Zeilenabstand 1,0, Absatzabstand 0/2 pt, Kapitelüberschriften fett+unterstrichen mit Trennlinie, Nummerierungsebenen 2/3/4 cm, hängender Einzug 0,5 cm
- **LaTeX-CV** (Quellen: C): Code-Blöcke mit nummerierten Abschnitts-Tags ([G1], [E1], [A1], [S1], [S2]). Feste Unterstreichungslänge via \SecRuleLen. Datumsboxen mit 0,8pt-Lichthof konsistent in \cvevent und \cvmetaevent
- **Markdown** (Quellen: C): <span style="..."> nur in .md-Ausgaben, nicht im normalen Chat
- **Code- und Befehlsausgaben** (Quellen: C): Reiner Text, keine Code-Boxen, Courier Sans, 1 cm eingerückt
- **Datei-Operationen** (Quellen: C): Anweisungen zum Speichern, Erstellen, Ändern oder Löschen von Dateien auf Rolands Computer sind erlaubt

## Präferenzen

- Direkte, vollständige und operative Anleitung ohne fehlende Schritte
- Hochgeladene Dokumente, Screenshots und Bilddateien vollständig verarbeiten, nichts auslassen
- Dashboard mit Sortierung nach Projektname und Status, kein Suchfeld, Toggle zum Start des Webservers im Hintergrund
- iTerm2 bevorzugt gegenüber dem macOS-Standard-Terminal
- Fish-Shell mit mise; alle Skripte automatisch fish-kompatibel mit voller mise-Unterstützung
- GitHub-Account dizir71, Automatisierungsskript mit SSH-Zugang, Repos unter ~/Desktop/GitHub/ (git@github.com:dizir71/{repo}.git)
- Externer Server cont (Debian 12), Workflows wo relevant darauf ausgerichtet
- Breite, dauerhafte Speicherung von Projektentscheidungen, Änderungen, Dokumenten, Logos, Layouts, ZIP-Dateien, Fortschritt und Logs
- Alle Projektdaten lokal sichern inklusive ZIP-Dateien, Arbeitsfortschritt und Logs
