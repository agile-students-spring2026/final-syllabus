const request = require("supertest");
const { expect } = require("chai");
const app = require("../server");
const { seedMainFixtures, clearTestData, INVALID_OBJECTID } = require("./seedTestDb");

// ── GET /api/admin/dashboard ────────────────────────────────────────────────

describe("GET /api/admin/dashboard", () => {
  it("should return 200 with dashboard stats", async () => {
    const res = await request(app).get("/api/admin/dashboard");
    expect(res.status).to.equal(200);
  });

  it("should include campusCode, verifiedCourses, verifiedResources", async () => {
    const res = await request(app).get("/api/admin/dashboard");
    expect(res.body).to.have.property("campusCode");
    expect(res.body).to.have.property("verifiedCourses").that.is.a("number");
    expect(res.body).to.have.property("verifiedResources").that.is.a("number");
  });

  it("campusCode should be CMP1001", async () => {
    const res = await request(app).get("/api/admin/dashboard");
    expect(res.body.campusCode).to.equal("CMP1001");
  });

  it("verified counts should match database totals", async () => {
    const Course = require("../models/Course");
    const Resource = require("../models/Resource");
    const [vc, vr, res] = await Promise.all([
      Course.countDocuments({ status: "approved" }),
      Resource.countDocuments({ verified: true }),
      request(app).get("/api/admin/dashboard"),
    ]);
    expect(res.status).to.equal(200);
    expect(res.body.verifiedCourses).to.equal(vc);
    expect(res.body.verifiedResources).to.equal(vr);
  });
});

// ── GET /api/admin/pending ──────────────────────────────────────────────────

describe("GET /api/admin/pending", () => {
  beforeEach(async () => {
    const { clearTestData, seedMainFixtures } = require("./seedTestDb");
    await clearTestData();
    await seedMainFixtures();
  });
  afterEach(async () => {
    const { clearTestData } = require("./seedTestDb");
    await clearTestData();
  });

  it("should return 200 with an array", async () => {
    const res = await request(app).get("/api/admin/pending");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  it("should have at least one pending item when data exists", async () => {
    const res = await request(app).get("/api/admin/pending");
    expect(res.body.length).to.be.greaterThan(0);
  });

  it("each item should have kind, name, category, status", async () => {
    const res = await request(app).get("/api/admin/pending");
    res.body.forEach((item) => {
      expect(item).to.have.property("kind");
      expect(item).to.have.property("name");
      expect(item).to.have.property("category");
      expect(item).to.have.property("status", "pending");
    });
  });

  it("should contain both Course and Resource kinds", async () => {
    const res = await request(app).get("/api/admin/pending");
    const kinds = res.body.map((i) => i.kind);
    expect(kinds).to.include("Course");
    expect(kinds).to.include("Resource");
  });
});

// ── GET /api/admin/courses/:id ──────────────────────────────────────────────

describe("GET /api/admin/courses/:id", () => {
  let fixtures;
  before(async () => {
    await clearTestData();
    fixtures = await seedMainFixtures();
  });
  after(async () => {
    await clearTestData();
  });

  it("should return 200 for a valid course id", async () => {
    const res = await request(app).get(`/api/admin/courses/${fixtures.cs101Id}`);
    expect(res.status).to.equal(200);
  });

  it("should return full course details", async () => {
    const res = await request(app).get(`/api/admin/courses/${fixtures.cs101Id}`);
    expect(res.body).to.have.property("id", fixtures.cs101Id);
    expect(res.body).to.have.property("name");
    expect(res.body).to.have.property("description");
    expect(res.body).to.have.property("instructor");
    expect(res.body).to.have.property("duration");
    expect(res.body).to.have.property("level");
  });

  it("should include whatYoullLearn and modules arrays", async () => {
    const res = await request(app).get(`/api/admin/courses/${fixtures.cs101Id}`);
    expect(res.body).to.have.property("whatYoullLearn").that.is.an("array");
    expect(res.body).to.have.property("modules").that.is.an("array");
  });

  it("should include a status field for pending", async () => {
    const res = await request(app).get(`/api/admin/courses/${fixtures.pendingId}`);
    expect(res.body).to.have.property("status", "pending");
  });

  it("should return 404 for a non-existent course", async () => {
    const res = await request(app).get(`/api/admin/courses/${INVALID_OBJECTID}`);
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("error");
  });
});

// ── POST /api/admin/courses/:id/approve ────────────────────────────────────

describe("POST /api/admin/courses/:id/approve", () => {
  let fixtures;
  beforeEach(async () => {
    await clearTestData();
    fixtures = await seedMainFixtures();
  });
  afterEach(async () => {
    await clearTestData();
  });

  it("should return 200 with success true", async () => {
    const res = await request(app).post(`/api/admin/courses/${fixtures.pendingId}/approve`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("success", true);
  });

  it("should return a message string", async () => {
    const res = await request(app).post(`/api/admin/courses/${fixtures.pendingId}/approve`);
    expect(res.body).to.have.property("message").that.is.a("string");
  });

  it("should return 404 for a non-existent course", async () => {
    const res = await request(app).post(`/api/admin/courses/${INVALID_OBJECTID}/approve`);
    expect(res.status).to.equal(404);
  });
});

// ── POST /api/admin/courses/:id/reject ─────────────────────────────────────

describe("POST /api/admin/courses/:id/reject", () => {
  let fixtures;
  beforeEach(async () => {
    await clearTestData();
    fixtures = await seedMainFixtures();
  });
  afterEach(async () => {
    await clearTestData();
  });

  it("should return 200 with success true", async () => {
    const res = await request(app).post(`/api/admin/courses/${fixtures.rejectId}/reject`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("success", true);
  });

  it("should return a message string", async () => {
    const res = await request(app).post(`/api/admin/courses/${fixtures.rejectId}/reject`);
    expect(res.body).to.have.property("message").that.is.a("string");
  });

  it("should return 404 for a non-existent course", async () => {
    const res = await request(app).post(`/api/admin/courses/${INVALID_OBJECTID}/reject`);
    expect(res.status).to.equal(404);
  });
});

// ── GET /api/admin/resources/:id ───────────────────────────────────────────

describe("GET /api/admin/resources/:id", () => {
  let fixtures;
  before(async () => {
    await clearTestData();
    fixtures = await seedMainFixtures();
  });
  after(async () => {
    await clearTestData();
  });

  it("should return 200 for a valid course id", async () => {
    const res = await request(app).get(`/api/admin/resources/${fixtures.cs101Id}`);
    expect(res.status).to.equal(200);
  });

  it("should include courseId, courseName, types, resourceTypes", async () => {
    const res = await request(app).get(`/api/admin/resources/${fixtures.cs101Id}`);
    expect(res.body).to.have.property("courseId", fixtures.cs101Id);
    expect(res.body).to.have.property("courseName");
    expect(res.body).to.have.property("types").that.is.an("array");
    expect(res.body).to.have.property("resourceTypes").that.is.a("string");
  });

  it("types array should be non-empty", async () => {
    const res = await request(app).get(`/api/admin/resources/${fixtures.cs101Id}`);
    expect(res.body.types.length).to.be.greaterThan(0);
  });

  it("should include a resources array", async () => {
    const res = await request(app).get(`/api/admin/resources/${fixtures.calcId}`);
    expect(res.body).to.have.property("resources").that.is.an("array");
  });

  it("should return 404 for non-existent course", async () => {
    const res = await request(app).get(`/api/admin/resources/${INVALID_OBJECTID}`);
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("error");
  });
});

// ── POST /api/admin/resources/:id/approve ──────────────────────────────────

describe("POST /api/admin/resources/:id/approve", () => {
  let fixtures;
  beforeEach(async () => {
    await clearTestData();
    fixtures = await seedMainFixtures();
  });
  afterEach(async () => {
    await clearTestData();
  });

  it("should return 200 with success true", async () => {
    const res = await request(app).post(`/api/admin/resources/${fixtures.cs101Id}/approve`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("success", true);
  });

  it("should return a message string", async () => {
    const res = await request(app).post(`/api/admin/resources/${fixtures.cs101Id}/approve`);
    expect(res.body).to.have.property("message").that.is.a("string");
  });

  it("should return 404 for a non-existent course", async () => {
    const res = await request(app).post(`/api/admin/resources/${INVALID_OBJECTID}/approve`);
    expect(res.status).to.equal(404);
  });
});

// ── POST /api/admin/resources/:id/reject ───────────────────────────────────

describe("POST /api/admin/resources/:id/reject", () => {
  let fixtures;
  beforeEach(async () => {
    await clearTestData();
    fixtures = await seedMainFixtures();
  });
  afterEach(async () => {
    await clearTestData();
  });

  it("should return 200 with success true", async () => {
    const res = await request(app).post(`/api/admin/resources/${fixtures.cs101Id}/reject`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("success", true);
  });

  it("should return a message string", async () => {
    const res = await request(app).post(`/api/admin/resources/${fixtures.cs101Id}/reject`);
    expect(res.body).to.have.property("message").that.is.a("string");
  });

  it("should return 404 for a non-existent course", async () => {
    const res = await request(app).post(`/api/admin/resources/${INVALID_OBJECTID}/reject`);
    expect(res.status).to.equal(404);
  });
});

// ── GET /api/admin/users ───────────────────────────────────────────────────

describe("GET /api/admin/users", () => {
  it("should return 200 with an array", async () => {
    const res = await request(app).get("/api/admin/users");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  it("should have at least one user", async () => {
    const res = await request(app).get("/api/admin/users");
    expect(res.body.length).to.be.greaterThan(0);
  });

  it("each user should have id, name, email, campus, role", async () => {
    const res = await request(app).get("/api/admin/users");
    res.body.forEach((user) => {
      expect(user).to.have.property("id");
      expect(user).to.have.property("name");
      expect(user).to.have.property("email");
      expect(user).to.have.property("campus");
      expect(user).to.have.property("role", "campus_rep");
    });
  });
});
