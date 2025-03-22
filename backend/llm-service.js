// llm-service.js
const { constructPrompt } = require('./prompt-templates');
const axios = require('axios'); // or whatever library you're using to make API requests to Mixtral

// Main function to call the Mixtral model with a prompt
async function callMixtralModel(prompt) {
  try {
    // This will depend on how you're accessing Mixtral
    // Example using axios to call an API endpoint:
    const response = await axios.post('YOUR_MIXTRAL_API_ENDPOINT', {
      prompt: prompt,
      max_tokens: 1500, // Adjust based on your needs
      temperature: 0.7,  // Adjust based on your needs
      // Add any other parameters required by your Mixtral API
    });

    // Return the text response
    return { text: response.data.choices[0].text };
  } catch (error) {
    console.error('Error calling Mixtral model:', error);
    throw new Error(`Failed to get response from LLM: ${error.message}`);
  }
}

// Function to generate legal framework
async function generateLegalFramework(worldConcept, techLevel, governmentType) {
  try {
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
async function generatePolicies(worldConcept, techLevel, governmentType) {
  try {
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
async function generateConflicts(worldConcept, techLevel, governmentType) {
  try {
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

// Helper function to parse policies from text
function parsePoliciesFromText(text) {
  try {
    // Split by policy delimiter and filter out empty sections
    const policyBlocks = text.split('-------------------------------------------')
      .filter(block => block.trim().length > 0);
    
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
    return [{ name: 'Error parsing policies', description: 'The response format was unexpected.' }];
  }
}

// Helper function to parse conflicts from text
function parseConflictsFromText(text) {
  try {
    // Split by conflict delimiter and filter out empty sections
    const conflictBlocks = text.split('-------------------------------------------')
      .filter(block => block.trim().length > 0);
    
    return conflictBlocks.map(block => {
      // Remove the title line and return just the conflict paragraph
      const cleanedText = block.replace(/## CONFLICT .*?: .*/i, '').trim();
      return cleanedText;
    });
  } catch (error) {
    console.error('Error parsing conflicts:', error);
    // Return a fallback in case of parsing error
    return ['Error parsing conflicts. The response format was unexpected.'];
  }
}

module.exports = {
  generateLegalFramework,
  generatePolicies,
  generateConflicts
};