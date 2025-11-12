const fs = require("fs-extra");
const path = require("path");
const logger = require("../utils/logger");

// Load version registry
const versionRegistryPath = path.join(
  __dirname,
  "..",
  "config",
  "versions.json"
);
let versionRegistry = null;

/**
 * Load the version registry from the JSON file
 * @returns {Object} The version registry
 */
function loadVersionRegistry() {
  if (!versionRegistry) {
    try {
      versionRegistry = fs.readJsonSync(versionRegistryPath);
      logger.info("Version registry loaded successfully");
    } catch (error) {
      logger.error(`Failed to load version registry: ${error.message}`);
      throw new Error("Version registry could not be loaded");
    }
  }
  return versionRegistry;
}

/**
 * Get all available Go versions
 * @returns {Array} Array of Go version objects
 */
function getGoVersions() {
  const registry = loadVersionRegistry();
  return registry.go.versions;
}

/**
 * Get default Go version
 * @returns {string} Default Go version
 */
function getDefaultGoVersion() {
  const registry = loadVersionRegistry();
  return registry.go.default;
}

/**
 * Get all available versions for a specific framework
 * @param {string} framework - Framework name (gin, echo, chi)
 * @returns {Array} Array of framework version objects
 */
function getFrameworkVersions(framework) {
  const registry = loadVersionRegistry();
  if (!registry.frameworks[framework]) {
    throw new Error(`Framework '${framework}' not found in version registry`);
  }
  return registry.frameworks[framework].versions;
}

/**
 * Get default version for a specific framework
 * @param {string} framework - Framework name (gin, echo, chi)
 * @returns {string} Default framework version
 */
function getDefaultFrameworkVersion(framework) {
  const registry = loadVersionRegistry();
  if (!registry.frameworks[framework]) {
    throw new Error(`Framework '${framework}' not found in version registry`);
  }
  return registry.frameworks[framework].default;
}

/**
 * Get all available versions for a specific database/driver
 * @param {string} database - Database name (postgres, mysql, sqlite, mongodb, gorm)
 * @returns {Array} Array of database version objects
 */
function getDatabaseVersions(database) {
  const registry = loadVersionRegistry();
  if (!registry.databases[database]) {
    return []; // Return empty array for 'none' or unsupported databases
  }
  return registry.databases[database].versions;
}

/**
 * Get default version for a specific database/driver
 * @param {string} database - Database name (postgres, mysql, sqlite, mongodb, gorm)
 * @returns {string|null} Default database version or null
 */
function getDefaultDatabaseVersion(database) {
  const registry = loadVersionRegistry();
  if (!registry.databases[database]) {
    return null;
  }
  return registry.databases[database].default;
}

/**
 * Get all available versions for a specific feature/library
 * @param {string} feature - Feature name (logrus, zap, testify, viper)
 * @returns {Array} Array of feature version objects
 */
function getFeatureVersions(feature) {
  const registry = loadVersionRegistry();
  if (!registry.features[feature]) {
    return [];
  }
  return registry.features[feature].versions;
}

/**
 * Get default version for a specific feature/library
 * @param {string} feature - Feature name (logrus, zap, testify, viper)
 * @returns {string|null} Default feature version or null
 */
function getDefaultFeatureVersion(feature) {
  const registry = loadVersionRegistry();
  if (!registry.features[feature]) {
    return null;
  }
  return registry.features[feature].default;
}

/**
 * Compare semantic versions
 * @param {string} version1 - First version string
 * @param {string} version2 - Second version string
 * @returns {number} -1 if version1 < version2, 0 if equal, 1 if version1 > version2
 */
function compareVersions(version1, version2) {
  // Remove 'v' prefix if present
  const v1 = version1.replace(/^v/, "");
  const v2 = version2.replace(/^v/, "");

  const parts1 = v1.split(".").map(Number);
  const parts2 = v2.split(".").map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;

    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }

  return 0;
}

/**
 * Extract major.minor version from full version string
 * @param {string} version - Full version string (e.g., "1.24.1")
 * @returns {string} Major.minor version (e.g., "1.24")
 */
function getMajorMinorVersion(version) {
  const match = version.match(/(\d+\.\d+)/);
  return match ? match[1] : version;
}

/**
 * Check if a framework version is compatible with a Go version
 * @param {string} framework - Framework name
 * @param {string} frameworkVersion - Framework version
 * @param {string} goVersion - Go version
 * @returns {Object} {compatible: boolean, reason: string}
 */
function isFrameworkCompatibleWithGo(framework, frameworkVersion, goVersion) {
  const registry = loadVersionRegistry();

  const frameworkVersions = registry.frameworks[framework]?.versions || [];
  const selectedFramework = frameworkVersions.find(
    (v) => v.version === frameworkVersion
  );

  if (!selectedFramework) {
    return {
      compatible: false,
      reason: `Framework version ${frameworkVersion} not found`,
    };
  }

  const goMajorMinor = getMajorMinorVersion(goVersion);
  const minGoVersion = selectedFramework.minGoVersion;

  if (compareVersions(goMajorMinor, minGoVersion) < 0) {
    return {
      compatible: false,
      reason: `${framework} ${frameworkVersion} requires Go ${minGoVersion} or higher`,
    };
  }

  return { compatible: true, reason: "" };
}

/**
 * Check if a database driver version is compatible with GORM version
 * @param {string} database - Database name (postgres, mysql, sqlite)
 * @param {string} databaseVersion - Database driver version
 * @param {string} gormVersion - GORM version
 * @returns {Object} {compatible: boolean, reason: string}
 */
function isDatabaseCompatibleWithGorm(database, databaseVersion, gormVersion) {
  if (!["postgres", "mysql", "sqlite"].includes(database)) {
    return { compatible: true, reason: "" }; // MongoDB doesn't use GORM
  }

  const registry = loadVersionRegistry();
  const databaseVersions = registry.databases[database]?.versions || [];
  const selectedDb = databaseVersions.find((v) => v.version === databaseVersion);

  if (!selectedDb) {
    return {
      compatible: false,
      reason: `Database driver version ${databaseVersion} not found`,
    };
  }

  if (
    selectedDb.compatibleGormVersions &&
    !selectedDb.compatibleGormVersions.includes(gormVersion)
  ) {
    return {
      compatible: false,
      reason: `${database} driver ${databaseVersion} is not compatible with GORM ${gormVersion}`,
    };
  }

  return { compatible: true, reason: "" };
}

/**
 * Check if a database driver is compatible with Go version
 * @param {string} database - Database name
 * @param {string} databaseVersion - Database driver version
 * @param {string} goVersion - Go version
 * @returns {Object} {compatible: boolean, reason: string}
 */
function isDatabaseCompatibleWithGo(database, databaseVersion, goVersion) {
  const registry = loadVersionRegistry();

  const databaseVersions = registry.databases[database]?.versions || [];
  const selectedDb = databaseVersions.find((v) => v.version === databaseVersion);

  if (!selectedDb) {
    return {
      compatible: false,
      reason: `Database version ${databaseVersion} not found`,
    };
  }

  const goMajorMinor = getMajorMinorVersion(goVersion);
  const minGoVersion = selectedDb.minGoVersion;

  if (compareVersions(goMajorMinor, minGoVersion) < 0) {
    return {
      compatible: false,
      reason: `${database} ${databaseVersion} requires Go ${minGoVersion} or higher`,
    };
  }

  return { compatible: true, reason: "" };
}

/**
 * Validate a complete project configuration for version compatibility
 * @param {Object} config - Project configuration
 * @returns {Object} {valid: boolean, warnings: Array, errors: Array}
 */
function validateConfiguration(config) {
  const warnings = [];
  const errors = [];

  const {
    goVersion,
    framework,
    frameworkVersion,
    database,
    databaseVersion,
    gormVersion,
    features = [],
  } = config;

  // Check framework compatibility with Go
  if (framework && frameworkVersion && goVersion) {
    const frameworkCompat = isFrameworkCompatibleWithGo(
      framework,
      frameworkVersion,
      goVersion
    );
    if (!frameworkCompat.compatible) {
      errors.push(frameworkCompat.reason);
    }
  }

  // Check database compatibility with Go and GORM
  if (
    database &&
    database !== "none" &&
    databaseVersion &&
    goVersion
  ) {
    const dbGoCompat = isDatabaseCompatibleWithGo(
      database,
      databaseVersion,
      goVersion
    );
    if (!dbGoCompat.compatible) {
      errors.push(dbGoCompat.reason);
    }

    // Check GORM compatibility for SQL databases
    if (["postgres", "mysql", "sqlite"].includes(database) && gormVersion) {
      const dbGormCompat = isDatabaseCompatibleWithGorm(
        database,
        databaseVersion,
        gormVersion
      );
      if (!dbGormCompat.compatible) {
        errors.push(dbGormCompat.reason);
      }
    }
  }

  // Check feature compatibility with Go
  features.forEach((feature) => {
    const featureVersion = config[`${feature}Version`];
    if (featureVersion) {
      const featureVersions = getFeatureVersions(feature);
      const selectedFeature = featureVersions.find(
        (v) => v.version === featureVersion
      );

      if (selectedFeature) {
        const goMajorMinor = getMajorMinorVersion(goVersion);
        const minGoVersion = selectedFeature.minGoVersion;

        if (compareVersions(goMajorMinor, minGoVersion) < 0) {
          warnings.push(
            `${feature} ${featureVersion} recommends Go ${minGoVersion} or higher`
          );
        }
      }
    }
  });

  return {
    valid: errors.length === 0,
    warnings,
    errors,
  };
}

/**
 * Get recommended versions for a given Go version
 * @param {string} goVersion - Go version
 * @returns {Object} Recommended versions for all components
 */
function getRecommendedVersions(goVersion) {
  const registry = loadVersionRegistry();
  const goMajorMinor = getMajorMinorVersion(goVersion);

  const recommended = {
    go: goVersion,
    frameworks: {},
    databases: {},
    features: {},
  };

  // Get recommended framework versions
  Object.keys(registry.frameworks).forEach((framework) => {
    const versions = registry.frameworks[framework].versions;
    const compatible = versions.filter((v) => {
      const compat = isFrameworkCompatibleWithGo(framework, v.version, goVersion);
      return compat.compatible;
    });

    const recommendedVersion = compatible.find((v) => v.isRecommended) || compatible[0];
    if (recommendedVersion) {
      recommended.frameworks[framework] = recommendedVersion.version;
    }
  });

  // Get recommended database versions
  Object.keys(registry.databases).forEach((database) => {
    const versions = registry.databases[database].versions;
    const compatible = versions.filter((v) => {
      const compat = isDatabaseCompatibleWithGo(database, v.version, goVersion);
      return compat.compatible;
    });

    const recommendedVersion = compatible.find((v) => v.isRecommended) || compatible[0];
    if (recommendedVersion) {
      recommended.databases[database] = recommendedVersion.version;
    }
  });

  // Get recommended feature versions
  Object.keys(registry.features).forEach((feature) => {
    const versions = registry.features[feature].versions;
    const compatible = versions.filter(
      (v) => compareVersions(goMajorMinor, v.minGoVersion) >= 0
    );

    const recommendedVersion = compatible.find((v) => v.isRecommended) || compatible[0];
    if (recommendedVersion) {
      recommended.features[feature] = recommendedVersion.version;
    }
  });

  return recommended;
}

/**
 * Get all versions for the frontend
 * @returns {Object} All available versions
 */
function getAllVersions() {
  const registry = loadVersionRegistry();
  return {
    go: registry.go,
    frameworks: registry.frameworks,
    databases: registry.databases,
    features: registry.features,
  };
}

module.exports = {
  loadVersionRegistry,
  getGoVersions,
  getDefaultGoVersion,
  getFrameworkVersions,
  getDefaultFrameworkVersion,
  getDatabaseVersions,
  getDefaultDatabaseVersion,
  getFeatureVersions,
  getDefaultFeatureVersion,
  compareVersions,
  getMajorMinorVersion,
  isFrameworkCompatibleWithGo,
  isDatabaseCompatibleWithGorm,
  isDatabaseCompatibleWithGo,
  validateConfiguration,
  getRecommendedVersions,
  getAllVersions,
};
