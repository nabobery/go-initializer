const path = require("path");
const fs = require("fs-extra");
const {
  validateProjectConfig,
} = require("../validators/projectConfigValidator");
const os = require("os");
const {
  generateProjectFiles,
  zipDirectory,
} = require("../services/generationService");
const versionService = require("../services/versionService");
const logger = require("../utils/logger");

const generateProject = async (req, res) => {
  logger.info("Received generation request:", req.body);

  const { value: options, error } = validateProjectConfig(req.body);

  if (error) {
    logger.warn("Validation failed:", error.details);
    return res.status(400).json({
      message: "Invalid input",
      details: error.details.map((d) => d.message),
    });
  }

  // Derive projectName from modulePath if not provided
  options.projectName =
    options.projectName || options.modulePath.split("/").pop() || "my-go-app";

  // Set default versions using version service
  options.goVersion = options.goVersion || versionService.getDefaultGoVersion();

  if (options.framework) {
    options.frameworkVersion =
      options.frameworkVersion ||
      versionService.getDefaultFrameworkVersion(options.framework);
  }

  // Set default database if not provided
  if (!options.database) {
    options.database = "none";
  }

  // Set database versions
  if (options.database && options.database !== "none") {
    // Set GORM version for SQL databases
    if (["postgres", "mysql", "sqlite"].includes(options.database)) {
      options.gormVersion =
        options.gormVersion ||
        versionService.getDefaultDatabaseVersion("gorm");
    }

    // Set database driver version
    options.databaseVersion =
      options.databaseVersion ||
      versionService.getDefaultDatabaseVersion(options.database);
  }

  // Set feature versions
  if (options.features && Array.isArray(options.features)) {
    options.features.forEach((feature) => {
      const versionKey = `${feature}Version`;
      if (!options[versionKey]) {
        options[versionKey] = versionService.getDefaultFeatureVersion(feature);
      }
    });
  }

  // Set default viper version (always included)
  options.viperVersion =
    options.viperVersion ||
    versionService.getDefaultFeatureVersion("viper");

  // Validate configuration for version compatibility
  const validation = versionService.validateConfiguration(options);
  if (!validation.valid) {
    logger.warn("Version compatibility validation failed:", validation.errors);
    return res.status(400).json({
      message: "Version compatibility issues detected",
      errors: validation.errors,
      warnings: validation.warnings,
    });
  }

  // Log warnings if any
  if (validation.warnings.length > 0) {
    logger.warn("Version compatibility warnings:", validation.warnings);
  }

  let tempDir = null; // Keep track of the temp directory path for generated files
  let zipPath = null; // Keep track of the zip file path
  try {
    // 1. Generate project files (Assuming this now uses os.tmpdir() internally)
    tempDir = await generateProjectFiles(options);

    // 2. Create zip archive in the OS temp directory
    // Use a unique name for the zip file, perhaps based on projectName or a UUID
    const zipFileName = `${options.projectName}-${Date.now()}.zip`;
    zipPath = path.join(os.tmpdir(), zipFileName); // Use os.tmpdir()
    await zipDirectory(tempDir, zipPath);
    logger.info(`Project zipped successfully: ${zipPath}`);

    // 3. Send the zip file as response
    res.setHeader("Content-Type", "application/zip");
    // Use the original project name for the downloaded file
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${options.projectName}.zip"`
    );

    const fileStream = fs.createReadStream(zipPath);
    fileStream.pipe(res);

    // 4. Clean up after sending
    fileStream.on("close", async () => {
      logger.info(`Zip file sent, cleaning up ${tempDir} and ${zipPath}`);
      if (tempDir)
        await fs
          .remove(tempDir)
          .catch((err) => logger.error(`Error removing temp dir: ${err}`));
      if (zipPath)
        await fs
          .remove(zipPath)
          .catch((err) => logger.error(`Error removing zip file: ${err}`));
    });
    fileStream.on("error", async (err) => {
      logger.error(`Error streaming zip file: ${err}`);
      if (tempDir)
        await fs
          .remove(tempDir)
          .catch((err) =>
            logger.error(`Error removing temp dir during stream error: ${err}`)
          );
      if (zipPath)
        await fs
          .remove(zipPath)
          .catch((err) =>
            logger.error(`Error removing zip file during stream error: ${err}`)
          );
      if (!res.headersSent) {
        res
          .status(500)
          .json({ message: "Error sending generated project file." });
      }
    });
  } catch (error) {
    logger.error(`Project generation failed: ${error.message}`);
    // Ensure cleanup happens even if zip creation/sending fails
    if (tempDir) {
      await fs
        .remove(tempDir)
        .catch((err) =>
          logger.error(`Cleanup error (tempDir) after failure: ${err}`)
        );
    }
    if (zipPath) {
      await fs
        .remove(zipPath)
        .catch((err) =>
          logger.error(`Cleanup error (zipPath) after failure: ${err}`)
        );
    }
    if (!res.headersSent) {
      res
        .status(500)
        .json({ message: error.message || "Failed to generate project." });
    }
  }
};

module.exports = {
  generateProject,
};
