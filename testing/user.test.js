const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../server");
const connectDB = require("../config/db.config");

// Jest hooks to handle setup and teardown
beforeAll(async () => {
  // Connect to the database before running tests
  await connectDB();
});

afterAll(async () => {
  // Close the database connection after running tests
  await mongoose.connection.close();
});

describe("GET /back", () => {
  test("it should return status 200 and a message", async () => {
    const response = await request(app).get("/back");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("API is running....");
  });
});

describe("Users API", () => {
  test("POST /api/user/registerEmail", async () => {
    await request(app)
      .post("/api/user/registerEmail")
      .expect("Content-Type", /json/)
      .send({
        email: "test@gmail.com",
        password: "123456",
        rtgfg,
      })
      .expect(201)
      .expect((res) => {
        res.success = true;
        res.message = "User registered successfully";
        res.user = {
          email: "test@gmail.com",
          password:
            "$2a$10$rVSKHTKTAKTQWpZ9C2IlfekywPOmXSuuaP3NUJ3n3kkp4qJgOOlaO",
          user_role: "User",
          email_otp: "lm9t",
          user_verfied: false,
          _id: "654df413db44a14daa517783",
          createdAt: "2023-11-10T09:12:51.713Z",
          updatedAt: "2023-11-10T09:12:51.713Z",
          __v: 0,
        };
      });
  });

  test("POST /api/user/verifyEmail", async () => {
    await request(app)
      .post("/api/user/verifyEmail")
      .expect("Content-Type", /json/)
      .send({
        email: "test@gmail.com",
        email_otp: "lm9t",
      })
      .expect(201)
      .expect((res) => {
        res.success = true;
        res.message = "User verified successfully";
        res.user = {
          _id: "654dfbba5cf1263d5007573a",
          email: "test@gmail.com",
          password:
            "$2a$10$kVkrZf0YZ1XkBoXZzqm4O.z0PCyprPodQvkLoX6tM7/gE927G3iTq",
          user_role: "User",
          email_otp: "",
          user_verfied: true,
          createdAt: "2023-11-10T09:45:30.439Z",
          updatedAt: "2023-11-10T09:45:41.663Z",
          __v: 0,
        };
      });
    jest.setTimeout(30000);
  });
});
