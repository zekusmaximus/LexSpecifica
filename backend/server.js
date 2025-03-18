// server.js - Express server for LexSpecifica API

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { processWorldConcept } = require('./llm-service');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.post('/api/generate', async (req, res) => {
  try {
    const { worldConcept, parameters } = req.body;
    
    if (!worldConcept) {
      return res.status(400).json({ error: 'World concept is required' });
    }
    
    // Process request through LLM service
    const generatedContent = await processWorldConcept(worldConcept, parameters);
    
    // Return generated content
    res.json(generatedContent);
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

// User scenarios management
app.post('/api/scenarios', async (req, res) => {
  try {
    const { userId, name, worldConcept, generatedContent } = req.body;
    
    // Save scenario to database
    const scenarioId = await db.saveScenario(userId, {
      name,
      worldConcept,
      generatedContent,
      createdAt: new Date()
    });
    
    res.json({ id: scenarioId });
  } catch (error) {
    console.error('Error saving scenario:', error);
    res.status(500).json({ error: 'Failed to save scenario' });
  }
});

app.get('/api/scenarios/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Retrieve user's scenarios from database
    const scenarios = await db.getUserScenarios(userId);
    
    res.json(scenarios);
  } catch (error) {
    console.error('Error retrieving scenarios:', error);
    res.status(500).json({ error: 'Failed to retrieve scenarios' });
  }
});

// Templates management
app.get('/api/templates/legal', async (req, res) => {
  try {
    const templates = await db.getLegalTemplates();
    res.json(templates);
  } catch (error) {
    console.error('Error retrieving legal templates:', error);
    res.status(500).json({ error: 'Failed to retrieve templates' });
  }
});

app.get('/api/templates/policy', async (req, res) => {
  try {
    const templates = await db.getPolicyTemplates();
    res.json(templates);
  } catch (error) {
    console.error('Error retrieving policy templates:', error);
    res.status(500).json({ error: 'Failed to retrieve templates' });
  }
});

// Document generation
app.post('/api/documents/generate', async (req, res) => {
  try {
    const { type, parameters, worldConcept } = req.body;
    
    if (!type || !worldConcept) {
      return res.status(400).json({ error: 'Document type and world concept are required' });
    }
    
    // Generate document based on type and parameters
    const document = await processWorldConcept.generateDocument(type, worldConcept, parameters);
    
    res.json({ document });
  } catch (error) {
    console.error('Error generating document:', error);
    res.status(500).json({ error: 'Failed to generate document' });
  }
});

// Catch all other routes and return the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`LexSpecifica API server running on port ${PORT}`);
});