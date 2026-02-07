const { DataTypes } = require('sequelize');
const sequelize = require('../config');

// User Model
const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

// Scenario Model
const Scenario = sequelize.define('Scenario', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Untitled Scenario'
    },
    worldConcept: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    techLevel: {
        type: DataTypes.INTEGER,
        defaultValue: 5
    },
    governmentType: {
        type: DataTypes.STRING,
        defaultValue: 'unspecified'
    },
    legalFramework: {
        type: DataTypes.TEXT, // Storing the generated legal framework text
        allowNull: true
    }
});

// Relationships
User.hasMany(Scenario, { foreignKey: 'userId' });
Scenario.belongsTo(User, { foreignKey: 'userId' });

// Policy Model (Children of Scenario)
const Policy = sequelize.define('Policy', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

Scenario.hasMany(Policy, { foreignKey: 'scenarioId', onDelete: 'CASCADE' });
Policy.belongsTo(Scenario, { foreignKey: 'scenarioId' });

// Conflict Model (Children of Scenario)
const Conflict = sequelize.define('Conflict', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

Scenario.hasMany(Conflict, { foreignKey: 'scenarioId', onDelete: 'CASCADE' });
Conflict.belongsTo(Scenario, { foreignKey: 'scenarioId' });

module.exports = {
    sequelize,
    User,
    Scenario,
    Policy,
    Conflict
};
