// database.js - Database service for SpecuLex

// In a production application, this would use a real database like MongoDB, PostgreSQL, etc.
// For this prototype, we'll use an in-memory store

// In-memory store
const scenarios = {};
const users = {};

// Template collections
const legalTemplates = [
  {
    id: 'democratic-republic',
    name: 'Democratic Republic',
    description: 'A representative democracy with elected officials and separation of powers',
    structure: {
      branches: ['Executive', 'Legislative', 'Judicial'],
      rights: ['Speech', 'Assembly', 'Fair Trial', 'Property']
    }
  },
  {
    id: 'technocratic-council',
    name: 'Technocratic Council',
    description: 'Government by technical experts based on demonstrated knowledge and skill',
    structure: {
      branches: ['Expert Council', 'Implementation Bureau', 'Assessment Tribunal'],
      rights: ['Education', 'Merit Evaluation', 'Technical Appeal', 'Data Access']
    }
  },
  {
    id: 'corporate-federation',
    name: 'Corporate Federation',
    description: 'Governance through corporate entities with citizenship tied to employment',
    structure: {
      branches: ['Executive Board', 'Shareholder Assembly', 'Contract Court'],
      rights: ['Employment', 'Consumer Protection', 'Transfer', 'Grievance']
    }
  },
  {
    id: 'magical-conclave',
    name: 'Magical Conclave',
    description: 'Governance through magical practitioners with tiered access based on ability',
    structure: {
      branches: ['Archmage Council', 'Spell Registry', 'Enchantment Court'],
      rights: ['Spell Access', 'Non-magical Protection', 'Apprenticeship', 'Ritual Space']
    }
  }
];

const policyTemplates = [
  {
    id: 'resource-allocation',
    name: 'Resource Allocation',
    description: 'Policies governing how resources are distributed in your society',
    examples: [
      'Universal Basic Resources Act',
      'Strategic Resource Control Protocol',
      'Merit-Based Resource Distribution Framework'
    ]
  },
  {
    id: 'identity-rights',
    name: 'Identity Rights',
    description: 'Policies governing personhood, citizenship, and identity',
    examples: [
      'Citizenship Classification Statute',
      'Identity Verification Protocol',
      'Personhood Recognition Act'
    ]
  },
  {
    id: 'technology-regulation',
    name: 'Technology Regulation',
    description: 'Policies governing technology development and usage',
    examples: [
      'Advanced Technology Control Act',
      'Innovation Safety Protocol',
      'Tech Licensing Framework'
    ]
  },
  {
    id: 'conflict-resolution',
    name: 'Conflict Resolution',
    description: 'Policies governing how disputes are handled',
    examples: [
      'Mandatory Mediation Protocol',
      'Tiered Justice System',
      'Alternative Dispute Resolution Framework'
    ]
  }
];

// Generate a unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// User management functions
async function createUser(userData) {
  const userId = generateId();
  users[userId] = {
    ...userData,
    id: userId,
    createdAt: new Date(),
    scenarios: []
  };
  return userId;
}

async function getUser(userId) {
  return users[userId];
}

// Scenario management functions
async function saveScenario(userId, scenarioData) {
  // Initialize user's scenarios array if it doesn't exist
  if (!scenarios[userId]) {
    scenarios[userId] = [];
  }

  const scenarioId = generateId();
  const newScenario = {
    ...scenarioData,
    id: scenarioId,
    userId,
    updatedAt: new Date()
  };
  
  // Add to scenarios collection
  scenarios[userId].unshift(newScenario);
  
  // Update user's scenario list
  if (users[userId]) {
    if (!users[userId].scenarios) {
      users[userId].scenarios = [];
    }
    users[userId].scenarios.push(scenarioId);
  }
  
  return scenarioId;
}

async function getScenario(userId, scenarioId) {
  if (!scenarios[userId]) return null;
  return scenarios[userId].find(s => s.id === scenarioId) || null;
}

async function getUserScenarios(userId) {
  return scenarios[userId] || [];
}

async function updateScenario(userId, scenarioId, updates) {
  if (!scenarios[userId]) return false;
  
  const index = scenarios[userId].findIndex(s => s.id === scenarioId);
  if (index === -1) return false;
  
  scenarios[userId][index] = {
    ...scenarios[userId][index],
    ...updates,
    updatedAt: new Date()
  };
  
  return true;
}

async function deleteScenario(userId, scenarioId) {
  if (!scenarios[userId]) return false;
  
  const index = scenarios[userId].findIndex(s => s.id === scenarioId);
  if (index === -1) return false;
  
  scenarios[userId].splice(index, 1);
  
  // Update user's scenario list
  if (users[userId] && users[userId].scenarios) {
    const scenarioIndex = users[userId].scenarios.indexOf(scenarioId);
    if (scenarioIndex !== -1) {
      users[userId].scenarios.splice(scenarioIndex, 1);
    }
  }
  
  return true;
}

// Template management functions
async function getLegalTemplates() {
  return legalTemplates;
}

async function getPolicyTemplates() {
  return policyTemplates;
}

// Export all database functions
module.exports = {
  // User functions
  createUser,
  getUser,
  
  // Scenario functions
  saveScenario,
  getScenario,
  getUserScenarios,
  updateScenario,
  deleteScenario,
  
  // Template functions
  getLegalTemplates,
  getPolicyTemplates
};