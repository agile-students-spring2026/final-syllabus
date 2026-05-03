const path = require("path");

/** Allowed extensions per Resource.category (lowercase, includes dot). */
const ALLOWED_BY_CATEGORY = {
  notes: new Set([".pdf", ".doc", ".docx", ".txt", ".md", ".ppt", ".pptx"]),
  videos: new Set([".mp4", ".webm", ".mov", ".m4v", ".mkv"]),
  flashcards: new Set([".json", ".csv", ".txt"]),
  practice: new Set([".pdf", ".doc", ".docx", ".txt", ".md"]),
};

const MAX_FILE_BYTES = 100 * 1024 * 1024; // 100 MB (needed for video)

function extensionAllowed(category, filePath, originalName) {
  const set = ALLOWED_BY_CATEGORY[category];
  if (!set) return false;
  const ext =
    path.extname(originalName || "").toLowerCase() ||
    path.extname(filePath || "").toLowerCase();
  return ext !== "" && set.has(ext);
}

module.exports = {
  MAX_FILE_BYTES,
  extensionAllowed,
};
