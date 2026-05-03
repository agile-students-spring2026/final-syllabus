const request = require("supertest");
const { expect } = require("chai");
const User = require("../models/User");
const Course = require("../models/Course");
const Resource = require("../models/Resource");
const app = require("../server");
const {
  seedMainFixtures,
  clearTestData,
  INVALID_OBJECTID,
  campusRepBearerToken,
} = require("./seedTestDb");
const { schoolMongoScope } = require("../lib/schoolScope");

const NYU_REP_EMAIL = "admintest-nyu@test.edu";
const TULSA_REP_EMAIL = "admintest-tulsa@test.edu";

let nyuToken;
let tulsaToken;

before(async () => {
  nyuToken = await campusRepBearerToken("NYU", NYU_REP_EMAIL);
  tulsaToken = await campusRepBearerToken("Tulsa University", TULSA_REP_EMAIL);
});

after(async () => {
  await User.deleteMany({ email: { $in: [NYU_REP_EMAIL, TULSA_REP_EMAIL] } });
});

const auth = (token) => ({ Authorization: `Bearer ${token}` });

describe("GET /api/admin/dashboard", () => {
  it("should reject without token", async () => {
    const res = await request(app).get("/api/admin/dashboard");
    expect(res.status).to.equal(401);
  });

  it("should return 200 with dashboard stats", async () => {
    const res = await request(app).get("/api/admin/dashboard").set(auth(nyuToken));
    expect(res.status).to.equal(200);
  });

  it("should include campusCode, school, verifiedCourses, verifiedResources", async () => {
    const res = await request(app).get("/api/admin/dashboard").set(auth(nyuToken));
    expect(res.body).to.have.property("campusCode");
    expect(res.body).to.have.property("school", "NYU");
    expect(res.body).to.have.property("verifiedCourses").that.is.a("number");
    expect(res.body).to.have.property("verifiedResources").that.is.a("number");
  });

  it("campusCode should be CMP1001", async () => {
    const res = await request(app).get("/api/admin/dashboard").set(auth(nyuToken));
    expect(res.body.campusCode).to.equal("CMP1001");
  });

  it("verified counts should match database totals for that campus rep school", async () => {
    const filter = schoolMongoScope("NYU");
    const [vc, idsAtSchool, res] = await Promise.all([
      Course.countDocuments({ status: "approved", school: filter }),
      Course.find({ school: filter }).distinct("_id"),
      request(app).get("/api/admin/dashboard").set(auth(nyuToken)),
    ]);
    const vr = await Resource.countDocuments({
      verified: true,
      course: { $in: idsAtSchool },
    });
    expect(res.status).to.equal(200);
    expect(res.body.verifiedCourses).to.equal(vc);
    expect(res.body.verifiedResources).to.equal(vr);
  });
});

describe("GET /api/admin/pending", () => {
  beforeEach(async () => {
    await clearTestData();
    await seedMainFixtures();
  });
  afterEach(async () => {
    await clearTestData();
  });

  it("should reject without token", async () => {
    const res = await request(app).get("/api/admin/pending");
    expect(res.status).to.equal(401);
  });

  it("should return 200 with an array", async () => {
    const res = await request(app).get("/api/admin/pending").set(auth(nyuToken));
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  it("should scope pending items to the campus rep school", async () => {
    const nyuRes = await request(app).get("/api/admin/pending").set(auth(nyuToken));
    const tulsaRes = await request(app).get("/api/admin/pending").set(auth(tulsaToken));
    expect(nyuRes.status).to.equal(200);
    expect(tulsaRes.status).to.equal(200);
    const nyuNames = nyuRes.body.map((i) => i.name);
    const tulsaNames = tulsaRes.body.map((i) => i.name);
    expect(nyuNames).to.include("HIST 301: Modern History");
    expect(tulsaNames).to.not.include("HIST 301: Modern History");
    expect(nyuNames).to.include("Week 1 notes");
    expect(tulsaNames).to.not.include("Week 1 notes");
    expect(tulsaNames).to.include("Midterm");
    expect(nyuNames).to.not.include("Midterm");
  });

  it("each item should have kind, name, category, status", async () => {
    const res = await request(app).get("/api/admin/pending").set(auth(nyuToken));
    res.body.forEach((item) => {
      expect(item).to.have.property("kind");
      expect(item).to.have.property("name");
      expect(item).to.have.property("category");
      expect(item).to.have.property("status", "pending");
    });
  });

  it("should contain both Course and Resource kinds for NYU rep", async () => {
    const res = await request(app).get("/api/admin/pending").set(auth(nyuToken));
    const kinds = res.body.map((i) => i.kind);
    expect(kinds).to.include("Course");
    expect(kinds).to.include("Resource");
  });
});


describe("GET /api/admin/courses/:id", () => {
  let fixtures;
  before(async () => {
    await clearTestData();
    fixtures = await seedMainFixtures();
  });
  after(async () => {
    await clearTestData();
  });

  it("should return 200 for a valid course id at same school", async () => {
    const res = await request(app)
      .get(`/api/admin/courses/${fixtures.cs101Id}`)
      .set(auth(nyuToken));
    expect(res.status).to.equal(200);
  });

  it("should reject course from another school", async () => {
    const res = await request(app)
      .get(`/api/admin/courses/${fixtures.calcId}`)
      .set(auth(nyuToken));
    expect(res.status).to.equal(403);
  });

  it("should return full course details", async () => {
    const res = await request(app)
      .get(`/api/admin/courses/${fixtures.cs101Id}`)
      .set(auth(nyuToken));
    expect(res.body).to.have.property("id", fixtures.cs101Id);
    expect(res.body).to.have.property("name");
    expect(res.body).to.have.property("description");
    expect(res.body).to.have.property("instructor");
    expect(res.body).to.have.property("duration");
    expect(res.body).to.have.property("level");
  });

  it("should include whatYoullLearn and modules arrays", async () => {
    const res = await request(app)
      .get(`/api/admin/courses/${fixtures.cs101Id}`)
      .set(auth(nyuToken));
    expect(res.body).to.have.property("whatYoullLearn").that.is.an("array");
    expect(res.body).to.have.property("modules").that.is.an("array");
  });

  it("should include a status field for pending", async () => {
    const res = await request(app)
      .get(`/api/admin/courses/${fixtures.pendingId}`)
      .set(auth(nyuToken));
    expect(res.body).to.have.property("status", "pending");
  });

  it("should return 404 for a non-existent course", async () => {
    const res = await request(app)
      .get(`/api/admin/courses/${INVALID_OBJECTID}`)
      .set(auth(nyuToken));
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("error");
  });
});


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
    const res = await request(app)
      .post(`/api/admin/courses/${fixtures.pendingId}/approve`)
      .set(auth(nyuToken));
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("success", true);
  });

  it("should return a message string", async () => {
    const res = await request(app)
      .post(`/api/admin/courses/${fixtures.pendingId}/approve`)
      .set(auth(nyuToken));
    expect(res.body).to.have.property("message").that.is.a("string");
  });

  it("should return 404 for a non-existent course", async () => {
    const res = await request(app)
      .post(`/api/admin/courses/${INVALID_OBJECTID}/approve`)
      .set(auth(nyuToken));
    expect(res.status).to.equal(404);
  });

  it("should not approve a course from another school", async () => {
    const res = await request(app)
      .post(`/api/admin/courses/${fixtures.calcId}/approve`)
      .set(auth(nyuToken));
    expect(res.status).to.equal(403);
  });
});


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
    const res = await request(app)
      .post(`/api/admin/courses/${fixtures.rejectId}/reject`)
      .set(auth(nyuToken));
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("success", true);
  });

  it("should return a message string", async () => {
    const res = await request(app)
      .post(`/api/admin/courses/${fixtures.rejectId}/reject`)
      .set(auth(nyuToken));
    expect(res.body).to.have.property("message").that.is.a("string");
  });

  it("should return 404 for a non-existent course", async () => {
    const res = await request(app)
      .post(`/api/admin/courses/${INVALID_OBJECTID}/reject`)
      .set(auth(nyuToken));
    expect(res.status).to.equal(404);
  });
});


describe("GET /api/admin/resources/:id", () => {
  let fixtures;
  before(async () => {
    await clearTestData();
    fixtures = await seedMainFixtures();
  });
  after(async () => {
    await clearTestData();
  });

  it("should return 200 for a valid course id at same school", async () => {
    const res = await request(app)
      .get(`/api/admin/resources/${fixtures.cs101Id}`)
      .set(auth(nyuToken));
    expect(res.status).to.equal(200);
  });

  it("should reject resources for a course at another school", async () => {
    const res = await request(app)
      .get(`/api/admin/resources/${fixtures.calcId}`)
      .set(auth(nyuToken));
    expect(res.status).to.equal(403);
  });

  it("should include courseId, courseName, types, resourceTypes", async () => {
    const res = await request(app)
      .get(`/api/admin/resources/${fixtures.cs101Id}`)
      .set(auth(nyuToken));
    expect(res.body).to.have.property("courseId", fixtures.cs101Id);
    expect(res.body).to.have.property("courseName");
    expect(res.body).to.have.property("types").that.is.an("array");
    expect(res.body).to.have.property("resourceTypes").that.is.a("string");
  });

  it("types array should be non-empty", async () => {
    const res = await request(app)
      .get(`/api/admin/resources/${fixtures.cs101Id}`)
      .set(auth(nyuToken));
    expect(res.body.types.length).to.be.greaterThan(0);
  });

  it("should include a resources array", async () => {
    const res = await request(app)
      .get(`/api/admin/resources/${fixtures.cs101Id}`)
      .set(auth(nyuToken));
    expect(res.body).to.have.property("resources").that.is.an("array");
  });

  it("should return 404 for non-existent course", async () => {
    const res = await request(app)
      .get(`/api/admin/resources/${INVALID_OBJECTID}`)
      .set(auth(nyuToken));
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("error");
  });
});


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
    const res = await request(app)
      .post(`/api/admin/resources/${fixtures.cs101Id}/approve`)
      .set(auth(nyuToken));
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("success", true);
  });

  it("should return a message string", async () => {
    const res = await request(app)
      .post(`/api/admin/resources/${fixtures.cs101Id}/approve`)
      .set(auth(nyuToken));
    expect(res.body).to.have.property("message").that.is.a("string");
  });

  it("should return 404 for a non-existent course", async () => {
    const res = await request(app)
      .post(`/api/admin/resources/${INVALID_OBJECTID}/approve`)
      .set(auth(nyuToken));
    expect(res.status).to.equal(404);
  });

  it("should not approve resources for another school's course", async () => {
    const res = await request(app)
      .post(`/api/admin/resources/${fixtures.calcId}/approve`)
      .set(auth(nyuToken));
    expect(res.status).to.equal(403);
  });
});


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
    const res = await request(app)
      .post(`/api/admin/resources/${fixtures.cs101Id}/reject`)
      .set(auth(nyuToken));
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("success", true);
  });

  it("should return a message string", async () => {
    const res = await request(app)
      .post(`/api/admin/resources/${fixtures.cs101Id}/reject`)
      .set(auth(nyuToken));
    expect(res.body).to.have.property("message").that.is.a("string");
  });

  it("should return 404 for a non-existent course", async () => {
    const res = await request(app)
      .post(`/api/admin/resources/${INVALID_OBJECTID}/reject`)
      .set(auth(nyuToken));
    expect(res.status).to.equal(404);
  });
});


describe("GET /api/admin/users", () => {
  it("should reject without token", async () => {
    const res = await request(app).get("/api/admin/users");
    expect(res.status).to.equal(401);
  });

  it("should return 200 with an array", async () => {
    const res = await request(app).get("/api/admin/users").set(auth(nyuToken));
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  it("should have at least one user", async () => {
    const res = await request(app).get("/api/admin/users").set(auth(nyuToken));
    expect(res.body.length).to.be.greaterThan(0);
  });

  it("each user should have id, name, email, campus, role", async () => {
    const res = await request(app).get("/api/admin/users").set(auth(nyuToken));
    res.body.forEach((user) => {
      expect(user).to.have.property("id");
      expect(user).to.have.property("name");
      expect(user).to.have.property("email");
      expect(user).to.have.property("campus");
      expect(user).to.have.property("role", "campus_rep");
    });
  });
});
