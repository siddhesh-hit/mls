const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

const app = require("../server");

// Jest hooks to handle setup and teardown
let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  console.log(uri);
  await mongoose.createConnection(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
});

// beforeEach(async () => {
//   // Reset the database before each test
//   await mongoose.connection.dropDatabase();
// });

// describe("GET /back", () => {
//   test("it should return status 200 and a message", async () => {
//     const response = await request(app).get("/back");
//     expect(response.status).toBe(200);
//     expect(response.body.message).toBe("API is running....");
//   });
// });

describe("Users API", () => {
  test("POST /api/user/registerEmail", async () => {
    const response = await request(app)
      .post("/api/user/registerEmail")
      .expect("Content-Type", /json/)
      .send({
        email: "test1@gmail.com",
        password: "123456",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("User registered successfully");
    expect(response.body.user).toBeDefined();
  });

  test("POST /api/user/verifyEmail", async () => {
    const resEmail = await request(app)
      .post("/api/user/registerEmail")
      .expect("Content-Type", /json/)
      .send({
        email: "test1@gmail.com",
        password: "123456",
      });
    expect(resEmail.status).toBe(201);
    expect(resEmail.body.success).toBe(true);
    expect(resEmail.body.message).toBe("User registered successfully");
    expect(resEmail.body.user).toBeDefined();

    const response = await request(app)
      .post("/api/user/verifyEmail")
      .expect("Content-Type", /json/)
      .send({
        email: resEmail.body.user.email,
        email_otp: resEmail.body.user.email_otp,
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("User verified successfully");
    expect(response.body.user).toBeDefined();
  });

  test("POST /api/user/loginEmail", async () => {
    const response = await request(app).post("/api/user/loginEmail").send({
      email: "test1@gmail.com",
      password: "123456",
    });

    console.log(response.error);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("User logged in successfully");
    expect(response.body.user).toBeDefined();
    expect(response.body.access_token).toBeDefined();
    expect(response.body.refresh_token).toBeDefined();
  });
});
