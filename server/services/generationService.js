const fs = require("fs-extra");
const path = require("path");
const ejs = require("ejs");
const archiver = require("archiver");
const os = require("os");
const logger = require("../utils/logger");
const glob = require("glob");

const generateProjectFiles = async (options) => {
  const {
    modulePath,
    projectName,
    framework,
    goVersion,
    features,
    database,
    dbConfig,
  } = options;
  const tempDir = path.join(
    os.tmpdir(),
    `go-init-${projectName}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`
  );

  try {
    await fs.ensureDir(tempDir);

    // --- Define Project Structure ---
    const dirsToCreate = [
      path.join(tempDir, "cmd", projectName),
      path.join(tempDir, "internal", "handlers"),
      path.join(tempDir, "internal", "models"),
      path.join(tempDir, "internal", "repositories"),
      path.join(tempDir, "internal", "services"),
      path.join(tempDir, "internal", "config"),
      path.join(tempDir, "pkg"),
      path.join(tempDir, "configs"), // For config files like .env.example
      // Add more as needed
    ];
    await Promise.all(dirsToCreate.map((dir) => fs.ensureDir(dir)));

    // --- Template Data ---
    const templateData = {
      modulePath,
      projectName,
      framework,
      database,
      goVersion, // e.g., "1.22" or "1.24.1"
      options: features || [], // Ensure features is an array
      dbConfig: dbConfig || {},
      includeIndirectDeps: false, // By default, do not include indirect dependencies
      // Add other derived data if needed
    };

    // --- Generate Files from EJS Templates ---
    const filesToGenerate = [
      // go.mod
      { template: "common/go.mod.ejs", output: path.join(tempDir, "go.mod") },
      // README.md
      {
        template: "common/README.md.ejs",
        output: path.join(tempDir, "README.md"),
      },
      // main.go (framework specific)
      {
        template: `framework/${framework}/main.go.ejs`,
        output: path.join(tempDir, "cmd", projectName, "main.go"),
      },
      // Basic Handler
      {
        template: "structure/handler.go.ejs",
        output: path.join(tempDir, "internal", "handlers", "hello_handler.go"),
      },

      // Database setup
      {
        template: ["sqlite", "postgres", "mysql"].includes(database)
          ? "database/gorm_setup.go.ejs"
          : "database/mongo_setup.go.ejs",
        output: path.join(tempDir, "internal", "config", "db.go"),
      },

      // Config struct
      {
        template: "structure/config.go.ejs",
        output: path.join(tempDir, "internal", "config", "config.go"),
      },

      // Environment example file
      {
        template: "structure/env.example.ejs",
        output: path.join(tempDir, "configs", ".env.example"),
      },
    ];

    for (const file of filesToGenerate) {
      if (file.template) {
        const templatePath = path.join(
          __dirname,
          "..",
          "templates",
          file.template
        );
        const content = await ejs.renderFile(templatePath, templateData);
        await fs.writeFile(file.output, content);
      } else if (file.content) {
        await fs.writeFile(file.output, file.content); // For static content
      } else {
        await fs.ensureFile(file.output); // Create empty file / placeholder
      }
    }

    // After all files are generated, format all Go files in the project directory
    const { execSync } = require("child_process");
    try {
      execSync(`gofmt -w "${tempDir}"`);
    } catch (err) {
      logger.warn(
        `Could not format Go files in ${tempDir} with gofmt: ${err.message}`
      );
    }

    // --- Create go.sum (empty for now, user needs to run `go mod tidy`) ---
    await fs.writeFile(path.join(tempDir, "go.sum"), "");

    logger.info(`Project files generated in ${tempDir}`);
    return tempDir; // Return path to generated project
  } catch (error) {
    logger.error(`Error generating project files: ${error}`);
    // Clean up partially generated directory on error
    await fs
      .remove(tempDir)
      .catch((err) =>
        logger.error(`Error cleaning up temp dir ${tempDir}: ${err}`)
      );
    throw new Error("Failed to generate project files.");
  }
};

const zipDirectory = (sourceDir, outPath) => {
  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = fs.createWriteStream(outPath);

  return new Promise((resolve, reject) => {
    archive
      .directory(sourceDir, false)
      .on("error", (err) => reject(err))
      .pipe(stream);

    stream.on("close", () => resolve());
    archive.finalize();
  });
};

/**
 * Reads the generated project directory and returns its file structure and file contents for preview.
 * Skips large or binary files. Used for preview endpoint.
 * @param {string} projectDir - Path to the generated project directory
 * @returns {Promise<{structure: string[], files: Object}>}
 */
const readProjectFiles = async (projectDir) => {
  const structure = [];
  const files = {};
  // Use glob to find all files, ignoring node_modules etc. if they existed
  const filePaths = glob.sync("**/*", {
    cwd: projectDir,
    nodir: true,
    dot: true,
  });

  for (const filePath of filePaths) {
    // Normalize path separators for consistency
    const relativePath = filePath.replace(/\\/g, "/");
    structure.push(relativePath);
    try {
      // Read only reasonably sized text files for preview
      const fullPath = path.join(projectDir, filePath);
      const stats = await fs.stat(fullPath);
      if (stats.size < 500 * 1024) {
        // Limit file size (e.g., 500KB)
        const content = await fs.readFile(fullPath, "utf-8");
        // Basic check for binary files (can be improved)
        if (content.includes("\uFFFD")) {
          files[relativePath] = "<Binary File - Not Shown>";
        } else {
          files[relativePath] = content;
        }
      } else {
        files[relativePath] = `<File too large (${(stats.size / 1024).toFixed(
          1
        )}KB) - Not Shown>`;
      }
    } catch (readError) {
      logger.error(`Error reading file ${filePath} for preview: ${readError}`);
      files[filePath] = `<Error Reading File: ${readError.message}>`;
    }
  }
  return { structure, files };
};

module.exports = {
  generateProjectFiles,
  zipDirectory,
  readProjectFiles,
};
