// llm-service.js
const { constructPrompt } = require('./prompt-templates');
const axios = require('axios');

// Get API key from environment variable with the CORRECT name
const HF_API_KEY = process.env.HF_API_KEY;
const API_ENDPOINT = process.env.HF_API_ENDPOINT || 'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1';

// Main function to call the Mixtral model via HuggingFace
async function callMixtralModel(prompt) {
  try {
    console.log(`Calling HuggingFace API with prompt length: ${prompt.length} characters`);
    
    if (!HF_API_KEY) {
      console.error('HF_API_KEY environment variable is not set!');
      throw new Error('HuggingFace API key not configured');
    }
    
    // Configuration for HuggingFace Inference API
    const response = await axios.post(API_ENDPOINT, {
      inputs: prompt,
      parameters: {
        max_new_tokens: 1500,
        temperature: 0.7,
        top_p: 0.9,
        do_sample: true,
        return_full_text: false  // Only return the generated text, not the prompt
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HF_API_KEY}`
      }
    });

    console.log('HuggingFace response received');
    
    // Handle the HuggingFace specific response format
    let responseText;
    if (Array.isArray(response.data) && response.data.length > 0) {
      // Standard HuggingFace format
      responseText = response.data[0].generated_text;
    } else if (response.data && typeof response.data === 'object') {
      // Alternative format
      responseText = response.data.generated_text || JSON.stringify(response.data);
    } else if (typeof response.data === 'string') {
      // Simple string response
      responseText = response.data;
    } else {
      console.error('Unexpected API response format:', JSON.stringify(response.data, null, 2));
      throw new Error('Unexpected API response format');
    }
    
    return { text: responseText };
  } catch (error) {
    console.error('Error calling Mixtral model via HuggingFace:', error.response?.data || error.message);
    
    // Check for specific HuggingFace errors
    if (error.response?.status === 503) {
      throw new Error('The model is currently loading. Please try again in a moment.');
    } else if (error.response?.status === 401) {
      throw new Error('API key authentication failed. Please check your HF_API_KEY.');
    }
    
    throw new Error(`Failed to get response from LLM: ${error.message}`);
  }
}

// Function to generate legal framework
async function generateLegalFramework(worldConcept, parameters = {}) {
  try {
    console.log('Generating legal framework with parameters:', { worldConcept, ...parameters });
    
    // Extract parameters with defaults
    const { techLevel = 5, governmentType = 'unspecified' } = parameters;
    
    // Construct the prompt using the template
    const prompt = constructPrompt('legal-framework', {
      worldConcept,
      techLevel,
      governmentType
    });
    
    // Call the LLM with the prompt
    const response = await callMixtralModel(prompt);
    
    // Return the results
    return { legalFramework: response.text };
  } catch (error) {
    console.error('Error generating legal framework:', error);
    throw error;
  }
}

// Function to generate policies
async function generatePolicies(worldConcept, parameters = {}) {
  try {
    console.log('Generating policies with parameters:', { worldConcept, ...parameters });
    
    // Extract parameters with defaults
    const { techLevel = 5, governmentType = 'unspecified' } = parameters;
    
    // Construct the prompt using the template
    const prompt = constructPrompt('policies', {
      worldConcept,
      techLevel,
      governmentType
    });
    
    // Call the LLM with the prompt
    const response = await callMixtralModel(prompt);
    
    // Parse the policies from the response
    const policies = parsePoliciesFromText(response.text);
    
    // Return the results
    return { policies };
  } catch (error) {
    console.error('Error generating policies:', error);
    throw error;
  }
}

// Function to generate conflicts
async function generateConflicts(worldConcept, parameters = {}) {
  try {
    console.log('Generating conflicts with parameters:', { worldConcept, ...parameters });
    
    // Extract parameters with defaults
    const { techLevel = 5, governmentType = 'unspecified' } = parameters;
    
    // Construct the prompt using the template
    const prompt = constructPrompt('conflicts', {
      worldConcept,
      techLevel,
      governmentType
    });
    
    // Call the LLM with the prompt
    const response = await callMixtralModel(prompt);
    
    // Parse the conflicts from the response
    const conflicts = parseConflictsFromText(response.text);
    
    // Return the results
    return { conflicts };
  } catch (error) {
    console.error('Error generating conflicts:', error);
    throw error;
  }
}

// Combined function to generate complete document
async function generateDocument(type, worldConcept, parameters = {}) {
  try {
    console.log(`Generating ${type} document with parameters:`, { worldConcept, ...parameters });
    
    // Extract parameters with defaults
    const { techLevel = 5, governmentType = 'unspecified' } = parameters;
    
    // Construct the prompt using the template
    const prompt = constructPrompt(type, {
      worldConcept,
      techLevel,
      governmentType
    });
    
    // Call the LLM with the prompt
    const response = await callMixtralModel(prompt);
    
    // Return the results based on type
    if (type === 'all') {
      // Parse the all-in-one response
      const sections = parseAllDocumentSections(response.text);
      return sections;
    } else {
      // Return the raw text for single document types
      return { content: response.text };
    }
  } catch (error) {
    console.error(`Error generating ${type} document:`, error);
    throw error;
  }
}

// Helper function to parse policies from text
function parsePoliciesFromText(text) {
  try {
    console.log('Parsing policies from text of length:', text.length);
    
    // Split by policy delimiter and filter out empty sections
    const policyBlocks = text.split('-------------------------------------------')
      .filter(block => block.trim().length > 0);
    
    console.log(`Found ${policyBlocks.length} policy blocks`);
    
    return policyBlocks.map(block => {
      // Extract the policy name from the heading
      const nameMatch = block.match(/## \[(.*?)\]/);
      const name = nameMatch ? nameMatch[1] : 'Unknown Policy';
      
      // Extract the description - everything after the name
      const description = block.replace(/## \[.*?\]/, '').trim();
      
      return { name, description };
    });
  } catch (error) {
    console.error('Error parsing policies:', error);
    // Return a fallback in case of parsing error
    return [{ name: 'Error parsing policies', description: 'The response format was unexpected: ' + error.message }];
  }
}

// Helper function to parse policies from text
function parsePoliciesFromText(text) {
  try {
    console.log('Parsing policies from text of length:', text.length);
    
    // Look for policy blocks - matches patterns like "===POLICY 1===" or "POLICY 1:" or just numbered policies
    const policyRegex = /(?:===POLICY \d+===|POLICY \d+:|^\d+\.)\s*(NAME:\s*([^\n]+))?\s*(DESCRIPTION:\s*)?([^]*?)(?=(?:===POLICY \d+===|POLICY \d+:|\n\d+\.|$))/gmi;
    
    const policies = [];
    let match;
    
    while ((match = policyRegex.exec(text)) !== null) {
      // Get the policy name and description
      let name = match[2]?.trim();
      let description = match[4]?.trim();
      
      // If no structured name found, try to extract from first line
      if (!name && description) {
        const firstLineMatch = description.match(/^([^:.\n]+)[:.]/);
        if (firstLineMatch) {
          name = firstLineMatch[1].trim();
          description = description.substring(firstLineMatch[0].length).trim();
        } else {
          // Just take the first line as the name
          const lines = description.split('\n');
          name = lines[0].trim();
          description = lines.slice(1).join('\n').trim();
        }
      }
      
      // Fallback if we still don't have a name
      if (!name) name = 'Policy';
      if (!description) description = 'No details provided';
      
      policies.push({ name, description });
    }
    
    // If no policies found with the regex, try a simpler approach
    if (policies.length === 0) {
      const simpleBlocks = text.split(/\n\s*\n/).filter(block => block.trim().length > 0);
      
      simpleBlocks.forEach(block => {
        const lines = block.split('\n');
        const name = lines[0].replace(/^[^a-z0-9]*/i, '').trim();
        const description = lines.slice(1).join('\n').trim();
        
        if (name) {
          policies.push({ name, description: description || 'No details provided' });
        }
      });
    }
    
    console.log(`Extracted ${policies.length} policies`);
    
    // If we still have no policies, return an error
    if (policies.length === 0) {
      console.error('Failed to extract policies from text. Raw text:', text);
      return [{ name: 'Policy', description: 'The response format was unexpected. Please try again or modify the prompt.' }];
    }
    
    return policies;
  } catch (error) {
    console.error('Error parsing policies:', error);
    // Return a fallback in case of parsing error
    return [{ name: 'Error parsing policies', description: 'The response format was unexpected: ' + error.message }];
  }
}

// Helper function to parse all document sections
function parseAllDocumentSections(text) {
  try {
    console.log('Parsing complete document of length:', text.length);
    
    // Split by section headers
    const sections = text.split(/===== SECTION \d+: [A-Z ]+ =====/);
    
    // Ignore the first split which is empty/intro text
    const contentSections = sections.slice(1);
    
    // Identify the framework, policies, and conflicts sections
    let framework = '';
    let policies = [];
    let conflicts = [];
    
    if (contentSections.length >= 1) {
      framework = contentSections[0].trim();
    }
    
    if (contentSections.length >= 2) {
      policies = parsePoliciesFromText(contentSections[1]);
    }
    
    if (contentSections.length >= 3) {
      conflicts = parseConflictsFromText(contentSections[2]);
    }
    
    return {
      legalFramework: framework,
      policies,
      conflicts
    };
  } catch (error) {
    console.error('Error parsing complete document:', error);
    return {
      legalFramework: 'Error parsing document: ' + error.message,
      policies: [],
      conflicts: []
    };
  }
}

module.exports = {
  generateLegalFramework,
  generatePolicies,
  generateConflicts,
  generateDocument
};