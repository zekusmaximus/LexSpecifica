const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize Sequelize with SQLite
// In production, this would be configured to use PostgreSQL or MySQL via environment variables
const storagePath = process.env.DB_STORAGE_PATH || path.join(__dirname, '../../database.sqlite');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    // SQLite specific options
    transactionType: 'IMMEDIATE'
});

module.exports = sequelize;
