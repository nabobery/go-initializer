const path = require('path');
const fs = require('fs-extra');
const Joi = require('joi');
const { generateProjectFiles, zipDirectory } = require('../services/generationService');
const logger = require('../utils/logger');

const generateProject = async (req, res) => {
    logger.info('Received generation request:', req.body);

    const schema = Joi.object({
        modulePath: Joi.string().required(),
        projectName: Joi.string().optional(),
        framework: Joi.string().required(),
        goVersion: Joi.string().optional(),
        database: Joi.string().valid('mongodb', 'sqlite', 'postgres', 'mysql').optional(),
        dbConfig: Joi.object({
            host: Joi.string().optional(),
            port: Joi.alternatives().try(Joi.string(), Joi.number()).optional(),
            user: Joi.string().optional(),
            password: Joi.string().optional(),
            dbName: Joi.string().optional(),
            uri: Joi.string().optional()
        }).optional(),
        features: Joi.array().items(Joi.string()).optional()
    });

    const { value: options, error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true, stripUnknown: true });

    if (error) {
        logger.warn('Validation failed:', error.details);
        return res.status(400).json({ message: 'Invalid input', details: error.details.map(d => d.message) });
    }

    // Derive projectName from modulePath if not provided
    options.projectName = options.projectName || options.modulePath.split('/').pop() || 'my-go-app';
    options.goVersion = options.goVersion || '1.22'; // Default or fetch latest

    // Set default database if not provided
    if (!options.database) {
        options.database = 'mongodb';
    }

    let tempDir = null; // Keep track of the temp directory path
    try {
        // 1. Generate project files
        tempDir = await generateProjectFiles(options);

        // 2. Create zip archive
        const zipPath = path.join(__dirname, '..', 'temp', `${options.projectName}.zip`);
        await zipDirectory(tempDir, zipPath);
        logger.info(`Project zipped successfully: ${zipPath}`);

        // 3. Send the zip file as response
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${options.projectName}.zip"`);

        const fileStream = fs.createReadStream(zipPath);
        fileStream.pipe(res);

        // 4. Clean up after sending
        fileStream.on('close', async () => {
            logger.info(`Zip file sent, cleaning up ${tempDir} and ${zipPath}`);
            if (tempDir) await fs.remove(tempDir);
            await fs.remove(zipPath);
        });
        fileStream.on('error', async (err) => {
             logger.error(`Error streaming zip file: ${err}`);
             if (tempDir) await fs.remove(tempDir);
             await fs.remove(zipPath);
             if (!res.headersSent) {
                res.status(500).json({ message: 'Error sending generated project file.' });
             }
        });

    } catch (error) {
        logger.error(`Project generation failed: ${error.message}`);
        // Ensure cleanup happens even if zip creation/sending fails
         if (tempDir) {
            await fs.remove(tempDir).catch(err => logger.error(`Cleanup error after failure: ${err}`));
        }
        if (!res.headersSent) {
             res.status(500).json({ message: error.message || 'Failed to generate project.' });
        }
    }
};

module.exports = {
    generateProject,
};