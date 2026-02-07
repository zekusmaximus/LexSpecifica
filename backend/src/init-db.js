const { sequelize } = require('./models');

async function initDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connection to database has been established successfully.');

        // Sync models - using alter: true to update schema if it changes
        // In production, use migrations instead
        await sequelize.sync({ alter: true });
        console.log('Database models synchronized.');

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

if (require.main === module) {
    initDatabase();
}

module.exports = initDatabase;
