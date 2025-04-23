const express = require("express");
const { previewProject } = require("../controllers/previewController");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Preview
 *   description: Preview generated Go project structure and files
 */

/**
 * @swagger
 * /api/preview:
 *   post:
 *     summary: Preview the generated Go project structure and file contents
 *     tags: [Preview]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Project file structure and contents
 *       400:
 *         description: Missing required options
 *       500:
 *         description: Failed to generate project preview
 */
router.post("/", previewProject);

module.exports = router;
