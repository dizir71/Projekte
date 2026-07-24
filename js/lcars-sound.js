/* ==========================================================================
   LCARS Sound-Engine
   Synthetisiert LCARS-typische Interface-Töne (TNG-Stil) über die WebAudio-
   API — vollständig offline, keine externen Audiodateien nötig.
   ========================================================================== */

const LcarsSound = (() => {
  let ctx = null;
  let enabled = true;
  let volume = 0.35;
  let alertInterval = null;

  function ensureContext() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  /** Einzelner Ton mit Frequenzverlauf und Hüllkurve. */
  function tone({ freqStart, freqEnd, duration, type = "sine", gain = 1, delay = 0 }) {
    const c = ensureContext();
    if (!c || !enabled) return;
    const peak = volume * gain;
    if (peak <= 0) return; /* exponentialRamp erlaubt keinen Zielwert 0 */
    const t0 = c.currentTime + delay;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, t0);
    if (freqEnd && freqEnd !== freqStart) {
      osc.frequency.exponentialRampToValueAtTime(freqEnd, t0 + duration);
    }
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak), t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(g).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.05);
  }

  const sounds = {
    /* Kurzer heller Blip — Hover/Fokus */
    hover()   { tone({ freqStart: 1400, freqEnd: 1400, duration: 0.04, type: "sine", gain: 0.35 }); },
    /* Klassischer Zwei-Ton-Chirp — Bestätigung/Klick */
    beep()    { tone({ freqStart: 880, freqEnd: 880, duration: 0.07 });
                tone({ freqStart: 1320, freqEnd: 1320, duration: 0.07, delay: 0.08 }); },
    /* Aufsteigender Sweep — Panelwechsel */
    sweep()   { tone({ freqStart: 500, freqEnd: 1800, duration: 0.18, type: "sine", gain: 0.7 }); },
    /* Absteigender Doppelton — Fehler/Verweigert */
    deny()    { tone({ freqStart: 400, freqEnd: 180, duration: 0.22, type: "square", gain: 0.5 });
                tone({ freqStart: 300, freqEnd: 140, duration: 0.22, type: "square", gain: 0.5, delay: 0.2 }); },
    /* Erfolgs-Trill */
    ok()      { [660, 880, 1100, 1320].forEach((f, i) =>
                  tone({ freqStart: f, freqEnd: f, duration: 0.06, delay: i * 0.07, gain: 0.8 })); },
    /* Roter Alarm — einzelner Klaxon-Zyklus */
    alertCycle() {
      tone({ freqStart: 480, freqEnd: 950, duration: 0.45, type: "sawtooth", gain: 0.65 });
      tone({ freqStart: 950, freqEnd: 480, duration: 0.45, type: "sawtooth", gain: 0.65, delay: 0.45 });
    }
  };

  function startAlert() {
    stopAlert();
    if (!enabled) return;
    sounds.alertCycle();
    alertInterval = setInterval(() => sounds.alertCycle(), 1100);
  }
  function stopAlert() {
    if (alertInterval) { clearInterval(alertInterval); alertInterval = null; }
  }

  return {
    init: ensureContext,
    play(name) { if (sounds[name]) sounds[name](); },
    startAlert,
    stopAlert,
    setEnabled(v) { enabled = v; if (!v) stopAlert(); },
    isEnabled() { return enabled; },
    setVolume(v) { volume = Math.min(1, Math.max(0, v)); },
    getVolume() { return volume; }
  };
})();

window.LcarsSound = LcarsSound;
