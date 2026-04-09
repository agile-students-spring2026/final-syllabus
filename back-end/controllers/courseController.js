const courses = [
  {
    id: "1",
    title: "Intro to Programming",
    description: "Learn the basics of programming using hands-on practice.",
    professor: "Dr. Smith",
    credits: 4
  },
  {
    id: "2",
    title: "Data Structures",
    description: "Study lists, stacks, queues, trees, and graphs.",
    professor: "Dr. Lee",
    credits: 4
  },
  {
    id: "3",
    title: "Web Development",
    description: "Build responsive front-end and back-end web applications.",
    professor: "Dr. Johnson",
    credits: 4
  }
];

const savedCourses = [];

const courseResources = {
  "1": [
    { id: "r1", name: "Syllabus", type: "pdf", url: "/files/intro-programming-syllabus.pdf" },
    { id: "r2", name: "Lecture 1 Slides", type: "slides", url: "/files/intro-programming-lecture1.pdf" }
  ],
  "2": [
    { id: "r3", name: "Linked Lists Notes", type: "pdf", url: "/files/data-structures-linked-lists.pdf" },
    { id: "r4", name: "Stacks Practice", type: "doc", url: "/files/data-structures-stacks.docx" }
  ],
  "3": [
    { id: "r5", name: "HTML/CSS Guide", type: "pdf", url: "/files/web-dev-html-css-guide.pdf" },
    { id: "r6", name: "Express Intro", type: "pdf", url: "/files/web-dev-express-intro.pdf" }
  ]
};

const getCourseById = (req, res) => {
  const { id } = req.params;

  const course = courses.find((c) => c.id === id);

  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  return res.status(200).json(course);
};

const saveCourseById = (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  const course = courses.find((c) => c.id === id);

  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  const alreadySaved = savedCourses.find(
    (entry) => entry.userId === userId && entry.courseId === id
  );

  if (alreadySaved) {
    return res.status(409).json({ error: "Course already saved" });
  }

  const savedCourse = {
    id: `saved-${Date.now()}`,
    userId,
    courseId: id
  };

  savedCourses.push(savedCourse);

  return res.status(201).json({
    message: "Course saved successfully",
    savedCourse
  });
};

const getCourseResourcesById = (req, res) => {
  const { id } = req.params;

  const course = courses.find((c) => c.id === id);

  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  const resources = courseResources[id] || [];

  return res.status(200).json({
    courseId: id,
    resources
  });
};

module.exports = {
  getCourseById,
  saveCourseById,
  getCourseResourcesById
};