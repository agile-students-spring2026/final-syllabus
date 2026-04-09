const { courses } = require("./courses");

const dashboard = {
  campusCode: "CMP1001",
  verifiedCourses: 4,
  verifiedResources: 4,
};

// Courses awaiting campus-rep approval (ids 3 and 6 are unverified)
const pendingCourses = [3, 6].map((id) => {
  const c = courses.find((x) => x.id === id);
  return {
    id: `course-${c.id}`,
    courseId: c.id,
    kind: "Course",
    name: c.name,
    category: c.category,
    status: "pending",
  };
});

// User-submitted resources awaiting approval
const pendingResources = [
  {
    id: "note-2",
    courseId: 3,
    kind: "Resource",
    name: "Cold War timeline cheat sheet",
    category: "Notes",
    status: "pending",
  },
  {
    id: "prac-1",
    courseId: 6,
    kind: "Resource",
    name: "Gauss/Ampere practice set (10 Qs)",
    category: "Practice Questions",
    status: "pending",
  },
];

const campusRepUsers = [
  { id: "u-1", name: "Alice Nguyen", email: "alice@nyu.edu", campus: "NYU", role: "campus_rep" },
  { id: "u-2", name: "Ben Okafor", email: "ben@tulsa.edu", campus: "Tulsa University", role: "campus_rep" },
  { id: "u-3", name: "Chloe Park", email: "chloe@nyu.edu", campus: "NYU", role: "campus_rep" },
];

module.exports = { dashboard, pendingCourses, pendingResources, campusRepUsers };
