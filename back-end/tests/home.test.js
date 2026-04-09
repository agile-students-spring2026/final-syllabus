const request = require("supertest");
const { expect } = require("chai");
const app = require("../server");

describe("GET /api/", () => {
  it("should return a welcome message", async () => {
    const res = await request(app).get("/api/");
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("message");
  });
});

describe("GET /api/courses", () => {
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
    const res = await request(app).get("/api/courses?recent=Today");
    expect(res.status).to.equal(200);
    res.body.forEach((c) => {
      expect(c.recent).to.equal("Today");
    });
  });

  it("should return empty array for non-matching search", async () => {
    const res = await request(app).get("/api/courses?search=xyznonexistent");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.equal(0);
  });
});

describe("GET /api/courses/:id", () => {
  it("should return a single course by id", async () => {
    const res = await request(app).get("/api/courses/1");
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("id", 1);
    expect(res.body).to.have.property("name");
  });

  it("should return 404 for a non-existent course id", async () => {
    const res = await request(app).get("/api/courses/9999");
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("error");
  });

  it("course should include modules and resources arrays", async () => {
    const res = await request(app).get("/api/courses/1");
    expect(res.body).to.have.property("modules").that.is.an("array");
    expect(res.body).to.have.property("resources").that.is.an("array");
  });
});
