// llm-service.js - Complete service with properly ordered functions

const axios = require('axios');
const { constructPrompt } = require('./prompt-templates');

// Environment variables should be set for API keys
const HF_API_KEY = process.env.HF_API_KEY;
const HF_MODEL = process.env.HF_MODEL || "mistralai/Mixtral-8x7B-Instruct-v0.1";

// Function to send a prompt to the Hugging Face API and get a response
// This needs to be defined first as other functions depend on it
async function generateFromHuggingFace(prompt, parameters = {}) {
  try {
    // Default parameters
    const defaultParams = {
      temperature: 0.5,
      max_tokens: 500,
      top_p: 0.9,
      repetition_penalty: 1.1
    };
    
    // Merge defaults with any provided parameters
    const finalParams = { ...defaultParams, ...parameters };
    
    console.log(`Sending request to ${HF_MODEL} with prompt length: ${prompt.length}`);
    
    // Make the API request
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      { 
        inputs: prompt,
        parameters: finalParams
      },
      {
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Extract and return the generated text
    if (response.data && response.data[0] && response.data[0].generated_text) {
      return response.data[0].generated_text;
    } else {
      console.error('Unexpected response format:', response.data);
      throw new Error('Invalid response format from HuggingFace API');
    }
  } catch (error) {
    console.error('Error with Hugging Face API:', error.response?.data || error.message);
    throw new Error(`Failed to generate from Hugging Face model: ${error.message}`);
  }
}

// Process the policies response into a structured format with name and description
function processPolicies(policiesResponse) {
  const policies = [];
  console.log('Processing policies from response:', policiesResponse.substring(0, 200) + '...');
  
  // Try multiple approaches to parse the policies
  
  // First approach: Look for numbered list with policy name and description
  const lines = policiesResponse.split('\n').filter(line => line.trim().length > 0);
  
  for (const line of lines) {
    // Match patterns like "1. Resource Allocation Act: Controls distribution of resources"
    const match = line.match(/^\d+\.\s*(.*?):\s*(.*?)$/);
    if (match && match[1] && match[2]) {
      policies.push({
        name: match[1].trim().replace(/[\[\]]/g, ''),
        description: match[2].trim().replace(/[\[\]]/g, '')
      });
      continue;
    }
    
    // Match alternate format without numbers
    const colonMatch = line.match(/^(.*?):\s*(.*?)$/);
    if (colonMatch && colonMatch[1] && colonMatch[2] && !line.trim().startsWith('FORMAT')) {
      policies.push({
        name: colonMatch[1].trim().replace(/[\[\]]/g, ''),
        description: colonMatch[2].trim().replace(/[\[\]]/g, '')
      });
    }
  }
  
  // If we found at least one policy, return what we have
  if (policies.length > 0) {
    console.log(`Found ${policies.length} policies using line-by-line parsing`);
    return policies;
  }
  
  // As a fallback, try to find any text blocks that might be policies
  const blocks = policiesResponse.split('\n\n').filter(block => block.trim().length > 0);
  
  for (const block of blocks) {
    const lines = block.split('\n');
    if (lines.length >= 1) {
      const firstLine = lines[0].trim();
      // Skip if it's just a heading or instruction
      if (firstLine.match(/^(FORMAT|CREATE|ENSURE)/i)) continue;
      
      // Assume the first line is the policy name
      const name = firstLine.replace(/^\d+\.\s*|\s*:.*$/, '').replace(/[\[\]]/g, '').trim();
      
      // And everything else is the description
      let description = lines.slice(1).join(' ').trim();
      if (!description && firstLine.includes(':')) {
        // If there's no separate description but there's a colon in the first line,
        // split at the colon
        const parts = firstLine.split(':');
        if (parts.length >= 2) {
          description = parts.slice(1).join(':').trim();
        }
      }
      
      if (name && name.length < 100) {
        policies.push({ name, description: description || "No description provided." });
      }
    }
  }
  
  if (policies.length > 0) {
    console.log(`Found ${policies.length} policies using block parsing`);
    return policies;
  }
  
  console.warn('Failed to parse policies, using fallback data');
  // If still no policies found, return a default set
  return [
    { name: "Universal Rights Protocol", description: "Establishes the baseline rights for all citizens regardless of social standing." },
    { name: "Resource Allocation Directive", description: "Governs the distribution of limited resources based on need and contribution." },
    { name: "Citizenship Classification Act", description: "Defines different categories of citizenship and their associated privileges." },
    { name: "Intergroup Conflict Resolution Statute", description: "Establishes procedures for resolving disputes between different social groups." },
    { name: "Authority Transfer Procedure", description: "Regulates the process of transferring power between leadership councils." }
  ];
}

// Process the conflicts response into an array of conflict descriptions
function processConflicts(conflictsResponse) {
  const conflicts = [];
  console.log('Processing conflicts from response:', conflictsResponse.substring(0, 200) + '...');
  
  // Try multiple patterns
  // First pattern: CONFLICT X: [description]
  const conflictRegex = /CONFLICT\s+\d+:\s+(.+?)(?=CONFLICT\s+\d+:|$)/gs;
  
  let match;
  while ((match = conflictRegex.exec(conflictsResponse)) !== null) {
    if (match[1] && match[1].trim().length > 0) {
      conflicts.push(match[1].trim());
    }
  }
  
  if (conflicts.length > 0) {
    console.log(`Found ${conflicts.length} conflicts using regex pattern`);
    return conflicts;
  }
  
  // If regex matching failed, try splitting by paragraph
  const paragraphs = conflictsResponse.split(/\n\n+/)
    .filter(para => para.trim().length > 0 && !para.trim().startsWith('FORMAT') && !para.trim().startsWith('CREATE'));
  
  for (const para of paragraphs) {
    // Remove any conflict numbering or labels
    const cleanPara = para.replace(/^(CONFLICT|Conflict)\s+\d+:?\s*/i, '').trim();
    if (cleanPara.length > 20) { // Only include substantial paragraphs
      conflicts.push(cleanPara);
    }
  }
  
  if (conflicts.length > 0) {
    console.log(`Found ${conflicts.length} conflicts using paragraph splitting`);
    return conflicts;
  }
  
  // Last resort: try to find numbered items
  const lines = conflictsResponse.split('\n');
  for (const line of lines) {
    const match = line.match(/^\d+\.\s*(.+)$/);
    if (match && match[1] && match[1].length > 20) {
      conflicts.push(match[1].trim());
    }
  }
  
  if (conflicts.length > 0) {
    console.log(`Found ${conflicts.length} conflicts using numbered line parsing`);
    return conflicts;
  }
  
  console.warn('Failed to parse conflicts, using fallback data');
  // Ensure we have conflicts (or at least some conflicts)
  return [
    "A lower-caste citizen discovers evidence of corruption by a high-ranking official, but revealing this would violate sacred laws about respecting authority. They must decide whether to become a whistleblower and risk execution or remain complicit in the injustice affecting their community.",
    "Two individuals from different social groups fall in love, but the legal system strictly forbids such relationships. When they attempt to challenge this law, they become entangled in a landmark case that threatens to upend the social hierarchy.",
    "A law enforcer develops a technology that can predict legal violations before they occur, but implementing it would violate fundamental rights. The resulting debate divides society between those prioritizing security and those defending basic freedoms."
  ];
}

// Function to generate legal framework only
async function generateLegalFramework(worldConcept, parameters = {}) {
  try {
    // Extract parameters with defaults
    const {
      techLevel = 5,
      governmentType = 'unspecified',
      worldElements = [],
      citizenRights = []
    } = parameters;
    
    console.log(`Generating legal framework for world: "${worldConcept.substring(0, 50)}..."`);
    
    // Construct the legal framework prompt
    const legalFrameworkPrompt = constructPrompt('legal-framework', {
      worldConcept,
      techLevel,
      governmentType,
      worldElements,
      citizenRights
    });
    
    // Generate legal framework content
    const legalFramework = await generateFromHuggingFace(legalFrameworkPrompt, {
      max_tokens: 1000,
      temperature: 0.7
    });
    
    console.log('Legal framework generated successfully');
    
    // Return the generated content
    return {
      legalFramework: legalFramework.trim()
    };
  } catch (error) {
    console.error('Error generating legal framework:', error);
    throw new Error('Failed to generate legal framework: ' + error.message);
  }
}

// Function to generate policies only
async function generatePolicies(worldConcept, parameters = {}) {
  try {
    // Extract parameters with defaults
    const {
      techLevel = 5,
      governmentType = 'unspecified',
      worldElements = [],
      citizenRights = []
    } = parameters;
    
    console.log(`Generating policies for world: "${worldConcept.substring(0, 50)}..."`);
    
    // Construct the policies prompt
    const policiesPrompt = constructPrompt('policies', {
      worldConcept,
      techLevel,
      governmentType,
      worldElements,
      citizenRights
    });
    
    // Generate policies content
    const policiesResponse = await generateFromHuggingFace(policiesPrompt, {
      max_tokens: 800,
      temperature: 0.7
    });
    
    console.log('Policies generated successfully, processing response');
    
    // Process the response
    const policies = processPolicies(policiesResponse);
    
    // Return the generated content
    return { policies };
  } catch (error) {
    console.error('Error generating policies:', error);
    throw new Error('Failed to generate policies: ' + error.message);
  }
}

// Function to generate conflicts only
async function generateConflicts(worldConcept, parameters = {}) {
  try {
    // Extract parameters with defaults
    const {
      techLevel = 5,
      governmentType = 'unspecified',
      worldElements = [],
      citizenRights = []
    } = parameters;
    
    console.log(`Generating conflicts for world: "${worldConcept.substring(0, 50)}..."`);
    
    // Construct the conflicts prompt
    const conflictsPrompt = constructPrompt('conflicts', {
      worldConcept,
      techLevel,
      governmentType,
      worldElements,
      citizenRights
    });
    
    // Generate conflicts content
    const conflictsResponse = await generateFromHuggingFace(conflictsPrompt, {
      max_tokens: 800,
      temperature: 0.8
    });
    
    console.log('Conflicts generated successfully, processing response');
    
    // Process the response
    const conflicts = processConflicts(conflictsResponse);
    
    // Return the generated content
    return { conflicts };
  } catch (error) {
    console.error('Error generating conflicts:', error);
    throw new Error('Failed to generate conflicts: ' + error.message);
  }
}

// Function to generate specific document types
async function generateDocument(type, worldConcept, parameters = {}) {
  try {
    console.log(`Generating document of type ${type} for world: "${worldConcept.substring(0, 50)}..."`);
    
    // Construct appropriate prompt based on document type
    const documentPrompt = constructPrompt(`document-${type}`, {
      worldConcept,
      ...parameters
    });
    
    // Generate the document content
    const documentContent = await generateFromHuggingFace(documentPrompt, {
      max_tokens: 1200,
      temperature: 0.7
    });
    
    console.log(`Document of type ${type} generated successfully`);
    
    return {
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} for ${worldConcept.substring(0, 30)}...`,
      content: documentContent.trim()
    };
  } catch (error) {
    console.error('Error generating document:', error);
    throw new Error(`Failed to generate document of type ${type}: ${error.message}`);
  }
}

// Export all the necessary functions
module.exports = {
  generateLegalFramework,
  generatePolicies,
  generateConflicts,
  generateDocument
};