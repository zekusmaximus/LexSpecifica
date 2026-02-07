const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const generationRoutes = require('./routes/generation-routes');

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

// Body Parsing
app.use(express.json({ limit: '2mb' }));

// Routes
app.use('/api/generate', generationRoutes);
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Static files (for production or if updated frontend build is placed here)
app.use(express.static(path.join(__dirname, '../public')));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;
