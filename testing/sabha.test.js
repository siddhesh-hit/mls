const request = require("supertest");

const { connectDB, quitDB } = require("../config/test.config");
const app = require("../server");

// Jest hooks to handle setup and teardown
beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await quitDB();
});

// test cases
describe("Sabha API", () => {
  test("POST /api/sabha/", async () => {
    const response = await request(app)
      .post("/api/sabha/")
      .set("Accept", "application/json")
      .set("Cookie", [
        "accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NTVhODdlZmYyYWU5NGE1NmQwNzAyYyIsImVtYWlsIjoidmFpbnNpZGRAZ21haWwuY29tIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNzAwMTk2NzEwLCJleHAiOjE3MDAxOTc2MTB9.wP2WNGzfQiQL_uUjneX_AGMCi0OFBBtk7j1lvqnQOhI; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NTVhODdlZmYyYWU5NGE1NmQwNzAyYyIsImVtYWlsIjoidmFpbnNpZGRAZ21haWwuY29tIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNzAwMTk2NzEwLCJleHAiOjE3MDA4MDE1MTB9.nvWnhXb8aXQcO6mrr7IA2lKyDEeJzRJOJs6f00hwdKk",
      ])
      .send({
        marathi: {
          title: "श्री गणेश चतुर्थी",
          description: "Welcome to Ganesh Chaturthi",
          banner_image: {
            fieldname: "banner_image_mr",
            originalname: "infra1.drawio.png",
            encoding: "7bit",
            mimetype: "image/png",
            destination: "images/sabha",
            filename: "1700127295797-infra1.drawio.png",
            path: "images\\sabha\\1700127295797-infra1.drawio.png",
            size: 547825,
          },
          legislative_council: [
            {
              council_profile: {
                fieldname: "banner_image_en",
                originalname: "infra1.drawio.png",
                encoding: "7bit",
                mimetype: "image/png",
                destination: "images/sabha",
                filename: "1700127295797-infra1.drawio.png",
                path: "images\\sabha\\1700127295797-infra1.drawio.png",
                size: 547825,
              },
              council_name: "Shivsena",
              council_description: "Marahta",
            },
          ],
        },
        english: {
          title: "Shri Ganesh Chautrthi",
          description: "Welcome to Ganesh Chaturthi",
          banner_image: {
            fieldname: "banner_image_mr",
            originalname: "infra1.drawio.png",
            encoding: "7bit",
            mimetype: "image/png",
            destination: "images/sabha",
            filename: "1700127295797-infra1.drawio.png",
            path: "images\\sabha\\1700127295797-infra1.drawio.png",
            size: 547825,
          },
          legislative_council: [
            {
              council_profile: {
                fieldname: "banner_image_en",
                originalname: "infra1.drawio.png",
                encoding: "7bit",
                mimetype: "image/png",
                destination: "images/sabha",
                filename: "1700127295797-infra1.drawio.png",
                path: "images\\sabha\\1700127295797-infra1.drawio.png",
                size: 547825,
              },
              council_name: "Shivsena",
              council_description: "Marahta",
            },
          ],
        },
      });

    console.log(response.error);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("VidhanSabha created successfully.");
    expect(response.body.sabha).toBeDefined();
  });
});
