const { generateProject } = require("../../controllers/generateController");

describe("generateController", () => {
  let req, res, next;
  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      set: jest.fn(),
      end: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return 400 if required fields are missing", async () => {
    await generateProject(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  // Add more tests for success, error, and edge cases
});
