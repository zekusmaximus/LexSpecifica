// server.js - Express server for LexSpecifica API

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { processWorldConcept, generateDocument } = require('./llm-service');
const db = require('./database');

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '2mb' })); // Increased limit for larger requests
app.use(express.static(path.join(__dirname, 'public')));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.post('/api/generate', async (req, res) => {
  try {
    console.log('Received generation request');
    const { worldConcept, parameters } = req.body;
    
    if (!worldConcept) {
      console.log('Error: World concept is required');
      return res.status(400).json({ error: 'World concept is required' });
    }
    
    console.log(`Processing world concept: "${worldConcept.substring(0, 50)}..."`);
    
    // Process request through LLM service
    const generatedContent = await processWorldConcept(worldConcept, parameters);
    
    console.log('Content generated successfully');
    
    // Return generated content
    res.json(generatedContent);
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content: ' + error.message });
  }
});

// User scenarios management
app.post('/api/scenarios', async (req, res) => {
  try {
    console.log('Received save scenario request');
    const { userId, name, worldConcept, generatedContent } = req.body;
    
    // Save scenario to database
    const scenarioId = await db.saveScenario(userId || 'anonymous', {
      name: name || 'Untitled Scenario',
      worldConcept,
      generatedContent,
      createdAt: new Date()
    });
    
    console.log(`Scenario saved with ID: ${scenarioId}`);
    res.json({ id: scenarioId });
  } catch (error) {
    console.error('Error saving scenario:', error);
    res.status(500).json({ error: 'Failed to save scenario: ' + error.message });
  }
});

app.get('/api/scenarios/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Retrieving scenarios for user: ${userId}`);
    
    // Retrieve user's scenarios from database
    const scenarios = await db.getUserScenarios(userId);
    
    console.log(`Retrieved ${scenarios.length} scenarios`);
    res.json(scenarios);
  } catch (error) {
    console.error('Error retrieving scenarios:', error);
    res.status(500).json({ error: 'Failed to retrieve scenarios: ' + error.message });
  }
});

// Templates management
app.get('/api/templates/legal', async (req, res) => {
  try {
    console.log('Retrieving legal templates');
    const templates = await db.getLegalTemplates();
    res.json(templates);
  } catch (error) {
    console.error('Error retrieving legal templates:', error);
    res.status(500).json({ error: 'Failed to retrieve templates: ' + error.message });
  }
});

app.get('/api/templates/policy', async (req, res) => {
  try {
    console.log('Retrieving policy templates');
    const templates = await db.getPolicyTemplates();
    res.json(templates);
  } catch (error) {
    console.error('Error retrieving policy templates:', error);
    res.status(500).json({ error: 'Failed to retrieve templates: ' + error.message });
  }
});

// Document generation
app.post('/api/documents/generate', async (req, res) => {
  try {
    console.log('Received document generation request');
    const { type, parameters, worldConcept } = req.body;
    
    if (!type || !worldConcept) {
      console.log('Error: Document type and world concept are required');
      return res.status(400).json({ error: 'Document type and world concept are required' });
    }
    
    console.log(`Generating document of type: ${type}`);
    
    // Generate document based on type and parameters
    const document = await generateDocument(type, worldConcept, parameters);
    
    console.log('Document generated successfully');
    res.json({ document });
  } catch (error) {
    console.error('Error generating document:', error);
    res.status(500).json({ error: 'Failed to generate document: ' + error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Catch all other routes and return the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`LexSpecifica API server running on port ${PORT}`);
});