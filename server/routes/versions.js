const express = require("express");
const router = express.Router();
const versionsController = require("../controllers/versionsController");

/**
 * @route   GET /api/versions
 * @desc    Get all available versions
 * @access  Public
 */
router.get("/", versionsController.getAllVersions);

/**
 * @route   GET /api/versions/recommended
 * @desc    Get recommended versions for a specific Go version
 * @access  Public
 */
router.get("/recommended", versionsController.getRecommendedVersions);

/**
 * @route   POST /api/versions/validate
 * @desc    Validate a project configuration for version compatibility
 * @access  Public
 */
router.post("/validate", versionsController.validateConfiguration);

module.exports = router;
