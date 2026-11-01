// Icons: Phosphor (phosphoricons.com), loaded from the jsDelivr CDN in
// layout.jsx — duotone for content, regular for controls (arrows, menus).
// `I` keeps the names pages already use; `Icon` takes one of them, or any
// Phosphor name with `name`.
export const I = {
  check: "check-circle",
  arrow: "arrow-right",
  chevron: "caret-down",
  layers: "stack",
  bolt: "lightning",
  card: "credit-card",
  receipt: "receipt",
  star: "star",
  chart: "chart-bar",
  code: "code",
  globe: "globe-hemisphere-east",
  bell: "bell",
  phone: "device-mobile",
  shield: "shield-check",
  pin: "map-pin",
  store: "storefront",
  flow: "flow-arrow",
  mail: "envelope-simple",
  clock: "clock",
  calendar: "calendar-blank",
  branch: "git-branch",
  truck: "truck",
  box: "package",
  spark: "sparkle",
  chat: "chat-circle-text",
  life: "lifebuoy",
  puzzle: "puzzle-piece",
  users: "users-three",
  tag: "tag",
  menu: "list",
  x: "x",
  wallet: "wallet",
  cod: "money",
  lock: "lock-key",
  eye: "eye",
  home: "house",
  megaphone: "megaphone",
  rupee: "currency-inr",
  grid: "squares-four",
  trend: "trend-up",
  cart: "shopping-cart",
  search: "magnifying-glass",
  refresh: "arrows-clockwise",
};

// Controls read better thin and plain.
const REGULAR = new Set(["arrow-right", "caret-down", "list", "x", "magnifying-glass", "arrows-clockwise", "caret-left", "caret-right"]);

export function Icon({ d, name, weight, className = "" }) {
  const n = name || d;
  const w = weight || (REGULAR.has(n) ? "regular" : "duotone");
  return <i className={`ico ${w === "regular" ? "ph" : `ph-${w}`} ph-${n}${className ? ` ${className}` : ""}`} aria-hidden="true" />;
}
