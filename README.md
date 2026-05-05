# Syllabus+

Deployed app: [link](https://final-syllabus-frontend.vercel.app/)

## Product Vision Statement

Syllabus+ is a mobile web application that enables college students to create, share, and access reliable peer-created learning resources for their courses.

Our team did CD for the extra credit part of sprint 4, and this was done through vercel. Everytime a push is made to the master branch, vercel creates a new deployment, automatically rebuilding the app. 

Additionally, our team did CI using Vercel as well. Everytime a push is made to the master branch, Vercel automatically runs tests to determine if a branch should be merged or not.

---

## Overview

Many students rely on notes, flashcards, and study guides made by other students, but these resources are often difficult to find, inconsistent in quality, and unverified. Syllabus+ addresses this by:

- Providing a platform where students can build “mini-courses” aligned with official syllabi  
- Allowing students to create or contribute resources like written explanations, flashcards, practice questions, quizzes, and short videos  
- Implementing a verification system managed by campus representatives to ensure quality and reliability  
- Offering browsing, searching, and filtering features to easily access trusted content  
- Enabling students to track progress and provide feedback  

The primary users are college students seeking supplemental academic resources, especially those who understand material better from peer-created content.

---

## Core Team Members

- **Abir Mahmood** (Scrum Master) – GitHub: [link](https://github.com/abirmahmood6)  
- **Mohamed Mudawi** (Product Owner) – GitHub: [link](https://github.com/Mohamed-Mudawi)  
- **Yusef Moustafa** – GitHub: TBD  
- **Richmond** – GitHub: [link](https://github.com/iam-agyenim)  

> All team members serve as Developers. Scrum Master and Product Owner roles rotate every Sprint.

---

## Project History & Contributions

Syllabus+ was proposed as a solution to help students access reliable peer-created learning resources that are otherwise scattered or unverified. Contributions to the project will follow the guidelines outlined in [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Task Boards

🔗 **Task Board Link:** [Syllabus+ Task Board](https://github.com/orgs/agile-students-spring2026/projects/19)

---

## Prerequisites

- **Node.js** v18 or higher (`node --version` to check)
- **npm** v9 or higher
- A **MongoDB** connection string — either [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier) or a local `mongod` instance

---

## Build & Run Instructions

### 1. Clone the repository

```bash
git clone https://github.com/agile-students-spring2026/final-syllabus.git
cd final-syllabus
```

### 2. Set up the back-end

```bash
cd back-end
npm install
```

Create a `.env` file inside `back-end/` with the following:

```
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/syllabus
JWT_SECRET=your_jwt_secret_here
PORT=5001
```

Start the development server (auto-restarts on file changes):

```bash
npm run dev
```

Or without auto-restart:

```bash
npm start
```

The API will be available at `http://localhost:5001`.

---

### 3. Set up the front-end

Open a **new terminal tab**, then:

```bash
cd front-end
npm install
npm start
```

The app opens automatically at `http://localhost:3000`.

> If you changed the back-end port, create a `front-end/.env` file and add:
> ```
> REACT_APP_API_URL=http://localhost:<your-port>/api
> ```

---

## Running Tests

From the `back-end/` directory:

```bash
# Run all tests
npm test

# Run with coverage report
npm run coverage
```

---

## Project Structure

```
final-syllabus/
├── back-end/
│   ├── controllers/       # Route handler logic
│   ├── middleware/        # JWT auth middleware
│   ├── models/            # Mongoose schemas (Course, Resource, User, SavedCourse)
│   ├── routes/            # Express routers
│   ├── uploads/
│   │   ├── course-images/ # Uploaded course cover images
│   │   └── resources/     # Uploaded study resource files
│   ├── tests/             # Mocha/Chai/Supertest test suites
│   └── server.js          # Entry point
└── front-end/
    └── src/
        ├── components/    # Shared components (Navbar, CourseCard, etc.)
        ├── context/       # AuthContext, VerificationContext
        ├── pages/         # One file per screen/route
        └── App.jsx        # Route definitions
```

---

## Key API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Log in, returns JWT |
| `GET` | `/api/courses` | List all approved courses |
| `GET` | `/api/courses/all` | List all courses (any status) |
| `POST` | `/api/courses/create` | Create a course (with image upload) |
| `GET` | `/api/courses/:id` | Get a single course |
| `POST` | `/api/courses/:id/save` | Save a course (auth required) |
| `GET` | `/api/courses/:id/resources` | Get verified resources for a course |
| `POST` | `/api/resources/upload` | Upload a resource file (auth required) |
| `GET` | `/api/resources/history` | Current user's upload history (auth required) |
| `GET` | `/api/admin/pending` | List pending courses and resources |
| `POST` | `/api/admin/courses/:id/approve` | Approve a course |
| `POST` | `/api/admin/resources/:id/approve` | Approve all resources for a course |

---

## User Roles

| Role | Access |
|---|---|
| **Student** | Browse courses, save courses, view resources, upload resources |
| **Campus Rep (Admin)** | Everything above + review and approve/reject pending courses and resources |

---
