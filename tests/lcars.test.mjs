/* ==========================================================================
   LCARS Testsuite — prüft die komplette Oberfläche und alle
   Administrationsfunktionen in Chromium (Playwright). Wird vom Loop-Runner
   wiederholt ausgeführt, bis alle Prüfungen fehlerfrei bestehen.
   Aufruf:  node tests/lcars.test.mjs
   ========================================================================== */

/* Playwright lokal oder aus globaler Installation laden */
const { chromium } = await import("playwright").catch(() =>
  import("/opt/node22/lib/node_modules/playwright/index.mjs"));
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const PORT = 8735;
const MIME = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".md": "text/markdown" };

const server = createServer(async (req, res) => {
  try {
    const path = normalize(decodeURIComponent(req.url.split("?")[0]));
    const file = join(ROOT, path === "/" ? "index.html" : path);
    if (!file.startsWith(ROOT)) throw new Error("Pfad außerhalb des Webroots");
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": MIME[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404); res.end("nicht gefunden");
  }
});

let passed = 0, failed = 0;
const fails = [];
function check(name, cond, extra = "") {
  if (cond) { passed++; console.log("  BESTANDEN  " + name); }
  else { failed++; fails.push(name + (extra ? " — " + extra : "")); console.log("  FEHLER     " + name + (extra ? " — " + extra : "")); }
}

await new Promise(r => server.listen(PORT, r));
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage();

const consoleErrors = [];
page.on("console", m => { if (m.type() === "error") consoleErrors.push(m.text()); });
page.on("pageerror", e => consoleErrors.push(String(e)));

/* ---- Laden und Grundgerüst ---- */
await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle" });
await page.waitForSelector("#projekt-tabelle", { timeout: 5000 });
check("Seite lädt und Dashboard rendert", true);
check("Titel korrekt", (await page.title()).includes("LCARS"));
check("Uhr läuft (Europe/Vienna)", (await page.textContent("#lcars-clock")).includes("Europe/Vienna"));

/* ---- Dashboard: Daten und Sortierung ---- */
const zeilen = await page.locator("#projekt-tabelle tbody tr").count();
check("Alle 16 Projekte im Dashboard", zeilen === 16, "gefunden: " + zeilen);
const ersteVorher = await page.textContent("#projekt-tabelle tbody tr td");
await page.click("#projekt-tabelle th:first-child"); // Sortierung umkehren
await page.waitForTimeout(100);
const ersteNachher = await page.textContent("#projekt-tabelle tbody tr td");
check("Sortierung per Spaltenkopf ändert Reihenfolge", ersteVorher !== ersteNachher);

/* ---- Projektdetails ---- */
await page.click("#projekt-tabelle tbody tr");
await page.waitForSelector(".info-card");
check("Projektdetails öffnen mit Quellenvermerk", (await page.textContent("#lcars-content")).includes("Quellen:"));

/* ---- Alle Panels über die Navigation ---- */
for (const p of ["dashboard", "befehle", "status", "logbuch", "konfig", "konventionen", "export", "diagnostik", "audio"]) {
  await page.click(`.nav-btn[data-panel="${p}"]`);
  await page.waitForTimeout(80);
  const leer = await page.evaluate(() => document.getElementById("lcars-content").children.length === 0);
  check("Panel rendert: " + p, !leer);
}

/* ---- Befehlskonsole: Reiter, Ausführung, Feedback, Hilfe/Optionen ---- */
await page.click('.nav-btn[data-panel="befehle"]');
await page.waitForSelector(".cmd-layout");
const reiter = await page.locator(".cmd-tab").count();
check("Befehlskonsole: Reiter vorhanden", reiter >= 5, reiter + " Reiter");
check("Befehlskonsole: Feedback-Fenster vorhanden", await page.locator("#cmd-feedback").count() === 1);
// In den Reiter „System" wechseln und einen Befehl ausführen
await page.click('.cmd-tab:has-text("System")');
await page.waitForTimeout(60);
await page.click('.cmd-item:has-text("Systemstatus prüfen") .lcars-btn');
await page.waitForSelector("#cmd-feedback .cmd-fb-entry");
check("Befehl schreibt Ergebnis ins Feedback-Fenster", await page.locator("#cmd-feedback .cmd-fb-entry").count() >= 1);
// Hilfe/Optionen sind zunächst ausgeblendet, dann aufklappbar
const item = page.locator('.cmd-item:has-text("Systemstatus prüfen")');
check("Optionen zunächst ausgeblendet", await item.locator(".cmd-help").isVisible() === false);
await item.locator(".cmd-help-btn").click();
await page.waitForTimeout(60);
check("Hilfe/Optionen aufklappbar", await item.locator(".cmd-help").isVisible() === true);
check("Option ist als Schaltfläche aufrufbar", await item.locator(".cmd-opt").count() >= 1);
const fbVorher = await page.locator("#cmd-feedback .cmd-fb-entry").count();
await item.locator(".cmd-opt").first().click();
await page.waitForTimeout(60);
check("Option-Aufruf erzeugt Feedback", await page.locator("#cmd-feedback .cmd-fb-entry").count() === fbVorher + 1);

/* ---- Systemstatus: alle Subsysteme grün ---- */
await page.click('.nav-btn[data-panel="status"]');
await page.waitForSelector(".status-dot");
const rot = await page.locator("#lcars-content .status-rot").count();
check("Systemstatus: keine Störungen (alles grün)", rot === 0, rot + " Subsysteme rot");

/* ---- Konfiguration: Anbieter hinzufügen + Duplikatabwehr + Persistenz ---- */
await page.click('.nav-btn[data-panel="konfig"]');
await page.waitForSelector("#neuer-anbieter");
const anbieterVorher = await page.locator("#plattform-liste li").count();
await page.fill("#neuer-anbieter", "testanbieter.example");
await page.click("#anbieter-add");
await page.waitForSelector("#plattform-liste");
const anbieterNachher = await page.locator("#plattform-liste li").count();
check("Anbieter hinzufügen", anbieterNachher === anbieterVorher + 1, `${anbieterVorher} → ${anbieterNachher}`);
await page.fill("#neuer-anbieter", "testanbieter.example");
await page.click("#anbieter-add");
await page.waitForTimeout(100);
const anbieterDup = await page.locator("#plattform-liste li").count();
check("Duplikat wird abgewiesen", anbieterDup === anbieterNachher, "Anzahl: " + anbieterDup);
await page.reload({ waitUntil: "networkidle" });
await page.click('.nav-btn[data-panel="konfig"]');
await page.waitForSelector("#plattform-liste");
const anbieterPersist = await page.locator("#plattform-liste li").count();
check("Konfiguration überlebt Neuladen (localStorage)", anbieterPersist === anbieterNachher, "Anzahl: " + anbieterPersist);

/* ---- Export: alle drei Downloads ---- */
await page.click('.nav-btn[data-panel="export"]');
for (const [id, endung] of [["export-json", ".json"], ["export-md", ".md"], ["export-zip", ".zip"]]) {
  const dl = page.waitForEvent("download", { timeout: 5000 });
  await page.click("#" + id);
  const d = await dl;
  check("Download " + endung, d.suggestedFilename().endsWith(endung), d.suggestedFilename());
}

/* ---- Diagnostik: Selbsttest komplett grün ---- */
await page.click('.nav-btn[data-panel="diagnostik"]');
await page.click("#diag-start");
await page.waitForSelector("#diag-ergebnis");
const diag = await page.textContent("#diag-ergebnis");
check("Diagnostik: alle Systeme betriebsbereit", diag.includes("ALLE SYSTEME BETRIEBSBEREIT"), diag);

/* ---- Roter Alarm an/aus ---- */
await page.click("#btn-red-alert");
check("Roter Alarm aktiviert", await page.evaluate(() => document.body.classList.contains("red-alert")));
await page.click("#btn-red-alert");
check("Roter Alarm deaktiviert", await page.evaluate(() => !document.body.classList.contains("red-alert")));

/* ---- Audio-Panel ---- */
await page.click('.nav-btn[data-panel="audio"]');
await page.waitForSelector("#audio-toggle");
check("Audio-Steuerung vorhanden (Ton-Pflicht)", true);
check("Sound-Engine geladen", await page.evaluate(() => !!window.LcarsSound && typeof window.LcarsSound.play === "function"));

/* ---- Logbuch schreibt mit ---- */
await page.click('.nav-btn[data-panel="logbuch"]');
await page.waitForSelector("#log-console");
const logZeilen = await page.locator("#log-console div").count();
check("Logbuch protokolliert Aktionen", logZeilen > 5, logZeilen + " Einträge");

/* ---- Konsolenfehler ---- */
check("Keine Konsolenfehler", consoleErrors.length === 0, consoleErrors.slice(0, 3).join(" | "));

await browser.close();
server.close();

console.log(`\nErgebnis: ${passed} bestanden, ${failed} fehlgeschlagen`);
if (failed) { console.log("Fehlgeschlagen:\n - " + fails.join("\n - ")); process.exit(1); }
