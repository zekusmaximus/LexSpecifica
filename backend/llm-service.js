// llm-service.js - Service for processing requests through LLM API

const axios = require('axios');
const { constructPrompt } = require('./prompt-templates');

// Environment variables should be set for API keys
const HF_API_KEY = process.env.HF_API_KEY; // For Hugging Face models
const HF_MODEL = process.env.HF_MODEL || "mistralai/Mixtral-8x7B-Instruct-v0.1";

// Main function to process world concept through the LLM
async function processWorldConcept(worldConcept, parameters = {}) {
  try {
    // Extract parameters with defaults
    const {
      techLevel = 5,
      governmentType = 'unspecified',
      detailLevel = 'medium',
      worldElements = [],
      citizenRights = []
    } = parameters;
    
    console.log(`Processing world concept: "${worldConcept.substring(0, 50)}..." with parameters:`, {
      techLevel,
      governmentType,
      detailLevel
    });
    
    // Construct prompts for different components
    const legalFrameworkPrompt = constructPrompt('legal-framework', {
      worldConcept,
      techLevel,
      governmentType,
      detailLevel,
      worldElements,
      citizenRights
    });
    
    const policiesPrompt = constructPrompt('policies', {
      worldConcept,
      techLevel,
      governmentType,
      detailLevel,
      worldElements,
      citizenRights
    });
    
    const conflictsPrompt = constructPrompt('conflicts', {
      worldConcept,
      techLevel,
      governmentType,
      detailLevel,
      worldElements,
      citizenRights
    });
    
    const legalDocumentsPrompt = constructPrompt('legal-documents', {
      worldConcept,
      techLevel,
      governmentType,
      detailLevel,
      worldElements,
      citizenRights
    });
    
    console.log("Sending requests to LLM API...");
    
    // Send requests to LLM API in parallel for better performance
    const [legalFramework, policies, conflicts, legalDocuments] = await Promise.all([
      generateFromHuggingFace(legalFrameworkPrompt),
      generateFromHuggingFace(policiesPrompt),
      generateFromHuggingFace(conflictsPrompt),
      generateFromHuggingFace(legalDocumentsPrompt)
    ]);
    
    console.log("Successfully received responses from LLM API.");
    
    // Process and structure the responses
    return {
      legalFramework: legalFramework.trim(),
      policies: processPolicies(policies),
      conflicts: processConflicts(conflicts),
      legalDocuments: processLegalDocuments(legalDocuments)
    };
  } catch (error) {
    console.error('Error in LLM processing:', error);
    throw new Error('Failed to process through language model');
  }
}

// Function to use Hugging Face models
async function generateFromHuggingFace(prompt, model = HF_MODEL) {
  try {
    console.log(`Generating content using model: ${model}`);
    console.log(`Prompt (truncated): "${prompt.substring(0, 100)}..."`);
    
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      { 
        inputs: prompt,
        parameters: {
          max_new_tokens: 1024,
          temperature: 0.7,
          top_p: 0.9,
          return_full_text: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data && response.data.length > 0 && response.data[0].generated_text) {
      return response.data[0].generated_text;
    } else {
      console.error('Unexpected response format from Hugging Face API:', response.data);
      throw new Error('Invalid response format from language model');
    }
  } catch (error) {
    console.error('Error with Hugging Face API:', error.response?.data || error.message);
    throw new Error('Failed to generate from Hugging Face model');
  }
}

// Generate specific document types based on the world concept
async function generateDocument(type, worldConcept, parameters = {}) {
  try {
    const documentPrompt = constructPrompt(`document-${type}`, {
      worldConcept,
      ...parameters
    });
    
    const documentContent = await generateFromHuggingFace(documentPrompt);
    
    return {
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} for ${worldConcept.substring(0, 30)}...`,
      content: documentContent.trim()
    };
  } catch (error) {
    console.error('Error generating document:', error);
    throw new Error('Failed to generate document');
  }
}

// Process the policies response into a structured format
function processPolicies(policiesResponse) {
  console.log("Processing policies response...");
  // Split by numbered items or bullet points
  const policies = policiesResponse
    .split(/\d+[\.\)]\s*|\n\s*-\s+/)
    .filter(item => item.trim().length > 0)
    .map(item => {
      // Extract policy name if it's in bold, quotes, or has a colon
      const policyNameMatch = item.match(/["""\*_]{1,2}([^"""\*_]+)["""\*_]{1,2}:?|(.+?):/);
      if (policyNameMatch) {
        return (policyNameMatch[1] || policyNameMatch[2]).trim();
      }
      return item.split('\n')[0].trim();
    });
  
  console.log(`Extracted ${policies.length} policies.`);
  return policies;
}

// Process the conflicts response into a structured format
function processConflicts(conflictsResponse) {
  console.log("Processing conflicts response...");
  // Split by numbered items or bullet points
  const conflicts = conflictsResponse
    .split(/\d+[\.\)]\s*|\n\s*-\s+/)
    .filter(item => item.trim().length > 0)
    .map(item => item.trim());
  
  console.log(`Extracted ${conflicts.length} conflicts.`);
  return conflicts;
}

// Process legal document examples
function processLegalDocuments(legalDocumentsResponse) {
  console.log("Processing legal documents response...");
  // Look for document title patterns
  const documents = [];
  const documentSections = legalDocumentsResponse.split(/#{2,3}\s+|DOCUMENT\s+\d+:|FOUNDATION CHARTER|CHARTER OF|CONSTITUTION OF/i);
  
  for (const section of documentSections) {
    if (section.trim().length === 0) continue;
    
    // Try to extract title and content
    const lines = section.trim().split('\n');
    const title = lines[0].replace(/["""\*_]/g, '').trim() || "Foundation Charter";
    const content = lines.slice(1).join('\n').trim();
    
    if (content) {
      documents.push({ title, content });
    }
  }
  
  // If no documents were successfully extracted, create a default one
  if (documents.length === 0) {
    documents.push({
      title: "Foundation Charter",
      content: legalDocumentsResponse.trim()
    });
  }
  
  console.log(`Extracted ${documents.length} legal documents.`);
  return documents;
}

module.exports = {
  processWorldConcept,
  generateDocument
};