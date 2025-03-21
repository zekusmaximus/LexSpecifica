// llm-service.js - Complete rewrite with correct function order

const axios = require('axios');
const { constructPrompt } = require('./prompt-templates');

// Environment variables should be set for API keys
const HF_API_KEY = process.env.HF_API_KEY;
const HF_MODEL = process.env.HF_MODEL || "mistralai/Mixtral-8x7B-Instruct-v0.1";

// Function to send a prompt to the Hugging Face API and get a response
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
    return response.data[0].generated_text;
  } catch (error) {
    console.error('Error with Hugging Face API:', error.response?.data || error.message);
    throw new Error('Failed to generate from Hugging Face model');
  }
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
      max_tokens: 1500,
      temperature: 0.5
    });
    
    // Return the generated content
    return {
      legalFramework: legalFramework.trim()
    };
  } catch (error) {
    console.error('Error generating legal framework:', error);
    throw new Error('Failed to generate legal framework');
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
      max_tokens: 1000,
      temperature: 0.7
    });
    
    // Process the response
    const policies = processPolicies(policiesResponse);
    
    // Return the generated content
    return { policies };
  } catch (error) {
    console.error('Error generating policies:', error);
    throw new Error('Failed to generate policies');
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
      max_tokens: 500,
      temperature: 0.6
    });
    
    // Process the response
    const conflicts = processConflicts(conflictsResponse);
    
    // Return the generated content
    return { conflicts };
  } catch (error) {
    console.error('Error generating conflicts:', error);
    throw new Error('Failed to generate conflicts');
  }
}

// Function to generate specific document types
async function generateDocument(type, worldConcept, parameters = {}) {
  try {
    // Construct appropriate prompt based on document type
    const documentPrompt = constructPrompt(`document-${type}`, {
      worldConcept,
      ...parameters
    });
    
    // Generate the document content
    const documentContent = await generateFromHuggingFace(documentPrompt, {
      max_tokens: 1000,
      temperature: 0.6
    });
    
    return {
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} for ${worldConcept.substring(0, 30)}...`,
      content: documentContent.trim()
    };
  } catch (error) {
    console.error('Error generating document:', error);
    throw new Error(`Failed to generate document of type ${type}`);
  }
}

// Process the policies response into a structured format with name and description
function processPolicies(policiesResponse) {
  const policies = [];
  
  // Try to parse the structured format with policy sections
  const policyRegex = /===POLICY\s+\d+===\s+NAME:\s+(.*?)\s+DESCRIPTION:\s+([\s\S]*?)(?====POLICY|$)/g;
  
  let match;
  while ((match = policyRegex.exec(policiesResponse)) !== null) {
    if (match[1] && match[2]) {
      policies.push({
        name: match[1].trim(),
        description: match[2].trim()
      });
    }
  }
  
  // If regex matching failed, try alternate formats
  if (policies.length === 0) {
    const sections = policiesResponse.split(/\n\n+/);
    
    for (const section of sections) {
      // Try to find name: description format
      const nameMatch = section.match(/NAME:|POLICY NAME:|TITLE:?\s*(.*?)(?:\n|$)/i);
      const descMatch = section.match(/DESCRIPTION:|DETAILS:?\s*([\s\S]*?)(?=NAME:|POLICY NAME:|TITLE:|$)/i);
      
      if (nameMatch && nameMatch[1] && descMatch && descMatch[1]) {
        policies.push({
          name: nameMatch[1].trim(),
          description: descMatch[1].trim()
        });
      } else {
        // Try simple colon format
        const parts = section.split(/:\s*/);
        if (parts.length >= 2) {
          const name = parts[0].replace(/^\d+\.|\s*POLICY\s*\d+\s*/i, '').trim();
          const description = parts.slice(1).join(': ').trim();
          
          if (name && description && name.length < 100 && description.length > 30) {
            policies.push({ name, description });
          }
        }
      }
    }
  }
  
  // If we still have no policies or fewer than expected, DON'T use fallback data
  // Instead, log the error and return what we have
  if (policies.length === 0) {
    console.error("Failed to parse policies from LLM response:", policiesResponse);
    // Only use minimal fallback data to avoid the empty screen
    return [{ 
      name: "Error: Policy Generation Failed", 
      description: "The system was unable to generate policies for your world concept. Please try again or refine your world description to include more specific details."
    }];
  }
  
  return policies;
}

// Process the conflicts response into an array of conflict descriptions
function processConflicts(conflictsResponse) {
  const conflicts = [];
  const conflictRegex = /CONFLICT\s+\d+:\s+(.+?)(?=CONFLICT\s+\d+:|$)/gs;
  
  let match;
  while ((match = conflictRegex.exec(conflictsResponse)) !== null) {
    if (match[1] && match[1].trim().length > 0) {
      conflicts.push(match[1].trim());
    }
  }
  
  // If regex matching failed, try splitting by numbered lines
  if (conflicts.length === 0) {
    const lines = conflictsResponse.split(/\n\n+/)
      .filter(para => para.trim().length > 0);
    
    for (const para of lines) {
      const cleanPara = para.replace(/CONFLICT\s+\d+:\s+/i, '').trim();
      if (cleanPara.length > 0) {
        conflicts.push(cleanPara);
      }
    }
  }
  
  // Ensure we have conflicts (or at least some conflicts)
  return conflicts.length > 0 ? conflicts : [
    "A lower-caste citizen discovers evidence of corruption by a high-ranking official, but revealing this would violate sacred laws about respecting authority. They must decide whether to become a whistleblower and risk execution or remain complicit in the injustice affecting their community.",
    "Two individuals from different social groups fall in love, but the legal system strictly forbids such relationships. When they attempt to challenge this law, they become entangled in a landmark case that threatens to upend the social hierarchy.",
    "A law enforcer develops a technology that can predict legal violations before they occur, but implementing it would violate fundamental rights. The resulting debate divides society between those prioritizing security and those defending basic freedoms."
  ];
}

// Export all the necessary functions
module.exports = {
  generateLegalFramework,
  generatePolicies,
  generateConflicts,
  generateDocument
};