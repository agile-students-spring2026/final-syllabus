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

const getCourseById = (req, res) => {
  const { id } = req.params;

  const course = courses.find((c) => c.id === id);

  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  return res.status(200).json(course);
};

module.exports = {
  getCourseById
};