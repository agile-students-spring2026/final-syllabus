// just using arrays to store stuff, no db yet
const courses = [
  { id: "course-1", name: "Intro to Computer Science", code: "CS101", instructor: "Dr. Smith", createdAt: "2025-09-01T10:00:00.000Z" },
  { id: "course-2", name: "Calculus I", code: "MATH201", instructor: "Prof. Johnson", createdAt: "2025-09-01T10:00:00.000Z" },
];

const resources = [
  { id: "res-1", title: "Week 1 Lecture Notes", courseId: "course-1", category: "notes", fileName: "cs101_week1.pdf", uploadedBy: "user-1001", uploadedAt: "2025-09-05T14:30:00.000Z", verified: true },
  { id: "res-2", title: "Midterm Flashcards", courseId: "course-1", category: "flashcards", fileName: "cs101_midterm_cards.json", uploadedBy: "user-1002", uploadedAt: "2025-10-01T09:00:00.000Z", verified: false },
  { id: "res-3", title: "Recursion Explained", courseId: "course-1", category: "videos", fileName: "recursion_vid.mp4", uploadedBy: "user-1001", uploadedAt: "2025-10-10T16:45:00.000Z", verified: true },
  { id: "res-4", title: "Derivatives Practice Set", courseId: "course-2", category: "practice", fileName: "calc_derivatives.pdf", uploadedBy: "user-1003", uploadedAt: "2025-09-20T11:00:00.000Z", verified: false },
];

module.exports = { courses, resources };
