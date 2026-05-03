const request = require("supertest");
const { expect } = require("chai");
const jwt = require("jsonwebtoken");
const app = require("../server");
const User = require("../models/User");
const {
  seedMainFixtures,
  clearTestData,
  INVALID_OBJECTID,
  studentBearerToken,
} = require("./seedTestDb");

describe("GET /api/", () => {
  it("should return a welcome message", async () => {
    const res = await request(app).get("/api/");
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("message");
  });
});

describe("GET /api/courses (MongoDB)", () => {
  let fixtures;

  before(async () => {
    fixtures = await seedMainFixtures();
  });

  after(async () => {
    await clearTestData();
  });

  it("should return an array of courses", async () => {
    const res = await request(app).get("/api/courses");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.be.greaterThan(0);
  });

  it("each course should have id, name, description, category, school", async () => {
    const res = await request(app).get("/api/courses");
    const course = res.body[0];
    expect(course).to.have.property("id");
    expect(course).to.have.property("name");
    expect(course).to.have.property("description");
    expect(course).to.have.property("category");
    expect(course).to.have.property("school");
  });

  it("should filter by search query", async () => {
    const res = await request(app).get("/api/courses?search=calculus");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.be.greaterThan(0);
    expect(res.body[0].name.toLowerCase()).to.include("calculus");
  });

  it("should filter by category", async () => {
    const res = await request(app).get("/api/courses?category=History");
    expect(res.status).to.equal(200);
    res.body.forEach((c) => {
      expect(c.category).to.equal("History");
    });
  });

  it("should filter by recent", async () => {
    const res = await request(app).get(`/api/courses?recent=Today`);
    expect(res.status).to.equal(200);
    res.body.forEach((c) => {
      expect(c.recent).to.equal("Today");
    });
  });

  it("should filter by materialType (courses with that resource kind)", async () => {
    const notesRes = await request(app).get("/api/courses?materialType=notes");
    expect(notesRes.status).to.equal(200);
    const noteIds = notesRes.body.map((c) => c.id);
    expect(noteIds).to.include(fixtures.cs101Id);
    expect(noteIds).to.not.include(fixtures.calcId);

    const practiceRes = await request(app).get("/api/courses?materialType=practice");
    expect(practiceRes.status).to.equal(200);
    const practiceIds = practiceRes.body.map((c) => c.id);
    expect(practiceIds).to.include(fixtures.calcId);
    expect(practiceIds).to.not.include(fixtures.cs101Id);
  });

  it("should return empty array for non-matching search", async () => {
    const res = await request(app).get("/api/courses?search=xyznonexistent");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.equal(0);
  });
});

describe("GET /api/courses/:id (MongoDB)", () => {
  let fixtures;

  before(async () => {
    fixtures = await seedMainFixtures();
  });

  after(async () => {
    await clearTestData();
  });

  it("should return a single course by id", async () => {
    const res = await request(app).get(`/api/courses/${fixtures.cs101Id}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("id", fixtures.cs101Id);
    expect(res.body).to.have.property("name");
  });

  it("should return 400 for an invalid id", async () => {
    const res = await request(app).get("/api/courses/notanid");
    expect(res.status).to.equal(400);
  });

  it("should return 404 for a non-existent course id", async () => {
    const res = await request(app).get(`/api/courses/${INVALID_OBJECTID}`);
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("error");
  });

  it("course should include modules and resources arrays", async () => {
    const res = await request(app).get(`/api/courses/${fixtures.cs101Id}`);
    expect(res.body).to.have.property("modules").that.is.an("array");
    expect(res.body).to.have.property("resources").that.is.an("array");
    expect(res.body.resources.length).to.be.greaterThan(0);
  });
});

describe("School scope with Bearer token", () => {
  let fixtures;
  let nyuToken;

  before(async () => {
    fixtures = await seedMainFixtures();
    nyuToken = await studentBearerToken("NYU", "school-scope-student@test.edu");
  });

  after(async () => {
    await User.deleteMany({
      email: {
        $in: ["school-scope-student@test.edu", "school-scope-synonym@test.edu"],
      },
    });
    await clearTestData();
  });

  it("lists only courses matching the viewer school", async () => {
    const res = await request(app).get("/api/courses").set("Authorization", `Bearer ${nyuToken}`);
    expect(res.status).to.equal(200);
    expect(res.body.every((c) => (c.school || "").toLowerCase() === "nyu")).to.be.true;
    const ids = res.body.map((c) => c.id);
    expect(ids).to.include(fixtures.cs101Id);
    expect(ids).to.not.include(fixtures.calcId);
  });

  it("returns 404 for course detail outside viewer school", async () => {
    const res = await request(app)
      .get(`/api/courses/${fixtures.calcId}`)
      .set("Authorization", `Bearer ${nyuToken}`);
    expect(res.status).to.equal(404);
  });

  it("returns course detail when school matches", async () => {
    const res = await request(app)
      .get(`/api/courses/${fixtures.cs101Id}`)
      .set("Authorization", `Bearer ${nyuToken}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("school", "NYU");
  });

  it("scopes nested resources route by viewer school", async () => {
    const ok = await request(app)
      .get(`/api/courses/${fixtures.cs101Id}/resources`)
      .set("Authorization", `Bearer ${nyuToken}`);
    expect(ok.status).to.equal(200);

    const denied = await request(app)
      .get(`/api/courses/${fixtures.calcId}/resources`)
      .set("Authorization", `Bearer ${nyuToken}`);
    expect(denied.status).to.equal(404);
  });

  it("scopes resources history by viewer school", async () => {
    const res = await request(app).get("/api/resources/history").set("Authorization", `Bearer ${nyuToken}`);
    expect(res.status).to.equal(200);
    expect(res.body.resources.some((r) => r.title === "Week 1 notes")).to.be.true;
    expect(res.body.resources.some((r) => r.title === "Midterm")).to.be.false;
  });

  it("treats NYU and full NYU label as the same campus", async () => {
    const synonymToken = await studentBearerToken(
      "New York University (NYU)",
      "school-scope-synonym@test.edu"
    );
    const res = await request(app).get("/api/courses").set("Authorization", `Bearer ${synonymToken}`);
    expect(res.status).to.equal(200);
    expect(res.body.map((c) => c.id)).to.include(fixtures.cs101Id);
  });

  it("returns empty course list when logged in without a school", async () => {
    await User.deleteMany({ email: "noschool@test.edu" });
    const u = await User.create({
      fullName: "No School",
      email: "noschool@test.edu",
      password: "password123",
      role: "student",
    });
    const token = jwt.sign(
      { id: u._id.toString(), email: u.email, role: u.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    const res = await request(app).get("/api/courses").set("Authorization", `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal([]);
    await User.deleteMany({ email: "noschool@test.edu" });
  });
});
