const express = require('express');
const { generateProject } = require('../controllers/generateController');
const router = express.Router();

router.post('/', generateProject);

module.exports = router;