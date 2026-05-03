function recentLabelFromDate(createdAt) {
  const d = new Date(createdAt);
  const now = new Date();
  const diffMs = now - d;
  const dayMs = 24 * 60 * 60 * 1000;
  if (diffMs < 0) return "Today";
  if (diffMs < dayMs) return "Today";
  if (diffMs < 7 * dayMs) return "This Week";
  if (diffMs < 30 * dayMs) return "This Month";
  return "Earlier";
}

function toListItem(c) {
  return {
    id: c._id.toString(),
    name: c.name,
    description: c.description,
    category: c.category,
    school: c.school,
    recent: recentLabelFromDate(c.createdAt),
    coverImageUrl: c.coverImageUrl || "",
  };
}

function typeLabelFromCategory(category) {
  const map = {
    notes: "Notes",
    flashcards: "Flashcards",
    videos: "Videos",
    practice: "Practice",
  };
  return map[category] || category;
}

function pendingResourceCategoryLabel(dbCategory) {
  const map = {
    notes: "Notes",
    flashcards: "Flashcards",
    videos: "Videos",
    practice: "Practice Questions",
  };
  return map[dbCategory] || dbCategory;
}

module.exports = {
  recentLabelFromDate,
  toListItem,
  typeLabelFromCategory,
  pendingResourceCategoryLabel,
};
