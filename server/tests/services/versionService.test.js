const versionService = require("../../services/versionService");

describe("Version Service", () => {
  describe("loadVersionRegistry", () => {
    it("should load the version registry successfully", () => {
      const registry = versionService.loadVersionRegistry();
      expect(registry).toBeDefined();
      expect(registry.go).toBeDefined();
      expect(registry.frameworks).toBeDefined();
      expect(registry.databases).toBeDefined();
      expect(registry.features).toBeDefined();
    });
  });

  describe("getGoVersions", () => {
    it("should return an array of Go versions", () => {
      const versions = versionService.getGoVersions();
      expect(Array.isArray(versions)).toBe(true);
      expect(versions.length).toBeGreaterThan(0);
      expect(versions[0]).toHaveProperty("version");
      expect(versions[0]).toHaveProperty("label");
    });
  });

  describe("getDefaultGoVersion", () => {
    it("should return the default Go version", () => {
      const defaultVersion = versionService.getDefaultGoVersion();
      expect(typeof defaultVersion).toBe("string");
      expect(defaultVersion).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  describe("getFrameworkVersions", () => {
    it("should return versions for gin framework", () => {
      const versions = versionService.getFrameworkVersions("gin");
      expect(Array.isArray(versions)).toBe(true);
      expect(versions.length).toBeGreaterThan(0);
      expect(versions[0]).toHaveProperty("version");
      expect(versions[0]).toHaveProperty("minGoVersion");
    });

    it("should throw error for invalid framework", () => {
      expect(() => versionService.getFrameworkVersions("invalid")).toThrow();
    });
  });

  describe("compareVersions", () => {
    it("should correctly compare semantic versions", () => {
      expect(versionService.compareVersions("1.24.0", "1.23.0")).toBe(1);
      expect(versionService.compareVersions("1.23.0", "1.24.0")).toBe(-1);
      expect(versionService.compareVersions("1.24.0", "1.24.0")).toBe(0);
      expect(versionService.compareVersions("v1.24.0", "v1.23.0")).toBe(1);
    });
  });

  describe("getMajorMinorVersion", () => {
    it("should extract major.minor from full version", () => {
      expect(versionService.getMajorMinorVersion("1.24.1")).toBe("1.24");
      expect(versionService.getMajorMinorVersion("1.23.5")).toBe("1.23");
      expect(versionService.getMajorMinorVersion("1.22")).toBe("1.22");
    });
  });

  describe("isFrameworkCompatibleWithGo", () => {
    it("should validate framework compatibility with Go version", () => {
      const result = versionService.isFrameworkCompatibleWithGo(
        "gin",
        "v1.10.0",
        "1.24.1"
      );
      expect(result).toHaveProperty("compatible");
      expect(result).toHaveProperty("reason");
      expect(result.compatible).toBe(true);
    });

    it("should detect incompatible versions", () => {
      const result = versionService.isFrameworkCompatibleWithGo(
        "gin",
        "v1.10.0",
        "1.20.0"
      );
      expect(result.compatible).toBe(false);
      expect(result.reason).toContain("requires Go");
    });
  });

  describe("validateConfiguration", () => {
    it("should validate a valid configuration", () => {
      const config = {
        goVersion: "1.24.1",
        framework: "gin",
        frameworkVersion: "v1.10.0",
        database: "postgres",
        databaseVersion: "v1.5.7",
        gormVersion: "v1.25.10",
        features: [],
      };

      const result = versionService.validateConfiguration(config);
      expect(result).toHaveProperty("valid");
      expect(result).toHaveProperty("warnings");
      expect(result).toHaveProperty("errors");
      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it("should detect invalid configuration", () => {
      const config = {
        goVersion: "1.20.0",
        framework: "gin",
        frameworkVersion: "v1.10.0",
        database: "none",
        features: [],
      };

      const result = versionService.validateConfiguration(config);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe("getRecommendedVersions", () => {
    it("should return recommended versions for Go 1.24.1", () => {
      const recommended = versionService.getRecommendedVersions("1.24.1");
      expect(recommended).toHaveProperty("go");
      expect(recommended).toHaveProperty("frameworks");
      expect(recommended).toHaveProperty("databases");
      expect(recommended).toHaveProperty("features");
      expect(recommended.go).toBe("1.24.1");
      expect(recommended.frameworks.gin).toBeDefined();
      expect(recommended.databases.postgres).toBeDefined();
    });
  });

  describe("getAllVersions", () => {
    it("should return all available versions", () => {
      const allVersions = versionService.getAllVersions();
      expect(allVersions).toHaveProperty("go");
      expect(allVersions).toHaveProperty("frameworks");
      expect(allVersions).toHaveProperty("databases");
      expect(allVersions).toHaveProperty("features");
      expect(allVersions.go.versions).toBeDefined();
      expect(allVersions.frameworks.gin).toBeDefined();
    });
  });
});
