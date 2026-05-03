import { expect } from "chai";
import express from "express";
import authRoutes from "../routes/auth.js";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

async function request(method, path, body) {
  const { default: http } = await import("http");
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: "127.0.0.1",
      port: 5001,
      path,
      method: method.toUpperCase(),
      headers: {
        "Content-Type": "application/json",
        ...(data ? { "Content-Length": Buffer.byteLength(data) } : {}),
      },
    };
    const req = http.request(options, (res) => {
      let raw = "";
      res.on("data", (chunk) => (raw += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(raw) });
        } catch {
          resolve({ status: res.statusCode, body: raw });
        }
      });
    });
    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}

let server;

before((done) => {
  server = app.listen(5001, done);
});

after((done) => {
  server.close(done);
});

describe("POST /api/auth/signup", () => {
  it("creates a new account with valid data", async () => {
    const res = await request("POST", "/api/auth/signup", {
      fullName: "Jane Doe",
      email: "jane@school.edu",
      password: "pass1234",
      confirmPassword: "pass1234",
    });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("message", "Account created successfully");
    expect(res.body.user).to.include({ email: "jane@school.edu", role: "student" });
  });

  it("returns 400 when a field is missing", async () => {
    const res = await request("POST", "/api/auth/signup", {
      email: "noname@school.edu",
      password: "pass1234",
      confirmPassword: "pass1234",
    });
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("error");
  });

  it("returns 400 when passwords do not match", async () => {
    const res = await request("POST", "/api/auth/signup", {
      fullName: "Test User",
      email: "test@school.edu",
      password: "pass1234",
      confirmPassword: "different",
    });
    expect(res.status).to.equal(400);
    expect(res.body.error).to.equal("Passwords do not match");
  });

  it("returns 409 when email is already registered", async () => {
    const userData = {
      fullName: "Duplicate",
      email: "dup@school.edu",
      password: "pass1234",
      confirmPassword: "pass1234",
    };
    await request("POST", "/api/auth/signup", userData);
    const res = await request("POST", "/api/auth/signup", userData);
    expect(res.status).to.equal(409);
    expect(res.body.error).to.equal("Email already in use");
  });
});

describe("POST /api/auth/login", () => {
  before(async () => {
    await request("POST", "/api/auth/signup", {
      fullName: "Login User",
      email: "loginuser@school.edu",
      password: "mypassword",
      confirmPassword: "mypassword",
    });
  });

  it("logs in with correct credentials", async () => {
    const res = await request("POST", "/api/auth/login", {
      email: "loginuser@school.edu",
      password: "mypassword",
    });
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("Login successful");
  });

  it("returns 401 with wrong password", async () => {
    const res = await request("POST", "/api/auth/login", {
      email: "loginuser@school.edu",
      password: "wrongpassword",
    });
    expect(res.status).to.equal(401);
  });

  it("returns 400 when fields are missing", async () => {
    const res = await request("POST", "/api/auth/login", { email: "loginuser@school.edu" });
    expect(res.status).to.equal(400);
  });
});

describe("POST /api/auth/campus-rep/login", () => {
  it("logs in campus rep with correct credentials", async () => {
    const res = await request("POST", "/api/auth/campus-rep/login", {
      email: "rep@school.edu",
      password: "rep123",
    });
    expect(res.status).to.equal(200);
    expect(res.body.user.role).to.equal("campus-rep");
  });

  it("returns 401 with wrong credentials", async () => {
    const res = await request("POST", "/api/auth/campus-rep/login", {
      email: "rep@school.edu",
      password: "wrongpass",
    });
    expect(res.status).to.equal(401);
  });

  it("returns 400 when fields are missing", async () => {
    const res = await request("POST", "/api/auth/campus-rep/login", {});
    expect(res.status).to.equal(400);
  });
});
