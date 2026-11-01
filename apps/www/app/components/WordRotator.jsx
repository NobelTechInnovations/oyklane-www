"use client";

import { useEffect, useState } from "react";

/**
 * One headline, several promises: each is typed out, held, then erased for
 * the next. The first one is in the HTML, so the page loads complete and
 * readers who prefer less motion get a calm swap instead of typing. Screen
 * readers and search engines read the full sentence from the heading's
 * hidden text (see the hero), not this.
 */
export function WordRotator({ words, typeMs = 55, eraseMs = 28, holdMs = 1900 }) {
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(words[0]);
  const [phase, setPhase] = useState("hold"); // typing | hold | erasing

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const word = words[i];
    let t;
    if (still) {
      t = setTimeout(() => {
        const next = (i + 1) % words.length;
        setI(next);
        setShown(words[next]);
      }, holdMs + 1200);
    } else if (phase === "hold") {
      t = setTimeout(() => setPhase("erasing"), holdMs);
    } else if (phase === "erasing") {
      if (shown.length) t = setTimeout(() => setShown(shown.slice(0, -1)), eraseMs);
      else {
        setI((i + 1) % words.length);
        setPhase("typing");
      }
    } else if (shown.length < word.length) {
      t = setTimeout(() => setShown(word.slice(0, shown.length + 1)), typeMs);
    } else setPhase("hold");
    return () => clearTimeout(t);
  }, [i, phase, shown, words, typeMs, eraseMs, holdMs]);

  return (
    <span className="rotator" aria-hidden="true">
      <span className="rotator__text">{shown}</span>
      <span className={`rotator__caret${phase === "hold" ? " is-blinking" : ""}`} />
    </span>
  );
}
