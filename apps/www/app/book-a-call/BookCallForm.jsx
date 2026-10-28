"use client";

import { useEffect, useState } from "react";

// Calls are Mon–Sat, 10 am to 7 pm India time, in 30-minute slots.
const IST_OFFSET = 5.5 * 3600e3;
const TIMES = Array.from({ length: 18 }, (_, i) => `${String(10 + Math.floor(i / 2))}:${i % 2 ? "30" : "00"}`);
const minutes = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
const timeLabel = (t) => {
  const h = Number(t.slice(0, 2));
  return `${h > 12 ? h - 12 : h}:${t.slice(3)} ${h >= 12 ? "pm" : "am"}`;
};

/** The next 10 working days in India time, each with the slots still open
 * (today: from an hour from now). */
function upcomingDays() {
  const now = new Date(Date.now() + IST_OFFSET);
  const nowMin = now.getUTCHours() * 60 + now.getUTCMinutes();
  const out = [];
  for (let i = 0; out.length < 10 && i < 14; i++) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + i));
    if (d.getUTCDay() === 0) continue;
    const slots = TIMES.filter((t) => i > 0 || minutes(t) >= nowMin + 60);
    if (!slots.length) continue;
    out.push({ iso: d.toISOString().slice(0, 10), label: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }), slots });
  }
  return out;
}

export function BookCallForm({ whatsapp }) {
  const [days, setDays] = useState(null);
  const [day, setDay] = useState(null);
  const [time, setTime] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(null);

  // Worked out in the browser, so the days match the visitor's "now".
  useEffect(() => {
    const list = upcomingDays();
    setDays(list);
    setDay(list[0]?.iso || null);
  }, []);

  const current = days?.find((d) => d.iso === day);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    if (!day || !time) return setError("Pick a day and a time.");
    const f = new FormData(e.currentTarget);
    setBusy(true);
    try {
      const res = await fetch("/api/book-call", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: f.get("name"),
          whatsapp: f.get("whatsapp"),
          email: f.get("email"),
          business: f.get("business"),
          notes: f.get("notes"),
          date: day,
          time,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Couldn't send your request.");
      setDone(data.when || `${current?.label}, ${timeLabel(time)}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="book book--done" role="status">
        <h2 className="h3">Request sent for {done}</h2>
        <p className="muted">
          We&apos;ll confirm the time on WhatsApp shortly. Need to change it? Message us at <a href={whatsapp.url}>{whatsapp.display}</a>.
        </p>
      </div>
    );
  }

  return (
    <form className="book" onSubmit={submit}>
      <fieldset>
        <legend>Pick a day</legend>
        <div className="book__chips">
          {days === null && <span className="muted">Loading days…</span>}
          {days?.map((d) => (
            <button key={d.iso} type="button" className="book__chip" aria-pressed={day === d.iso} onClick={() => (setDay(d.iso), setTime(null))}>
              {d.label}
            </button>
          ))}
        </div>
      </fieldset>
      {current && (
        <fieldset>
          <legend>Pick a time (India time)</legend>
          <div className="book__chips">
            {current.slots.map((t) => (
              <button key={t} type="button" className="book__chip" aria-pressed={time === t} onClick={() => setTime(t)}>
                {timeLabel(t)}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      <div className="book__grid">
        <label>
          <span>Your name</span>
          <input name="name" required minLength={2} maxLength={80} autoComplete="name" />
        </label>
        <label>
          <span>WhatsApp number</span>
          <input name="whatsapp" required inputMode="tel" autoComplete="tel" placeholder="98765 43210" maxLength={24} />
        </label>
        <label>
          <span>
            Email <span className="muted">(optional)</span>
          </span>
          <input name="email" type="email" autoComplete="email" maxLength={200} />
        </label>
        <label>
          <span>
            What you sell <span className="muted">(optional)</span>
          </span>
          <input name="business" maxLength={120} placeholder="e.g. handmade jewellery" />
        </label>
      </div>
      <label>
        <span>
          Anything we should know? <span className="muted">(optional)</span>
        </span>
        <textarea name="notes" rows={3} maxLength={600} />
      </label>
      {error && (
        <p className="book__error" role="alert">
          {error}
        </p>
      )}
      <div className="book__foot">
        <button type="submit" className="btn btn--primary btn--lg" disabled={busy}>
          {busy ? "Sending…" : "Book my free call"}
        </button>
        <span className="muted">
          Or WhatsApp us now: <a href={whatsapp.url}>{whatsapp.display}</a>
        </span>
      </div>
    </form>
  );
}
