# Roland — Standards, Konventionen und Präferenzen

Dieses Dokument konsolidiert die als Standard gesetzten Vorgaben aus dem Gedächtnis-Export `roland-gedaechtnis.md` (Google Drive, 04.05.2026) und der Projektübersicht (Repo dizir71/Projekte, 09.05.2025). Es ist die verbindliche Referenz für alle Arbeiten an diesem und den verwalteten Projekten. Inhalte wurden zusammengeführt, nicht erfunden; Quellenkennungen wie in `data/lcars-data.json`.

## Inhaltsverzeichnis

- [Identität und Kontext](#identität-und-kontext)
- [Technische Umgebung](#technische-umgebung)
- [Systemumgebung Easybooking/TYPO3](#systemumgebung-easybookingtypo3)
- [Konventionen](#konventionen)
- [Präferenzen](#präferenzen)

## Identität und Kontext

Bevorzugter Name: Roland. Wohnort für Zeit- und Lokalkontexte: Gmunden, Österreich, Zeitzone Europe/Vienna. GitHub-Account: dizir71. Ziele: ein strukturierteres Leben führen, das Leben durch KI-Tools vereinfachen, möglicherweise Einnahmen durch neue Tools generieren. (Quelle C)

## Technische Umgebung

Primäres Betriebssystem macOS; externer Server Debian 12, erreichbar via SSH-Alias cont; Shell Fish mit mise für Python-/Tool-Versionierung; Terminal iTerm2 (bevorzugt), alternativ WezTerm; Systemsprache de_AT.UTF-8 mit Fallback en_US.UTF-8. Repos unter ~/Desktop/GitHub/, verknüpft mit git@github.com:dizir71/{repo}.git. (Quelle C)

## Systemumgebung Easybooking/TYPO3

CMS geschlossen; nur override.css editierbar; JavaScript nur direkt in HTML-Inhaltselementen vom Typ HTML; nur jQuery 3.1.1; kein Template- oder Head-Zugriff. Server host25.ssl-net.net (Alias host25), Crawler-Verzeichnis /run/ außerhalb des Webroots. Domain www.schweizerhof-am-see.at. (Quellen A, C)

## Konventionen

1. **Zeitanzeige** — Jede Antwort beginnt mit der aktuellen Uhrzeit (Europe/Vienna, Quelle angeben: laut Systemzeit, laut NTP oder laut Benutzerangabe). Vom Nutzer angegebene Zeit wird neue Referenzzeit.
2. **Speicherwarnungen** — Rechtzeitige Warnung, bevor der Chat-Speicher voll ist, damit ein Backup erstellt werden kann.
3. **Lebensmitteldaten** — Neue Lebensmittel automatisch aus offiziellen/wissenschaftlichen Quellen, Abgleich mit mindestens zwei weiteren Quellen.
4. **Skript-Speicherorte** — Nicht-Projektskripte nach ~/Desktop/GitHub/scripts/; global gültige nach ~/global/; allgemeine nach /info/scripts/, nach Thema sortiert, macOS- und Linux-tauglich, via SSH zu GitHub dizir71 gesichert; alle Skripte chmod +x; Python-Skripte immer mit virtuellem Environment.
5. **Zentrales Verzeichnis ~/info/** — Zentraler Speicher für Skripte, Scan-Ergebnisse, Logs und Systemdaten, synchronisiert zwischen MacBook Pro und iMac.
6. **Easybooking/TYPO3** — CSS ausschließlich via override.css, immer vollständig ausgeben, keine Fragmente; Skripte nur in HTML-Inhaltselementen; nur jQuery 3.1.1.
7. **Rechtsdokumente** — Höchste Formatierungsgenauigkeit nach CI: Georgia (Fließtext), Helvetica Bold (Überschriften), Farben, Einrückungen, Zeilenabstände; fehlerhafte oder unvollständige Ausgaben sind nicht akzeptabel.
8. **README und Dokumentation** — Kein Copy-/Code-Box-Stil; gültiges Markdown als Fließtext; Inhaltsverzeichnis mit internen Links; vollständige Inhalte; Code in Courier Monospace; Verzeichnisbäume in Monospace mit Baumsymbolen; keine Abkürzungen, keine Auslassungen.
9. **Gemeinderatsanfragen** — Word-Template: Arial 12 pt, Zeilenabstand 1,0, Absatzabstand vor 0 pt / nach 2 pt, Kapitelüberschriften fett und unterstrichen mit dünner Trennlinie, Nummerierungsebenen 2 cm / 3 cm / 4 cm, hängender Einzug 0,5 cm.
10. **LaTeX-CV** — Code-Blöcke mit nummerierten Abschnitts-Tags ([G1], [E1], [A1], [S1], [S2]); feste Abschnittsunterstreichungslänge via \SecRuleLen; Datumsboxen mit 0,8pt-Lichthof konsistent in \cvevent und \cvmetaevent.
11. **Markdown** — `<span style="...">` nur in .md-Ausgaben, nicht im normalen Chat.
12. **Code- und Befehlsausgaben** — Reiner Text, keine Code-Boxen, Courier, 1 cm eingerückt.
13. **Datei-Operationen** — Anweisungen zum Speichern, Erstellen, Ändern oder Löschen von Dateien auf Rolands Computer sind erlaubt.

## Präferenzen

Direkte, vollständige und operative Anleitung ohne fehlende Schritte. Hochgeladene Dokumente, Screenshots und Bilddateien vollständig verarbeiten, nichts auslassen. Dashboard mit Sortierung nach Projektname und Status, kein Suchfeld, Toggle zum Start des Webservers im Hintergrund. iTerm2 bevorzugt. Fish-Shell mit mise; alle Skripte fish-kompatibel. Externer Server cont (Debian 12), Workflows wo relevant darauf ausgerichtet. Breite, dauerhafte Speicherung von Projektentscheidungen, Änderungen, Dokumenten, Logos, Layouts, ZIP-Dateien, Fortschritt und Logs, damit Arbeitsergebnisse Resets überleben. Alle Projektdaten lokal sichern inklusive ZIP-Dateien, Arbeitsfortschritt und Logs.
