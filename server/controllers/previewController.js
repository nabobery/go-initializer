const fs = require("fs-extra");
const Joi = require("joi");
const {
  generateProjectFiles,
  readProjectFiles,
} = require("../services/generationService");
const logger = require("../utils/logger");
const {
  validateProjectConfig,
} = require("../validators/projectConfigValidator");

/**
 * @swagger
 * /api/preview:
 *   post:
 *     summary: Preview the generated Go project structure and file contents
 *     description: Generates a Go project in a temp directory and returns its file tree and file contents for preview. Cleans up after response.
 *     tags:
 *       - Preview
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               modulePath:
 *                 type: string
 *                 example: github.com/example/myapp
 *               framework:
 *                 type: string
 *                 example: gin
 *               projectName:
 *                 type: string
 *                 example: myapp
 *               goVersion:
 *                 type: string
 *                 example: 1.24.1
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               database:
 *                 type: string
 *                 example: postgres
 *               dbConfig:
 *                 type: object
 *     responses:
 *       200:
 *         description: Project file structure and contents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 structure:
 *                   type: array
 *                   items:
 *                     type: string
 *                 files:
 *                   type: object
 *                   additionalProperties:
 *                     type: string
 *       400:
 *         description: Missing required options
 *       500:
 *         description: Failed to generate project preview
 */
const previewProject = async (req, res) => {
  logger.info("Received preview request:", req.body);

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
  options.goVersion = options.goVersion || "1.24.1";
  if (!options.database) {
    // options.database = "mongodb";
    options.database = "none";
  }

  let tempDir = null;
  try {
    // 1. Generate project files (same logic as generation)
    tempDir = await generateProjectFiles(options);

    // 2. Read the generated file structure and content
    const previewData = await readProjectFiles(tempDir);

    // 3. Send the preview data as JSON
    res.status(200).json(previewData);
  } catch (error) {
    logger.error(`Project preview failed: ${error.message}`);
    res.status(500).json({
      message: error.message || "Failed to generate project preview.",
    });
  } finally {
    // 4. Clean up the temporary directory
    if (tempDir) {
      await fs
        .remove(tempDir)
        .catch((err) =>
          logger.error(`Error cleaning up temp dir after preview: ${err}`)
        );
      logger.info(`Cleaned up temp directory: ${tempDir}`);
    }
  }
};

module.exports = {
  previewProject,
};
