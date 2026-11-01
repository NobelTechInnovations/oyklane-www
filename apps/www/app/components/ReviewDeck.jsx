"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

/**
 * Sellers' reviews as a stack of cards that shuffles itself: every few
 * seconds the front card slides away and goes to the back. Hovering or
 * focusing the deck pauses it; the arrows move it by hand; with reduced
 * motion it only moves by hand. Reviews come from Super admin ▸ Website.
 */
export function ReviewDeck({ reviews, everyMs = 5200 }) {
  const [order, setOrder] = useState(() => reviews.map((_, i) => i));
  const [leaving, setLeaving] = useState(null);
  const paused = useRef(false);
  const still = useRef(false);

  useEffect(() => {
    still.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still.current || reviews.length < 2) return;
    const t = setInterval(() => !paused.current && next(), everyMs);
    return () => clearInterval(t);
  }, [reviews.length, everyMs]); // eslint-disable-line react-hooks/exhaustive-deps

  function next() {
    setOrder((o) => {
      setLeaving(o[0]);
      setTimeout(() => setLeaving(null), 520);
      return [...o.slice(1), o[0]];
    });
  }
  const prev = () => setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)]);

  return (
    <div
      className="deck"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocus={() => (paused.current = true)}
      onBlur={() => (paused.current = false)}
    >
      <div className="deck__stack" aria-live="polite">
        {order.map((idx, depth) => {
          const r = reviews[idx];
          const hidden = depth > 2 && idx !== leaving;
          return (
            <figure
              key={idx}
              className={`deck__card${idx === leaving ? " is-leaving" : ""}`}
              style={{ "--d": Math.min(depth, 3), zIndex: reviews.length - depth }}
              aria-hidden={depth !== 0}
              hidden={hidden}
            >
              <div className="deck__stars" aria-label={`${r.rating} out of 5`}>
                {Array.from({ length: 5 }, (_, k) => (
                  <i key={k} className={`ph-duotone ph-star${k < r.rating ? "" : " is-off"}`} aria-hidden="true" />
                ))}
              </div>
              <blockquote className="deck__quote">{r.quote}</blockquote>
              <figcaption className="deck__who">
                <span className="deck__avatar" aria-hidden="true">
                  {r.name.slice(0, 1)}
                </span>
                <span>
                  <b>{r.name}</b>
                  {r.brand && (
                    <small>
                      {r.link ? (
                        <a href={r.link} target="_blank" rel="noopener">
                          {r.brand}
                        </a>
                      ) : (
                        r.brand
                      )}
                    </small>
                  )}
                </span>
              </figcaption>
            </figure>
          );
        })}
      </div>
      {reviews.length > 1 && (
        <div className="deck__nav">
          <button type="button" className="deck__btn" onClick={prev} aria-label="Previous review">
            <Icon name="caret-left" weight="regular" />
          </button>
          <span className="deck__count" aria-hidden="true">
            {order[0] + 1} / {reviews.length}
          </span>
          <button type="button" className="deck__btn" onClick={next} aria-label="Next review">
            <Icon name="caret-right" weight="regular" />
          </button>
        </div>
      )}
    </div>
  );
}
