function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Known aliases for the same institution (profile vs course wording). */
const SCHOOL_SYNONYMS = [
  ["New York University (NYU)", "NYU", "New York University"],
];

function normalizeSchoolToken(s) {
  return String(s || "").trim().toLowerCase();
}

function expandSchoolVariants(school) {
  const t = String(school || "").trim();
  if (!t) return [];
  const lower = normalizeSchoolToken(t);
  for (const group of SCHOOL_SYNONYMS) {
    if (group.some((g) => normalizeSchoolToken(g) === lower)) {
      return [...new Set(group.map((x) => String(x).trim()))];
    }
  }
  return [t];
}

function schoolRegexpExact(school) {
  const t = (school || "").trim();
  if (!t) return null;
  return new RegExp(`^${escapeRegex(t)}$`, "i");
}

/**
 * Mongo condition for Course.school matching the viewer's institution (synonyms allowed).
 */
function schoolMongoScope(viewerSchool) {
  const variants = expandSchoolVariants(viewerSchool);
  if (variants.length === 0) return null;
  if (variants.length === 1) {
    return schoolRegexpExact(variants[0]);
  }
  return { $in: variants.map((v) => schoolRegexpExact(v)) };
}

/** True if a course document's school string matches the viewer's school (synonyms allowed). */
function courseSchoolMatchesViewer(courseSchool, viewerSchool) {
  const variants = expandSchoolVariants(viewerSchool);
  if (variants.length === 0) return false;
  const cs = String(courseSchool || "").trim();
  return variants.some((v) => {
    const re = schoolRegexpExact(v);
    return re && re.test(cs);
  });
}

module.exports = {
  escapeRegex,
  schoolRegexpExact,
  expandSchoolVariants,
  schoolMongoScope,
  courseSchoolMatchesViewer,
};
