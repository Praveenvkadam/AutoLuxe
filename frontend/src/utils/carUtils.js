export function parsePrice(str) {
  return parseInt(str.replace(/[$,]/g, ""), 10);
}

export function formatDate(date) {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
