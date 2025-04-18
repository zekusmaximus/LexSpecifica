// llm-service.js
const { constructPrompt } = require('./prompt-templates');
const axios = require('axios');

// Get API key from environment variable with the CORRECT name
// You'll need a Google AI API key
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Google AI API endpoint for Gemini 1.5-Flash
// Using the global endpoint. You might use a regional one if needed.
const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

// Main function to call the Gemini model via Google AI API
async function callGeminiModel(prompt, parameters = {}) {
  try {
    console.log(`Calling Google AI API with prompt length: ${prompt.length} characters`);

    if (!GOOGLE_API_KEY) {
      console.error('GOOGLE_API_KEY environment variable is not set!');
      throw new Error('Google AI API key not configured. Get one from https://makersuite.google.com/ and set the environment variable.');
    }

    // Default generation parameters for Gemini
    const defaultGenerationConfig = {
      maxOutputTokens: 1500, // Corresponds to max_new_tokens
      temperature: 0.7,
      topP: 0.9, // Corresponds to top_p
      // topK: 40 // You could add topK if desired
    };

    // Merge default parameters with any overrides passed in
    const generationConfig = { ...defaultGenerationConfig, ...parameters };

    // Configuration for Google AI API
    const response = await axios.post(
      API_ENDPOINT + `?key=${GOOGLE_API_KEY}`, // Pass API key as query parameter
      {
        contents: [ // Request body format for generateContent
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: generationConfig, // Include generation parameters
        // safetySettings: [ // Optional: Configure safety settings if needed
        //   {
        //     category: 'HARM_CATEGORY_HARASSMENT',
        //     threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        //   },
        //   // ... add other categories
        // ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          // No 'Authorization' header needed for simple API key in query parameter
        },
      }
    );

    console.log('Google AI API response received');

    // Handle the Google AI API specific response format
    // The text is typically in response.data.candidates[0].content.parts[0].text
    let responseText;
    if (response.data && response.data.candidates && response.data.candidates.length > 0 &&
        response.data.candidates[0].content && response.data.candidates[0].content.parts &&
        response.data.candidates[0].content.parts.length > 0 && response.data.candidates[0].content.parts[0].text) {
      responseText = response.data.candidates[0].content.parts[0].text;
    } else {
      console.error('Unexpected Google AI API response format:', JSON.stringify(response.data, null, 2));
      // Check if the model blocked the content
      if (response.data && response.data.promptFeedback && response.data.promptFeedback.blockReason) {
         throw new Error(`Prompt blocked by safety settings: ${response.data.promptFeedback.blockReason}`);
      }
      throw new Error('Unexpected Google AI API response format or empty response');
    }

    return { text: responseText };
  } catch (error) {
    console.error('Error calling Gemini model via Google AI API:', error.response?.data || error.message);

    // Provide more specific error messages if possible
     if (error.response?.status === 400) {
       throw new Error(`Bad request to Google AI API: ${error.response.data?.error?.message || error.message}`);
     } else if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error(`Google AI API authentication or permission error. Check your GOOGLE_API_KEY and project permissions. ${error.response.data?.error?.message || error.message}`);
     } else if (error.response?.status === 429) {
        throw new Error(`Google AI API rate limit exceeded. Slow down your requests. ${error.response.data?.error?.message || error.message}`);
     } else if (error.response?.status >= 500) {
        throw new Error(`Google AI API server error: ${error.response.data?.error?.message || error.message}`);
     }


    throw new Error(`Failed to get response from LLM: ${error.message}`);
  }
}

// The helper functions (generateLegalFramework, generatePolicies, generateConflicts, generateDocument)
// now need to call the new function, callGeminiModel, instead of callMixtralModel.
// The prompt construction logic remains the same, as that's handled by constructPrompt.

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

    // Call the LLM with the prompt (using the new function)
    const response = await callGeminiModel(prompt, {
        maxOutputTokens: 1500, // Example: set max tokens for this specific call
        temperature: 0.7
        // Include other Gemini-specific parameters here if needed
    });

    // Check if the response is just empty or filled with newlines
    const cleanText = response.text.replace(/\n/g, '').trim();
    if (!cleanText) {
      console.log('Received empty framework response, returning fallback');
      return {
        legalFramework: "The framework generator was unable to create a response. This might be due to temporary issues with the language model. Please try again or modify your world concept."
      };
    }

    // Return the results
    return { legalFramework: response.text.trim() };
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

    // Call the LLM with the prompt (using the new function)
     const response = await callGeminiModel(prompt, {
        maxOutputTokens: 1500,
        temperature: 0.8 // Example: slightly higher temperature for more creative policies
        // Include other Gemini-specific parameters here if needed
    });

    // Check if the response is just empty or filled with newlines
    const cleanText = response.text.replace(/\n/g, '').trim();
    if (!cleanText) {
      console.log('Received empty policies response, returning fallback');
      return {
        policies: [
          {
            name: "Policy Generation Failed",
            description: "The system was unable to generate policies based on your world concept. Please try again or provide more details about your world's social structures, resources, or governance."
          }
        ]
      };
    }

    // Parse the policies from the response
    try {
      const policies = parsePoliciesFromText(response.text);

      // If no policies were found or parsing failed, return a fallback
      if (!policies || policies.length === 0) {
        throw new Error("No policies found in response");
      }

      // Return the results
      return { policies };
    } catch (parsingError) {
      console.error('Error parsing policies:', parsingError);
      // Return raw text as a single policy if parsing fails
      return {
        policies: [
          {
            name: "Raw Policy Data",
            description: response.text.trim()
          }
        ]
      };
    }
  } catch (error) {
    console.error('Error generating policies:', error);
    // Return a fallback instead of throwing - prevents 500 error
    return {
      policies: [
        {
          name: "Error Generating Policies",
          description: "The system encountered an error while generating policies. Please try again with a more detailed world description or different government type."
        }
      ]
    };
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

    // Call the LLM with the prompt (using the new function)
     const response = await callGeminiModel(prompt, {
        maxOutputTokens: 1500,
        temperature: 0.9 // Example: higher temperature for more varied conflicts
        // Include other Gemini-specific parameters here if needed
    });


    // Check if the response is just empty or filled with newlines
    const cleanText = response.text.replace(/\n/g, '').trim();
    if (!cleanText) {
      console.log('Received empty conflicts response, returning fallback');
      return {
        conflicts: [
          "The model was unable to generate conflicts. Please try again or modify your world concept.",
          "Consider making your world description more detailed or specifying more about the society's values and tensions.",
          "You can also try manually describing potential conflicts based on the generated legal framework."
        ]
      };
    }

    // Parse the conflicts from the response
    try {
      const conflicts = parseConflictsFromText(response.text);

      // Return the results
      return { conflicts };
    } catch (parsingError) {
      console.error('Error parsing conflicts:', parsingError);
      // Return raw text as a single conflict if parsing fails
      return {
        conflicts: [
          "CONFLICT 1: " + response.text.trim()
        ]
      };
    }
  } catch (error) {
    console.error('Error generating conflicts:', error);
    // Return a fallback instead of throwing - prevents 500 error
    return {
      conflicts: [
        "The system encountered an error while generating conflicts. Please try again.",
        "You might try providing more detail about your world's social tensions or power structures.",
        "Alternatively, consider creating conflicts manually based on the legal framework."
      ]
    };
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

    // Call the LLM with the prompt (using the new function)
     const response = await callGeminiModel(prompt, {
        maxOutputTokens: 2000, // Allow more tokens for a combined document
        temperature: 0.7
        // Include other Gemini-specific parameters here if needed
    });


    // Return the results based on type
    if (type === 'all') {
      // Parse the all-in-one response
      // NOTE: This parsing logic might need adjustment depending on how the 'all'
      // template is structured and how Gemini responds compared to Mixtral.
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
// This function's logic might need fine-tuning depending on how Gemini formats
// the policy output compared to how it was expected from Mixtral.
// Keep the existing logic for now, but be aware it might need adjustments.
function parsePoliciesFromText(text) {
  try {
    console.log('Parsing policies from text of length:', text.length);

    // Look for policy blocks - matches patterns like "===POLICY 1===" or "POLICY 1:" or just numbered policies
    // Adjust regex if Gemini uses different formatting patterns
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
          name = lines[0].replace(/^[^a-z0-9]*/i, '').trim(); // Clean up potential leading chars like numbers/dashes
          description = lines.slice(1).join('\n').trim();
        }
      }

       // Fallback if the first line is very short or doesn't look like a name
        if (!name || name.split(' ').length > 10) { // Heuristic: If "name" is too long, maybe it's just part of description
             const lines = description ? description.split('\n') : text.split('\n');
             name = lines[0].replace(/^[^a-z0-9]*/i, '').trim();
             description = lines.slice(1).join('\n').trim();
        }
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
    if (policies.length === 0 && text.trim().length > 0) { // Only consider it an error if there was *some* text
      console.error('Failed to extract policies from text. Raw text:', text);
      // Fallback: return the whole text as one policy description
       return [{ name: 'Generated Policies', description: text.trim() }];
    } else if (policies.length === 0 && text.trim().length === 0) {
         return []; // Return empty array if text was empty
    }


    return policies;
  } catch (error) {
    console.error('Error parsing policies:', error);
    // Return a fallback in case of parsing error
    return [{ name: 'Error parsing policies', description: 'The response format was unexpected: ' + error.message }];
  }
}

// Helper function to parse conflicts from text
// Similar to policies, this might need adjustment based on Gemini's output format.
// Keep the existing logic for now.
function parseConflictsFromText(text) {
    try {
        console.log('Parsing conflicts from text of length:', text.length);

        // Split the text into potential conflict items. Common separators are
        // newline followed by a number or bullet point, or just double newlines.
        // This regex looks for a number/bullet followed by potential text,
        // or just splits on double newlines if no list format is found.
        const conflictRegex = /^\s*[-*\d]+\s*(.*)$/gmi; // Matches lines starting with -, *, or number

        const conflicts = [];
        let match;
        let lastIndex = 0;

        while ((match = conflictRegex.exec(text)) !== null) {
            const conflictText = match[1].trim();
            if (conflictText) {
                conflicts.push(conflictText);
                lastIndex = conflictRegex.lastIndex;
            }
        }

         // If no list items were matched, try splitting by double newlines
        if (conflicts.length === 0) {
            const blocks = text.split(/\n\s*\n/).map(block => block.trim()).filter(block => block.length > 0);
             // Add simple numbering
            blocks.forEach((block, index) => {
                conflicts.push(`CONFLICT ${index + 1}: ${block}`);
            });
        } else {
             // If list items were matched, add any trailing text after the last list item
            const trailingText = text.substring(lastIndex).trim();
            if(trailingText){
                 conflicts.push(`ADDITIONAL NOTES: ${trailingText}`);
            }
        }


        console.log(`Extracted ${conflicts.length} conflicts`);

        // If still no conflicts and the text wasn't empty, return the raw text as one conflict
        if (conflicts.length === 0 && text.trim().length > 0) {
             console.error('Failed to extract conflicts from text. Raw text:', text);
             return ["Generated Conflicts: " + text.trim()];
        } else if (conflicts.length === 0 && text.trim().length === 0) {
            return []; // Return empty array if text was empty
        }


        return conflicts;
    } catch (error) {
        console.error('Error parsing conflicts:', error);
        // Return a fallback in case of parsing error
        return ["Error parsing conflicts: " + error.message];
    }
}


// Helper function to parse all document sections
// This is highly dependent on the 'all' template's expected format.
// You might need to significantly adjust this based on how Gemini formats
// multi-section output compared to Mixtral.
function parseAllDocumentSections(text) {
  try {
    console.log('Parsing complete document of length:', text.length);

     // Define markers you expect Gemini to use for sections based on your prompt template
     // Example markers:
     const frameworkMarker = "===== LEGAL FRAMEWORK =====";
     const policiesMarker = "===== POLICIES =====";
     const conflictsMarker = "===== CONFLICTS =====";

     let framework = '';
     let policies = [];
     let conflicts = [];

     const textLower = text.toLowerCase();

     // Find index of markers
     const frameworkIndex = textLower.indexOf(frameworkMarker.toLowerCase());
     const policiesIndex = textLower.indexOf(policiesMarker.toLowerCase());
     const conflictsIndex = textLower.indexOf(conflictsMarker.toLowerCase());


     // Extract sections based on markers
     // This logic assumes the sections appear in the order: Framework, Policies, Conflicts
     if (frameworkIndex !== -1) {
        let endIndex = policiesIndex !== -1 ? policiesIndex : (conflictsIndex !== -1 ? conflictsIndex : text.length);
        framework = text.substring(frameworkIndex + frameworkMarker.length, endIndex).trim();
     }

     if (policiesIndex !== -1) {
        let endIndex = conflictsIndex !== -1 ? conflictsIndex : text.length;
        const policiesText = text.substring(policiesIndex + policiesMarker.length, endIndex).trim();
        policies = parsePoliciesFromText(policiesText);
     }

     if (conflictsIndex !== -1) {
        const conflictsText = text.substring(conflictsIndex + conflictsMarker.length).trim();
        conflicts = parseConflictsFromText(conflictsText);
     }


    // Fallback if markers weren't found but there is text
    if (framework.length === 0 && policies.length === 0 && conflicts.length === 0 && text.trim().length > 0) {
         console.warn("Section markers not found. Attempting simple split.");
         // Simple split by large chunks or assume the entire text is one type of content
         // For a fallback, maybe return the whole text as the framework, or as raw content.
         // Returning the whole text as framework for simplicity in this fallback.
          framework = text.trim();
          policies = [{ name: "Could Not Parse Sections", description: "The document structure was unexpected. Full raw text provided in framework." }];
          conflicts = ["Could Not Parse Sections: See Framework for raw content."];
    }


    return {
      legalFramework: framework,
      policies,
      conflicts
    };
  } catch (error) {
    console.error('Error parsing complete document:', error);
    // Return a fallback with error message
    return {
      legalFramework: 'Error parsing document structure: ' + error.message + '. Raw text might be available in console logs.',
      policies: [{ name: "Parsing Error", description: error.message }],
      conflicts: ["Parsing Error: " + error.message]
    };
  }
}


module.exports = {
  generateLegalFramework,
  generatePolicies,
  generateConflicts,
  generateDocument
};