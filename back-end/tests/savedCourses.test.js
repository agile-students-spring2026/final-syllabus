const request = require("supertest");
const { expect } = require("chai");
const app = require("../server");

describe("GET /api/saved-courses", () => {
  it("should return an array of saved courses for guest user", async () => {
    const res = await request(app).get("/api/saved-courses?userId=guest");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  it("should return empty array for a user with no saved courses", async () => {
    const res = await request(app).get("/api/saved-courses?userId=unknownUser");
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal([]);
  });
});

describe("POST /api/saved-courses", () => {
  it("should save a course for a user", async () => {
    const res = await request(app)
      .post("/api/saved-courses")
      .send({ courseId: 2, userId: "testUser" });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("message");
    expect(res.body).to.have.property("courseId");
  });

  it("should return 400 when courseId is missing", async () => {
    const res = await request(app)
      .post("/api/saved-courses")
      .send({ userId: "testUser" });
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("error");
  });

  it("should return 404 when courseId does not exist", async () => {
    const res = await request(app)
      .post("/api/saved-courses")
      .send({ courseId: 9999, userId: "testUser" });
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("error");
  });
});

describe("DELETE /api/saved-courses/:id", () => {
  it("should remove a saved course", async () => {
    await request(app)
      .post("/api/saved-courses")
      .send({ courseId: 4, userId: "deleteTestUser" });

    const res = await request(app).delete(
      "/api/saved-courses/4?userId=deleteTestUser"
    );
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("message");
    expect(res.body).to.have.property("courseId", 4);
  });

  it("should return 404 when user has no saved courses", async () => {
    const res = await request(app).delete(
      "/api/saved-courses/1?userId=noSavedUser"
    );
    expect(res.status).to.equal(404);
  });
});
