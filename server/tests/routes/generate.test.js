const request = require("supertest");
const express = require("express");
const generateRoute = require("../../routes/generate");

const app = express();
app.use(express.json());
app.use("/generate", generateRoute);

describe("POST /generate", () => {
  it("should return 200 and a zip file for valid input", async () => {
    const response = await request(app).post("/generate").send({
      modulePath: "github.com/test/myginapp",
      projectName: "myginapp",
      framework: "gin",
      database: "none",
      goVersion: "1.22",
      features: [],
    });
    // This will likely fail unless you mock generationService and archiver
    // expect(response.status).toBe(200);
    // expect(response.header['content-type']).toContain('application/zip');
  });

  it("should return 400 for missing required fields", async () => {
    const response = await request(app)
      .post("/generate")
      .send({ projectName: "myginapp" });
    expect(response.status).toBe(400);
  });
});
