"use client";

import { useMemo, useState } from "react";

const inr = (n) => `₹${Math.round(Number(n) || 0).toLocaleString("en-IN")}`;
const SALES_STEPS = [50000, 100000, 200000, 300000, 500000, 1000000, 2000000, 5000000];

/**
 * Monthly cost on each platform for the visitor's sales: plan price + the
 * platform's own fee on orders. Payment-gateway charges (Razorpay, PayU…)
 * are the same on both and left out. Oyklane's fee is on every paid order,
 * cash on delivery included; Shopify's is on online payments only.
 */
export function Calculator({ oyklane, shopify, oneClickFeePercent }) {
  const [sales, setSales] = useState(200000);
  const [onlinePct, setOnlinePct] = useState(60);
  const [yearly, setYearly] = useState(false);
  const [oneClick, setOneClick] = useState(false);

  const rows = useMemo(() => {
    const online = (sales * onlinePct) / 100;
    const o = oyklane.map((p) => {
      const plan = yearly ? p.priceYearly / 12 : p.priceMonthly;
      const fee = (sales * p.commissionPercent) / 100 + (oneClick ? (online * oneClickFeePercent) / 100 : 0);
      return { name: `Oyklane ${p.name}`, plan, fee, total: plan + fee, ours: true };
    });
    const s = shopify.map((p) => {
      const plan = yearly ? p.yearly : p.monthly;
      const fee = (online * p.feePercent) / 100;
      return { name: `Shopify ${p.name}`, plan, fee, total: plan + fee };
    });
    return { o, s, bestO: o.reduce((a, b) => (b.total < a.total ? b : a)), bestS: s.reduce((a, b) => (b.total < a.total ? b : a)) };
  }, [sales, onlinePct, yearly, oneClick, oyklane, shopify, oneClickFeePercent]);

  const diff = rows.bestS.total - rows.bestO.total;
  const salesIndex = Math.max(0, SALES_STEPS.findIndex((v) => v >= sales));

  return (
    <div className="calc">
      <div className="calc__inputs">
        <label>
          <span>
            Monthly sales: <strong>{inr(sales)}</strong>
          </span>
          <input type="range" min={0} max={SALES_STEPS.length - 1} step={1} value={salesIndex} onChange={(e) => setSales(SALES_STEPS[Number(e.target.value)])} aria-valuetext={inr(sales)} />
        </label>
        <label>
          <span>
            Paid online (UPI, cards…): <strong>{onlinePct}%</strong> · cash on delivery: <strong>{100 - onlinePct}%</strong>
          </span>
          <input type="range" min={0} max={100} step={10} value={onlinePct} onChange={(e) => setOnlinePct(Number(e.target.value))} aria-valuetext={`${onlinePct}% paid online`} />
        </label>
        <div className="calc__toggles">
          <label className="calc__check">
            <input type="checkbox" checked={yearly} onChange={(e) => setYearly(e.target.checked)} /> Pay yearly (both)
          </label>
          <label className="calc__check">
            <input type="checkbox" checked={oneClick} onChange={(e) => setOneClick(e.target.checked)} /> Use Oyklane&apos;s One-Click Checkout (+{oneClickFeePercent}% on online orders)
          </label>
        </div>
      </div>

      <div className="calc__result" role="status">
        <p className="muted" style={{ margin: 0 }}>Lowest monthly cost for these sales</p>
        <div className="calc__best">
          <div>
            <span className="muted">{rows.bestO.name}</span>
            <strong>{inr(rows.bestO.total)}</strong>
          </div>
          <div>
            <span className="muted">{rows.bestS.name}</span>
            <strong>{inr(rows.bestS.total)}</strong>
          </div>
        </div>
        <p style={{ margin: 0 }}>
          {Math.abs(diff) < 1
            ? "About the same on both."
            : diff > 0
              ? `Oyklane costs ${inr(diff)} less a month (${inr(diff * 12)} a year).`
              : "Oyklane comes with cash on delivery, UPI, WhatsApp order updates, abandoned-checkout reminders and shipping built in — no extra apps to find and pay for."}
        </p>
      </div>

      <div className="table-wrap">
        <table className="compare">
          <thead>
            <tr>
              <th scope="col">Plan</th>
              <th scope="col">Plan price / month</th>
              <th scope="col">Platform fee on orders</th>
              <th scope="col">Total / month</th>
            </tr>
          </thead>
          <tbody>
            {[...rows.o, ...rows.s].map((r) => (
              <tr key={r.name} className={r === rows.bestO || r === rows.bestS ? "is-best" : ""}>
                <td>{r.name}</td>
                <td>{inr(r.plan)}</td>
                <td>{inr(r.fee)}</td>
                <td>
                  <strong>{inr(r.total)}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
