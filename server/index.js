require('dotenv').config(); // Load .env variables
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
// const connectDB = require('./config/db');
const logger = require('./utils/logger');
const generateRoutes = require('./routes/generate');

// Connect to Database
// connectDB();

const app = express();

// --- Middleware ---
// Security Headers
app.use(helmet());
// Enable CORS - Configure appropriately for production
app.use(cors({
    origin: process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : 'YOUR_PROD_FRONTEND_URL', // Allow frontend dev server
    credentials: true, // If you need cookies/sessions later for auth
}));
// Request Logging (using morgan stream with Pino)
app.use(morgan('dev', { stream: { write: (message) => logger.info(message.trim()) } }));
// Body Parsers
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// --- Swagger Setup ---
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Go Initializer API',
            version: '1.0.0',
            description: 'API documentation for Go Initializer backend'
        },
        servers: [
            {
                url: 'http://localhost:' + (process.env.PORT || 5001),
                description: 'Development server'
            }
        ]
    },
    apis: [path.join(__dirname, './routes/*.js'), path.join(__dirname, './controllers/*.js')]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// --- API Routes ---
app.use('/api/generate', generateRoutes);
// Add other routes here later (auth, preview)


// --- Basic Error Handling Middleware (Example) ---
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Something broke!');
});

// --- Server Initialization ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});