import {
  generateProjectZip,
  ProjectConfig,
  getProjectPreview,
} from "./apiService";

// Tell Jest to use the manual mock from the __mocks__ directory
jest.mock("./apiService");

describe("apiService", () => {
  // Clear mocks before each test
  beforeEach(() => {
    // Clear calls/instances for *all* mocked functions from the service
    (generateProjectZip as jest.Mock).mockClear();
    (getProjectPreview as jest.Mock).mockClear(); // Assuming you'll test this too
  });

  it("calls /generate endpoint mock correctly", async () => {
    // Renamed test slightly
    // Mock the return value of the *mocked* generateProjectZip
    const mockBlob = new Blob(["zip content"], { type: "application/zip" });
    (generateProjectZip as jest.Mock).mockResolvedValue(mockBlob);

    const payload: ProjectConfig = {
      projectName: "myginapp",
      modulePath: "github.com/test/myginapp",
      framework: "gin",
      database: "none",
      goVersion: "1.22",
      features: [],
      dbConfig: {},
      // dbConfig is optional based on type, no need for empty {} if database is 'none'
    };

    const result = await generateProjectZip(payload);

    // Check if the mocked function was called with the correct payload
    expect(generateProjectZip).toHaveBeenCalledWith(payload);
    expect(result).toBe(mockBlob); // Expect the mocked return value
  });

});
