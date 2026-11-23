// Years are astronomical integers: 1 BCE = 0, 2 BCE = -1. The label never shows a year zero.
export function yearLabel(y) {
  if (!Number.isInteger(y)) throw new TypeError('year must be an integer');
  if (y <= 0) return `${1 - y} BCE`;
  return y < 1000 ? `${y} CE` : String(y);
}
export function range(lo, hi) {
  const out = [];
  for (let y = lo; y <= hi; y++) out.push(y);
  return out;
}
// Would `text` print the year y? Used to keep free text from leaking a target.
export function printsYear(text, y) {
  if (y <= 0) return new RegExp(`(?<!\\d)${1 - y}\\s*(BCE|BC)`).test(text);
  if (y < 1000) return new RegExp(`(?<!\\d)${y}\\s*(CE|AD)`).test(text);
  return new RegExp(`(?<!\\d)${y}(?!\\d)`).test(text);
}
