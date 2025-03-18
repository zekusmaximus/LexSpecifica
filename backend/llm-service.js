// llm-service.js - Service for processing requests through LLM API

const axios = require('axios');
const { constructPrompt } = require('./prompt-templates');

// Environment variables should be set for API keys
const HF_API_KEY = process.env.HF_API_KEY; // For Hugging Face models
const HF_MODEL = process.env.HF_MODEL || "meta-llama/Llama-2-7b-chat-hf";

// Initialize Hugging Face client
const hf = new HfInference(HF_API_KEY);

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
    
    // Send requests to LLM API in parallel for better performance
    const [legalFramework, policies, conflicts, legalDocuments] = await Promise.all([
      generateFromLLM(legalFrameworkPrompt),
      generateFromLLM(policiesPrompt),
      generateFromLLM(conflictsPrompt),
      generateFromLLM(legalDocumentsPrompt)
    ]);
    
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

// Function to send a prompt to the LLM API and get a response
async function generateFromLLM(prompt) {
  try {
    // For Anthropic Claude API
    const response = await axios.post(
      LLM_API_URL,
      {
        prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
        model: "claude-3-opus-20240229",
        max_tokens_to_sample: 1000,
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': LLM_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );
    
    return response.data.completion;
  } catch (error) {
    console.error('Error calling LLM API:', error.response?.data || error.message);
    throw new Error('Failed to generate content from language model');
  }
}

// Alternative function to use Hugging Face models
async function generateFromHuggingFace(prompt, model = "mistralai/Mixtral-8x7B-Instruct-v0.1") {
  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      { inputs: prompt },
      {
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data[0].generated_text;
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
    
    const documentContent = await generateFromLLM(documentPrompt);
    
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
  
  return policies;
}

// Process the conflicts response into a structured format
function processConflicts(conflictsResponse) {
  // Split by numbered items or bullet points
  const conflicts = conflictsResponse
    .split(/\d+[\.\)]\s*|\n\s*-\s+/)
    .filter(item => item.trim().length > 0)
    .map(item => item.trim());
  
  return conflicts;
}

// Process legal document examples
function processLegalDocuments(legalDocumentsResponse) {
  // Look for document title patterns
  const documents = [];
  const documentSections = legalDocumentsResponse.split(/#{2,3}\s+|DOCUMENT\s+\d+:/i);
  
  for (const section of documentSections) {
    if (section.trim().length === 0) continue;
    
    // Try to extract title and content
    const lines = section.trim().split('\n');
    const title = lines[0].replace(/["""\*_]/g, '').trim();
    const content = lines.slice(1).join('\n').trim();
    
    if (title && content) {
      documents.push({ title, content });
    }
  }
  
  return documents;
}

module.exports = {
  processWorldConcept,
  generateDocument
};