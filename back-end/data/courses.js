const courses = [
  {
    name: "Intro to Computer Science",
    code: "CS101",
    description: "A beginner-friendly introduction to computer science concepts.",
    category: "Computer Science",
    school: "NYU",
    instructor: "Dr. Smith",
    duration: "16 weeks",
    level: "Beginner",
    whatYoullLearn: ["Basic programming", "Data structures", "Algorithms"],
    modules: ["Week 1: Intro", "Week 2: Variables", "Week 3: Loops"],
    status: "pending",
  },
  {
    name: "Calculus I",
    code: "MATH201",
    description: "Differential and integral calculus for beginners.",
    category: "Mathematics",
    school: "NYU",
    instructor: "Prof. Johnson",
    duration: "16 weeks",
    level: "Intermediate",
    whatYoullLearn: ["Limits", "Derivatives", "Integrals"],
    modules: ["Week 1: Limits", "Week 2: Derivatives", "Week 3: Chain Rule"],
    status: "pending",
  },
];

module.exports = { courses };
