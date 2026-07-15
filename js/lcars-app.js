/* ==========================================================================
   LCARS Hauptanwendung — Projektverwaltung Roland Simmer
   Panels: Dashboard, Projektdetails, Systemstatus, Logbuch, Konfiguration,
   Konventionen, Datenexport, Diagnostik, Audio. Alle Inhalte stammen aus
   data/lcars-data.json (zusammengeführte Quellen A–D, ohne Duplikate).
   ========================================================================== */

const LcarsApp = (() => {
  const CONFIG_KEY = "lcars-config-v1";
  let DATA = null;
  let logs = [];
  let sortKey = "name";
  let sortAsc = true;
  let redAlert = false;

  /* ---------------- Zeit (Europe/Vienna) ---------------- */

  function wienZeit() {
    return new Intl.DateTimeFormat("de-AT", {
      timeZone: "Europe/Vienna",
      dateStyle: "medium",
      timeStyle: "medium"
    }).format(new Date());
  }

  function tickClock() {
    const el = document.getElementById("lcars-clock");
    if (el) el.textContent = wienZeit() + " · Europe/Vienna (laut Systemzeit)";
  }

  /* ---------------- Logbuch ---------------- */

  function log(level, msg) {
    const entry = { zeit: wienZeit(), level, msg };
    logs.push(entry);
    if (logs.length > 500) logs.shift();
    const con = document.getElementById("log-console");
    if (con) {
      con.appendChild(renderLogLine(entry));
      con.scrollTop = con.scrollHeight;
    }
    setStatusLine(msg);
  }

  function renderLogLine(e) {
    const div = document.createElement("div");
    div.className = "log-" + e.level;
    div.textContent = `[${e.zeit}] [${e.level.toUpperCase()}] ${e.msg}`;
    return div;
  }

  function setStatusLine(msg) {
    const el = document.getElementById("lcars-status-line");
    if (el) el.textContent = msg;
  }

  /* ---------------- Konfiguration (localStorage) ---------------- */

  function defaultConfig() {
    const a = DATA.projekte.find(p => p.id === "auto2025");
    return {
      crawler_intervall: a.details.crawler.intervall_minuten,
      max_preis: a.details.crawler.max_preis,
      antriebe: [...a.details.crawler.antriebe],
      plattformen: [...a.details.plattformen],
      eintraege_pro_seite: a.details.dashboard.eintraege_pro_seite,
      sichtbare_spalten: [...a.details.dashboard.sichtbare_spalten],
      standard_sortierung: a.details.dashboard.standard_sortierung
    };
  }

  function loadConfig() {
    try {
      const raw = localStorage.getItem(CONFIG_KEY);
      if (raw) return { ...defaultConfig(), ...JSON.parse(raw) };
    } catch (e) { /* defekter Speicher → Standardwerte */ }
    return defaultConfig();
  }

  function saveConfig(cfg) {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
    log("ok", "Konfiguration gespeichert");
  }

  /* ---------------- Panel-Gerüst ---------------- */

  const panels = {};
  let activePanel = "dashboard";

  function showPanel(name, arg) {
    const content = document.getElementById("lcars-content");
    if (!panels[name]) { log("error", "Unbekanntes Panel: " + name); return; }
    activePanel = name;
    content.innerHTML = "";
    content.appendChild(panels[name](arg));
    document.querySelectorAll(".nav-btn[data-panel]").forEach(b =>
      b.classList.toggle("active", b.dataset.panel === name));
    LcarsSound.play("sweep");
    log("info", "Panel geöffnet: " + name.toUpperCase());
  }

  function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") node.className = v;
      else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    }
    for (const c of children.flat()) {
      if (c == null) continue;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    }
    return node;
  }

  /* Rekursive Darstellung beliebiger Datenstrukturen aus lcars-data.json */
  function renderValue(v) {
    if (Array.isArray(v)) return el("ul", {}, v.map(x => el("li", {}, renderValue(x))));
    if (v && typeof v === "object") {
      return el("ul", {}, Object.entries(v).map(([k, val]) =>
        el("li", {}, el("strong", {}, k.replaceAll("_", " ").toUpperCase() + ": "), renderValue(val))));
    }
    return String(v);
  }

  /* ---------------- Panel: Dashboard ---------------- */

  function statusDot(status) {
    const map = { aktiv: "gruen", wartung: "gelb", archiviert: "rot" };
    return el("span", { class: "status-dot status-" + (map[status] || "gelb") });
  }

  panels.dashboard = () => {
    const wrap = el("div");
    wrap.appendChild(el("h1", { class: "panel-title" }, "Projekt-Dashboard"));
    wrap.appendChild(el("p", {}, `${DATA.projekte.length} Projekte aus ${DATA.meta.quellen.length} Quellen zusammengeführt — Sortierung per Klick auf Spaltenkopf (Name/Status/Kategorie).`));

    const keys = [["name", "Projektname"], ["status", "Status"], ["kategorie", "Kategorie"], ["quellen", "Quellen"]];
    const thead = el("tr", {}, keys.map(([k, label]) =>
      el("th", { onclick: () => { sortAsc = sortKey === k ? !sortAsc : true; sortKey = k; LcarsSound.play("beep"); showPanel("dashboard"); } },
        label + (sortKey === k ? (sortAsc ? " ▲" : " ▼") : ""))));

    const rows = [...DATA.projekte].sort((a, b) => {
      const va = String(a[sortKey]), vb = String(b[sortKey]);
      return sortAsc ? va.localeCompare(vb, "de") : vb.localeCompare(va, "de");
    }).map(p => el("tr", { onclick: () => { LcarsSound.play("beep"); showPanel("projekt", p.id); } },
      el("td", {}, statusDot(p.status), p.name),
      el("td", {}, p.status.toUpperCase()),
      el("td", {}, p.kategorie),
      el("td", {}, p.quellen.join(", "))));

    wrap.appendChild(el("div", { class: "table-wrap" },
      el("table", { class: "lcars-table", id: "projekt-tabelle" }, el("thead", {}, thead), el("tbody", {}, rows))));
    return wrap;
  };

  /* ---------------- Panel: Projektdetails ---------------- */

  panels.projekt = (id) => {
    const p = DATA.projekte.find(x => x.id === id) || DATA.projekte[0];
    const wrap = el("div");
    wrap.appendChild(el("h1", { class: "panel-title" }, p.name));
    wrap.appendChild(el("p", {},
      statusDot(p.status), ` STATUS: ${p.status.toUpperCase()} `,
      el("span", { class: "badge" }, p.kategorie),
      el("span", { class: "badge" }, "Quellen: " + p.quellen.join(", "))));
    if (p.domain) wrap.appendChild(el("p", {}, "DOMAIN: " + p.domain));
    const card = el("div", { class: "info-card" }, el("h3", {}, "Projektdaten"), renderValue(p.details));
    wrap.appendChild(card);
    wrap.appendChild(el("button", { class: "lcars-btn b-lilac", onclick: () => showPanel("dashboard") }, "Zurück zum Dashboard"));
    return wrap;
  };

  /* ---------------- Panel: Systemstatus ---------------- */

  function systemChecks() {
    const checks = [];
    const push = (name, ok, info) => checks.push({ name, status: ok ? "gruen" : "rot", info });
    push("Datenmodell (lcars-data.json)", !!DATA && Array.isArray(DATA.projekte) && DATA.projekte.length >= 16,
      DATA ? DATA.projekte.length + " Projekte geladen" : "nicht geladen");
    const ids = DATA ? DATA.projekte.map(p => p.id) : [];
    push("Duplikatfreiheit", new Set(ids).size === ids.length, "eindeutige Projekt-IDs: " + new Set(ids).size);
    push("Sound-Engine (WebAudio)", !!(window.AudioContext || window.webkitAudioContext) && !!window.LcarsSound,
      "Audio " + (LcarsSound.isEnabled() ? "aktiviert" : "deaktiviert") + ", Lautstärke " + Math.round(LcarsSound.getVolume() * 100) + "%");
    let lsOk = false;
    try { localStorage.setItem("lcars-probe", "1"); lsOk = localStorage.getItem("lcars-probe") === "1"; localStorage.removeItem("lcars-probe"); } catch (e) {}
    push("Konfigurationsspeicher (localStorage)", lsOk, lsOk ? "Lese-/Schreibzugriff in Ordnung" : "kein Zugriff");
    push("Logbuch", Array.isArray(logs), logs.length + " Einträge");
    push("Konventionen geladen", DATA && DATA.konventionen.length >= 13, (DATA ? DATA.konventionen.length : 0) + " Konventionen");
    return checks;
  }

  panels.status = () => {
    const wrap = el("div");
    wrap.appendChild(el("h1", { class: "panel-title" }, "Systemstatus"));
    const checks = systemChecks();
    const table = el("table", { class: "lcars-table" },
      el("thead", {}, el("tr", {}, el("th", {}, "Subsystem"), el("th", {}, "Status"), el("th", {}, "Details"))),
      el("tbody", {}, checks.map(c => el("tr", {},
        el("td", {}, c.name),
        el("td", {}, el("span", { class: "status-dot status-" + c.status }), c.status === "gruen" ? "BETRIEBSBEREIT" : "STÖRUNG"),
        el("td", {}, c.info)))));
    wrap.appendChild(el("div", { class: "table-wrap" }, table));
    wrap.appendChild(el("h2", { class: "section-title" }, "Systemumgebung"));
    wrap.appendChild(el("div", { class: "info-card card-blue" }, renderValue(DATA.systemumgebung)));
    const alertBtn = el("button", {
      class: "lcars-btn b-red",
      onclick: () => { toggleRedAlert(); showPanel("status"); }
    }, redAlert ? "Roten Alarm beenden" : "Roter Alarm");
    wrap.appendChild(alertBtn);
    return wrap;
  };

  function toggleRedAlert() {
    redAlert = !redAlert;
    document.body.classList.toggle("red-alert", redAlert);
    if (redAlert) { LcarsSound.startAlert(); log("warn", "ROTER ALARM aktiviert"); }
    else { LcarsSound.stopAlert(); log("ok", "Roter Alarm beendet"); }
  }

  /* ---------------- Panel: Logbuch ---------------- */

  panels.logbuch = () => {
    const wrap = el("div");
    wrap.appendChild(el("h1", { class: "panel-title" }, "Logbuch"));
    const con = el("div", { id: "log-console" }, logs.map(renderLogLine));
    wrap.appendChild(con);
    wrap.appendChild(el("div", {},
      el("button", { class: "lcars-btn", onclick: () => { LcarsSound.play("beep"); downloadText("lcars-log.txt", logs.map(e => `[${e.zeit}] [${e.level}] ${e.msg}`).join("\n")); } }, "Log herunterladen"),
      el("button", { class: "lcars-btn b-red", onclick: () => { logs = []; LcarsSound.play("deny"); showPanel("logbuch"); log("info", "Logbuch geleert"); } }, "Log leeren")));
    setTimeout(() => { con.scrollTop = con.scrollHeight; }, 0);
    return wrap;
  };

  /* ---------------- Panel: Konfiguration ---------------- */

  panels.konfig = () => {
    const cfg = loadConfig();
    const wrap = el("div");
    wrap.appendChild(el("h1", { class: "panel-title" }, "Konfiguration — auto2025 Crawler & Dashboard"));

    const numRow = (label, key, min, max) => el("div", {},
      el("span", { class: "lcars-label" }, label),
      el("input", { class: "lcars-input", type: "number", value: cfg[key], min, max,
        onchange: (ev) => { cfg[key] = Number(ev.target.value); } }));

    wrap.appendChild(numRow("Crawler-Intervall (Minuten)", "crawler_intervall", 5, 1440));
    wrap.appendChild(numRow("Maximalpreis (EUR)", "max_preis", 1000, 200000));

    const seiten = el("div", {},
      el("span", { class: "lcars-label" }, "Einträge pro Seite"),
      el("select", { class: "lcars-select", onchange: (ev) => { cfg.eintraege_pro_seite = Number(ev.target.value); } },
        [5, 10, 50].map(n => {
          const o = el("option", { value: n }, String(n));
          if (n === cfg.eintraege_pro_seite) o.selected = true;
          return o;
        })));
    wrap.appendChild(seiten);

    wrap.appendChild(el("h2", { class: "section-title" }, "Sichtbare Spalten"));
    const alleSpalten = ["fahrzeug", "preis", "ez", "km", "antrieb", "bewertung"];
    const spaltenBox = el("div", {}, alleSpalten.map(s => el("label", { class: "lcars-label", style: "min-width:140px" },
      el("input", { type: "checkbox", ...(cfg.sichtbare_spalten.includes(s) ? { checked: "" } : {}),
        onchange: (ev) => {
          cfg.sichtbare_spalten = ev.target.checked
            ? [...new Set([...cfg.sichtbare_spalten, s])]
            : cfg.sichtbare_spalten.filter(x => x !== s);
        } }), " " + s.toUpperCase())));
    wrap.appendChild(spaltenBox);

    wrap.appendChild(el("h2", { class: "section-title" }, "Plattformen / Anbieter (" + cfg.plattformen.length + ")"));
    const list = el("ul", { id: "plattform-liste" }, cfg.plattformen.map(p => el("li", {}, p + " ",
      el("button", { class: "lcars-btn b-red", style: "padding:2px 10px;font-size:11px",
        onclick: (ev) => { cfg.plattformen = cfg.plattformen.filter(x => x !== p); LcarsSound.play("deny"); ev.target.closest("li").remove(); } }, "entfernen"))));
    wrap.appendChild(el("div", { class: "info-card card-lilac" }, list));

    const input = el("input", { class: "lcars-input", id: "neuer-anbieter", placeholder: "z. B. willhaben.at" });
    wrap.appendChild(el("div", {},
      el("span", { class: "lcars-label" }, "Neuen Anbieter hinzufügen"),
      input,
      el("button", { class: "lcars-btn b-gold", id: "anbieter-add", onclick: () => {
        const v = input.value.trim();
        if (!v) { LcarsSound.play("deny"); log("warn", "Kein Anbietername eingegeben"); return; }
        if (cfg.plattformen.includes(v)) { LcarsSound.play("deny"); log("warn", "Anbieter existiert bereits (Duplikat verhindert): " + v); return; }
        cfg.plattformen.push(v);
        LcarsSound.play("ok");
        log("ok", "Anbieter hinzugefügt: " + v);
        saveConfig(cfg);
        showPanel("konfig");
      } }, "Hinzufügen")));

    wrap.appendChild(el("div", { style: "margin-top:16px" },
      el("button", { class: "lcars-btn", id: "konfig-speichern", onclick: () => { saveConfig(cfg); LcarsSound.play("ok"); } }, "Speichern"),
      el("button", { class: "lcars-btn b-red", onclick: () => { localStorage.removeItem(CONFIG_KEY); LcarsSound.play("deny"); log("warn", "Konfiguration auf Standardwerte zurückgesetzt"); showPanel("konfig"); } }, "Zurücksetzen")));
    return wrap;
  };

  /* ---------------- Panel: Konventionen ---------------- */

  panels.konventionen = () => {
    const wrap = el("div");
    wrap.appendChild(el("h1", { class: "panel-title" }, "Konventionen & Präferenzen"));
    DATA.konventionen.forEach(k => wrap.appendChild(
      el("div", { class: "info-card" }, el("h3", {}, k.titel), el("p", {}, k.regel),
        el("p", {}, el("span", { class: "badge" }, "Quellen: " + k.quellen.join(", "))))));
    wrap.appendChild(el("h2", { class: "section-title" }, "Präferenzen"));
    wrap.appendChild(el("div", { class: "info-card card-blue" },
      el("ul", {}, DATA.praeferenzen.map(p => el("li", {}, p)))));
    return wrap;
  };

  /* ---------------- Panel: Datenexport ---------------- */

  function downloadText(name, text, mime = "text/plain") {
    const blob = new Blob([text], { type: mime + ";charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function datenAlsMarkdown() {
    const L = [];
    L.push("# " + DATA.meta.system, "");
    L.push("Zusammengeführt am " + DATA.meta.zusammengefuehrt_am + " aus folgenden Quellen:", "");
    DATA.meta.quellen.forEach(q => L.push("- **" + q.id + "**: " + q.name));
    L.push("", "## Projekte", "");
    DATA.projekte.forEach(p => {
      L.push("### " + p.name, "");
      L.push("Status: " + p.status + " · Kategorie: " + p.kategorie + " · Quellen: " + p.quellen.join(", "), "");
      L.push("```json", JSON.stringify(p.details, null, 2), "```", "");
    });
    L.push("## Konventionen", "");
    DATA.konventionen.forEach(k => L.push("- **" + k.titel + "**: " + k.regel));
    L.push("", "## Präferenzen", "");
    DATA.praeferenzen.forEach(p => L.push("- " + p));
    return L.join("\n");
  }

  /* Minimaler ZIP-Writer (Store-Methode, ohne Kompression) */
  function crc32(buf) {
    let table = crc32.table;
    if (!table) {
      table = crc32.table = new Uint32Array(256);
      for (let i = 0; i < 256; i++) {
        let c = i;
        for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        table[i] = c >>> 0;
      }
    }
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
    return (crc ^ 0xffffffff) >>> 0;
  }

  function buildZip(files) {
    const enc = new TextEncoder();
    const chunks = [];
    const central = [];
    let offset = 0;
    const now = new Date();
    const dosTime = ((now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)) & 0xffff;
    const dosDate = (((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()) & 0xffff;

    const u16 = n => new Uint8Array([n & 0xff, (n >> 8) & 0xff]);
    const u32 = n => new Uint8Array([n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, (n >> 24) & 0xff]);

    for (const [name, content] of files) {
      const nameB = enc.encode(name);
      const data = enc.encode(content);
      const crc = crc32(data);
      const local = [u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(dosTime), u16(dosDate),
        u32(crc), u32(data.length), u32(data.length), u16(nameB.length), u16(0), nameB, data];
      central.push({ nameB, crc, size: data.length, offset, dosTime, dosDate });
      for (const part of local) chunks.push(part);
      offset += local.reduce((s, p) => s + p.length, 0);
    }
    const cdStart = offset;
    for (const f of central) {
      const cd = [u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(f.dosTime), u16(f.dosDate),
        u32(f.crc), u32(f.size), u32(f.size), u16(f.nameB.length), u16(0), u16(0), u16(0), u16(0),
        u32(0), u32(f.offset), f.nameB];
      for (const part of cd) chunks.push(part);
      offset += cd.reduce((s, p) => s + p.length, 0);
    }
    chunks.push(u32(0x06054b50), u16(0), u16(0), u16(central.length), u16(central.length), u32(offset - cdStart), u32(cdStart), u16(0));
    return new Blob(chunks, { type: "application/zip" });
  }

  panels.export = () => {
    const wrap = el("div");
    wrap.appendChild(el("h1", { class: "panel-title" }, "Datenexport & Backup"));
    const zipName = "lcars_export_" + new Date().toISOString().slice(0, 10) + ".zip";
    wrap.appendChild(el("div", { class: "info-card" },
      el("h3", {}, "Exportpfade"),
      el("p", {}, "ZIP-Ausgabe: Downloads/" + zipName + " (enthält lcars-data.json und projekte-gesamt.md)"),
      el("p", {}, "Quelle im Repository: data/lcars-data.json · export_md/projekte-gesamt.md")));
    wrap.appendChild(el("button", { class: "lcars-btn", id: "export-json", onclick: () => {
      LcarsSound.play("ok");
      downloadText("lcars-data.json", JSON.stringify(DATA, null, 2), "application/json");
      log("ok", "JSON-Export erstellt: lcars-data.json");
    } }, "JSON exportieren"));
    wrap.appendChild(el("button", { class: "lcars-btn b-lilac", id: "export-md", onclick: () => {
      LcarsSound.play("ok");
      downloadText("projekte-gesamt.md", datenAlsMarkdown(), "text/markdown");
      log("ok", "Markdown-Export erstellt: projekte-gesamt.md");
    } }, "Markdown exportieren"));
    wrap.appendChild(el("button", { class: "lcars-btn b-gold", id: "export-zip", onclick: () => {
      const blob = buildZip([
        ["lcars-data.json", JSON.stringify(DATA, null, 2)],
        ["projekte-gesamt.md", datenAlsMarkdown()]
      ]);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = zipName;
      a.click();
      URL.revokeObjectURL(a.href);
      LcarsSound.play("ok");
      log("ok", "ZIP-Export erstellt: Downloads/" + zipName);
    } }, "ZIP exportieren (mit Pfadangabe)"));
    return wrap;
  };

  /* ---------------- Panel: Diagnostik ---------------- */

  panels.diagnostik = () => {
    const wrap = el("div");
    wrap.appendChild(el("h1", { class: "panel-title" }, "Diagnostik — Selbsttest Stufe 3"));
    const out = el("div", { id: "diag-out" });
    wrap.appendChild(el("button", { class: "lcars-btn", id: "diag-start", onclick: () => runDiagnostics(out) }, "Diagnose starten"));
    wrap.appendChild(out);
    return wrap;
  };

  function runDiagnostics(out) {
    out.innerHTML = "";
    LcarsSound.play("sweep");
    const results = [];
    const test = (name, fn) => {
      try { const r = fn(); results.push({ name, ok: r !== false, info: typeof r === "string" ? r : "OK" }); }
      catch (e) { results.push({ name, ok: false, info: String(e) }); }
    };

    test("Datenmodell geladen", () => DATA.projekte.length + " Projekte, " + DATA.konventionen.length + " Konventionen");
    test("Projekt-IDs eindeutig (keine Duplikate)", () => {
      const ids = DATA.projekte.map(p => p.id);
      if (new Set(ids).size !== ids.length) throw new Error("Duplikate gefunden");
      return ids.length + " eindeutige IDs";
    });
    test("Pflichtfelder vollständig", () => {
      DATA.projekte.forEach(p => { ["id", "name", "kategorie", "status", "quellen", "details"].forEach(f => {
        if (!(f in p)) throw new Error(p.name + " fehlt Feld " + f); }); });
      return "alle Projekte vollständig";
    });
    test("Quellenverweise gültig", () => {
      const q = new Set(DATA.meta.quellen.map(x => x.id));
      DATA.projekte.forEach(p => p.quellen.forEach(s => { if (!q.has(s)) throw new Error("Unbekannte Quelle " + s); }));
      return DATA.meta.quellen.length + " Quellen registriert";
    });
    test("Alle Panels renderbar", () => {
      for (const name of Object.keys(panels)) {
        const node = panels[name](name === "projekt" ? DATA.projekte[0].id : undefined);
        if (!(node instanceof HTMLElement)) throw new Error(name + " liefert kein Element");
      }
      return Object.keys(panels).length + " Panels in Ordnung";
    });
    test("Sound-Engine bereit", () => {
      if (!window.LcarsSound) throw new Error("nicht geladen");
      return "aktiviert: " + LcarsSound.isEnabled() + ", Lautstärke: " + Math.round(LcarsSound.getVolume() * 100) + "%";
    });
    test("Konfigurationsspeicher", () => { const c = loadConfig(); saveConfig(c); return "Lesen/Schreiben in Ordnung"; });
    test("ZIP-Generator", () => {
      const b = buildZip([["probe.txt", "LCARS"]]);
      if (!(b instanceof Blob) || b.size < 100) throw new Error("ZIP fehlerhaft");
      return "Test-ZIP " + b.size + " Bytes";
    });

    const allOk = results.every(r => r.ok);
    const table = el("table", { class: "lcars-table" },
      el("thead", {}, el("tr", {}, el("th", {}, "Prüfung"), el("th", {}, "Ergebnis"), el("th", {}, "Details"))),
      el("tbody", {}, results.map(r => el("tr", {},
        el("td", {}, r.name),
        el("td", {}, el("span", { class: "status-dot status-" + (r.ok ? "gruen" : "rot") }), r.ok ? "BESTANDEN" : "FEHLGESCHLAGEN"),
        el("td", {}, r.info)))));
    out.appendChild(el("div", { class: "table-wrap" }, table));
    out.appendChild(el("p", { id: "diag-ergebnis", class: allOk ? "log-ok" : "log-error" },
      allOk ? "ALLE SYSTEME BETRIEBSBEREIT" : "STÖRUNGEN FESTGESTELLT — siehe Tabelle"));
    LcarsSound.play(allOk ? "ok" : "deny");
    log(allOk ? "ok" : "error", "Diagnose abgeschlossen: " + results.filter(r => r.ok).length + "/" + results.length + " bestanden");
  }

  /* ---------------- Panel: Audio ---------------- */

  panels.audio = () => {
    const wrap = el("div");
    wrap.appendChild(el("h1", { class: "panel-title" }, "Audio-Steuerung"));
    wrap.appendChild(el("div", {},
      el("span", { class: "lcars-label" }, "Interface-Töne"),
      el("button", { class: "lcars-btn " + (LcarsSound.isEnabled() ? "b-gold" : "b-red"), id: "audio-toggle", onclick: (ev) => {
        LcarsSound.setEnabled(!LcarsSound.isEnabled());
        LcarsSound.play("beep");
        log("info", "Audio " + (LcarsSound.isEnabled() ? "aktiviert" : "deaktiviert"));
        showPanel("audio");
      } }, LcarsSound.isEnabled() ? "AN — ausschalten" : "AUS — einschalten")));
    wrap.appendChild(el("div", {},
      el("span", { class: "lcars-label" }, "Lautstärke"),
      el("input", { class: "lcars-input", type: "range", min: 0, max: 100, value: Math.round(LcarsSound.getVolume() * 100),
        oninput: (ev) => { LcarsSound.setVolume(Number(ev.target.value) / 100); },
        onchange: () => LcarsSound.play("beep") })));
    wrap.appendChild(el("h2", { class: "section-title" }, "Testtöne"));
    ["hover", "beep", "sweep", "ok", "deny"].forEach(s =>
      wrap.appendChild(el("button", { class: "lcars-btn b-blue", onclick: () => LcarsSound.play(s) }, s.toUpperCase())));
    return wrap;
  };

  /* ---------------- Initialisierung ---------------- */

  async function init() {
    tickClock();
    setInterval(tickClock, 1000);

    try {
      const res = await fetch("data/lcars-data.json");
      if (!res.ok) throw new Error("HTTP " + res.status);
      DATA = await res.json();
    } catch (e) {
      document.getElementById("lcars-content").innerHTML =
        "<h1 class='panel-title'>Datenmodell nicht ladbar</h1><p>data/lcars-data.json konnte nicht geladen werden (" + e.message +
        "). Die Seite muss über einen Webserver aufgerufen werden, z. B.: <code>./start_lcars.sh</code></p>";
      return;
    }

    /* Erste Nutzerinteraktion aktiviert den AudioContext (Browser-Richtlinie) */
    document.body.addEventListener("pointerdown", () => LcarsSound.init(), { once: true });

    document.querySelectorAll(".nav-btn[data-panel]").forEach(btn => {
      btn.addEventListener("click", () => showPanel(btn.dataset.panel));
      btn.addEventListener("mouseenter", () => LcarsSound.play("hover"));
    });
    document.getElementById("btn-red-alert").addEventListener("click", toggleRedAlert);

    log("ok", "LCARS-System initialisiert — " + DATA.projekte.length + " Projekte geladen");
    showPanel("dashboard");
  }

  return { init, showPanel, log, toggleRedAlert, get data() { return DATA; } };
})();

document.addEventListener("DOMContentLoaded", LcarsApp.init);
window.LcarsApp = LcarsApp;
