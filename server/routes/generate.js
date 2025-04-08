const express = require('express');
const { generateProject } = require('../controllers/generateController');
const router = express.Router();

/**
 * @swagger
 * /api/generate:
 *   post:
 *     summary: Generate a Go project based on provided configuration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               modulePath:
 *                 type: string
 *                 description: Go module path (e.g., github.com/yourname/yourrepo)
 *               projectName:
 *                 type: string
 *                 description: Name of the Go project (defaults to last segment of modulePath)
 *               framework:
 *                 type: string
 *                 description: Web framework (e.g., gin, echo)
 *               goVersion:
 *                 type: string
 *                 description: Go version (default 1.22)
 *               database:
 *                 type: string
 *                 enum: [mongodb, sqlite, postgres, mysql]
 *                 description: Database type (default mongodb)
 *               dbConfig:
 *                 type: object
 *                 description: Database connection details
 *                 properties:
 *                   host:
 *                     type: string
 *                   port:
 *                     type: string
 *                   user:
 *                     type: string
 *                   password:
 *                     type: string
 *                   dbName:
 *                     type: string
 *                   uri:
 *                     type: string
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of optional features (e.g., zap logging)
 *             required:
 *               - modulePath
 *               - framework
 *     responses:
 *       200:
 *         description: Project generated successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */

router.post('/', generateProject);

module.exports = router;