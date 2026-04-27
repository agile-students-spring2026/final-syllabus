// in-memory per-user saved course ids (ObjectId strings). Replace with a SavedCourse model when needed.
const savedCoursesStore = {
  guest: [],
};

module.exports = { savedCoursesStore };
