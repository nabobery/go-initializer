const fs = require("fs-extra");
const ejs = require("ejs");
const os = require("os");
const { generateProjectFiles } = require("../../services/generationService");

jest.mock("fs-extra");
jest.mock("ejs");
jest.mock("os", () => {
  const path = require("path");
  return {
    ...jest.requireActual("os"),
    tmpdir: jest.fn(() => path.join(__dirname, "..", "..", "temp-jest")),
  };
});
jest.mock("../../utils/logger", () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));
jest.mock("child_process", () => ({
  execSync: jest.fn(),
}));

describe("Generation Service", () => {
  const path = require("path");
  const mockTempDir = path.join(__dirname, "..", "..", "temp-jest");

  beforeEach(() => {
    fs.ensureDir.mockClear();
    fs.writeFile.mockClear();
    fs.remove.mockClear();
    ejs.renderFile.mockResolvedValue("mock file content");
    os.tmpdir.mockClear();
    require("child_process").execSync.mockClear();

    fs.remove.mockResolvedValue(undefined);
  });

  afterAll(async () => {
    // fs.rmSync(mockTempDir, { recursive: true, force: true });
  });

  it("should create correct directory structure for Gin project", async () => {
    const options = {
      modulePath: "github.com/test/myginapp",
      projectName: "myginapp",
      framework: "gin",
      database: "none",
      goVersion: "1.22",
      features: [],
    };

    await generateProjectFiles(options);

    const actualTempDir = fs.ensureDir.mock.calls[0][0];
    expect(actualTempDir).toContain(mockTempDir);

    expect(fs.ensureDir).toHaveBeenCalledWith(
      path.join(actualTempDir, "cmd", options.projectName)
    );
    expect(fs.ensureDir).toHaveBeenCalledWith(
      path.join(actualTempDir, "internal", "handlers")
    );
    expect(fs.ensureDir).toHaveBeenCalledWith(
      path.join(actualTempDir, "internal", "models")
    );
    expect(fs.ensureDir).toHaveBeenCalledWith(
      path.join(actualTempDir, "internal", "repositories")
    );
    expect(fs.ensureDir).toHaveBeenCalledWith(
      path.join(actualTempDir, "internal", "services")
    );
    expect(fs.ensureDir).toHaveBeenCalledWith(
      path.join(actualTempDir, "internal", "config")
    );
    expect(fs.ensureDir).toHaveBeenCalledWith(path.join(actualTempDir, "pkg"));
    expect(fs.ensureDir).toHaveBeenCalledWith(
      path.join(actualTempDir, "configs")
    );
  });

  it("should generate main.go using gin template when framework is gin", async () => {
    const options = {
      modulePath: "github.com/test/myginapp",
      projectName: "myginapp",
      framework: "gin",
      database: "none",
      goVersion: "1.22",
      features: [],
    };

    await generateProjectFiles(options);

    const actualTempDir = fs.ensureDir.mock.calls[0][0];
    expect(actualTempDir).toContain(mockTempDir);

    const expectedMainGoPath = path.join(
      actualTempDir,
      "cmd",
      options.projectName,
      "main.go"
    );
    const expectedGinTemplatePath = path.resolve(
      __dirname,
      "..",
      "..",
      "templates",
      "framework/gin/main.go.ejs"
    );

    expect(ejs.renderFile).toHaveBeenCalledWith(
      expectedGinTemplatePath,
      expect.objectContaining({ framework: "gin" })
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      expectedMainGoPath,
      "mock file content"
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join(actualTempDir, "go.mod"),
      "mock file content"
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      path.join(actualTempDir, "README.md"),
      "mock file content"
    );
  });

  it("should clean up temp directory on generation error", async () => {
    const options = {
      modulePath: "github.com/test/myginapp",
      projectName: "myginapp",
      framework: "gin",
      database: "none",
      goVersion: "1.22",
      features: [],
    };
    fs.writeFile.mockRejectedValueOnce(new Error("Disk full"));

    await expect(generateProjectFiles(options)).rejects.toThrow(
      "Failed to generate project files."
    );

    expect(fs.remove).toHaveBeenCalledTimes(1);
    const removedDir = fs.remove.mock.calls[0][0];
    expect(removedDir).toContain(mockTempDir);
  });

  it("should call gofmt to format generated files", async () => {
    const options = { projectName: "testfmt" };
    await generateProjectFiles(options);
    const actualTempDir = fs.ensureDir.mock.calls[0][0];
    expect(require("child_process").execSync).toHaveBeenCalledWith(
      `gofmt -w "${actualTempDir}"`
    );
  });
});
