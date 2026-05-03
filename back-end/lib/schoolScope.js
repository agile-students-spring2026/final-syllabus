/** Case-insensitive exact match on course/User school strings (aligned with home listing filters). */
function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function schoolRegexpExact(school) {
  const t = (school || "").trim();
  if (!t) return null;
  return new RegExp(`^${escapeRegex(t)}$`, "i");
}

module.exports = { escapeRegex, schoolRegexpExact };
