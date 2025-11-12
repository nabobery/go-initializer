const versionService = require("../services/versionService");
const logger = require("../utils/logger");

/**
 * Get all available versions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllVersions = (req, res) => {
  try {
    const versions = versionService.getAllVersions();
    res.status(200).json(versions);
  } catch (error) {
    logger.error(`Error fetching versions: ${error.message}`);
    res.status(500).json({ error: "Failed to fetch versions" });
  }
};

/**
 * Get recommended versions for a specific Go version
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getRecommendedVersions = (req, res) => {
  try {
    const { goVersion } = req.query;

    if (!goVersion) {
      return res.status(400).json({ error: "Go version is required" });
    }

    const recommended = versionService.getRecommendedVersions(goVersion);
    res.status(200).json(recommended);
  } catch (error) {
    logger.error(`Error fetching recommended versions: ${error.message}`);
    res.status(500).json({ error: "Failed to fetch recommended versions" });
  }
};

/**
 * Validate a project configuration
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const validateConfiguration = (req, res) => {
  try {
    const config = req.body;
    const validation = versionService.validateConfiguration(config);
    res.status(200).json(validation);
  } catch (error) {
    logger.error(`Error validating configuration: ${error.message}`);
    res.status(500).json({ error: "Failed to validate configuration" });
  }
};

module.exports = {
  getAllVersions,
  getRecommendedVersions,
  validateConfiguration,
};
