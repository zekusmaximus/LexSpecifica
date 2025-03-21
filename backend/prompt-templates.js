// prompt-templates.js - Updated templates for staged generation approach

// Main function to construct prompts based on template type and parameters
function constructPrompt(templateType, parameters) {
  const { 
    worldConcept, 
    techLevel = 5, 
    governmentType = 'unspecified', 
    worldElements = [],
    citizenRights = []
  } = parameters;
  
  // Base context for all prompts
  const baseContext = `
You are an expert in speculative legal systems for fiction writers. Create focused content for "${worldConcept}".

PARAMETERS:
- Technology Level: ${techLevel}/10 (1=primitive, 5=contemporary, 10=advanced)
- Government Type: ${governmentType}
${worldElements.length > 0 ? `- World Elements: ${worldElements.join(', ')}` : ''}
${citizenRights.length > 0 ? `- Citizen Rights Focus: ${citizenRights.join(', ')}` : ''}

GUIDELINES:
- Be creative but internally consistent
- Use appropriate terminology for the technology level
- Keep responses focused and concise
- Create opportunities for narrative development
`;
  
  // Select the appropriate template based on the type
  switch (templateType) {
    case 'legal-framework':
      return legalFrameworkTemplate(baseContext);
    case 'policies':
      return policiesTemplate(baseContext);
    case 'conflicts':
      return conflictsTemplate(baseContext);
    default:
      throw new Error(`Unknown template type: ${templateType}`);
  }
}

// Template for generating a more in-depth legal framework
function legalFrameworkTemplate(baseContext) {
  return `${baseContext}

CREATE A COMPREHENSIVE LEGAL FRAMEWORK OVERVIEW:
- Describe the legal system of this world in 300-400 words
- Include these key aspects:
  * The fundamental structure of the legal system 
  * How laws are created, enforced, and adjudicated
  * Rights and obligations of citizens/inhabitants
  * Relationship between branches of power
  * Unique legal concepts specific to this world
- Format as 3-5 clear paragraphs with logical structure
- Use terminology appropriate to the world's technology level and culture

YOUR RESPONSE SHOULD BE WELL-STRUCTURED AND FOCUS ON CREATING A FOUNDATION FOR STORYTELLING.
`;
}

// Template for generating just the policies
function policiesTemplate(baseContext) {
  return `${baseContext}

CREATE EXACTLY 5 KEY POLICIES FOR THIS WORLD:
- Each policy should have a distinctive name (3-7 words) 
- Include a ONE-SENTENCE description explaining each policy's purpose
- Cover different aspects of society (resources, rights, technology, etc.)
- Make policies specific to this world's unique characteristics

FORMAT YOUR RESPONSE AS:
1. [POLICY NAME]: [One-sentence explanation]
2. [POLICY NAME]: [One-sentence explanation]
3. [POLICY NAME]: [One-sentence explanation]
4. [POLICY NAME]: [One-sentence explanation]
5. [POLICY NAME]: [One-sentence explanation]

ENSURE EACH POLICY HAS BOTH A NAME AND EXPLANATION.
`;
}

// Template for generating just the conflicts
function conflictsTemplate(baseContext) {
  return `${baseContext}

CREATE 3 NARRATIVE CONFLICTS BASED ON THIS LEGAL SYSTEM:
- Each conflict should be a specific scenario that could drive a storyline
- Make each conflict 2-3 sentences long (50-70 words)
- Focus on tensions that reveal interesting aspects of the legal system
- Include the key characters/groups involved and the central legal issue
- Each conflict should have plot potential for a fiction writer

FORMAT YOUR RESPONSE AS:
CONFLICT 1: [2-3 sentence description of a specific legal conflict]

CONFLICT 2: [2-3 sentence description of a specific legal conflict]

CONFLICT 3: [2-3 sentence description of a specific legal conflict]

MAKE EACH CONFLICT DISTINCT AND NARRATIVE-FOCUSED.
`;
}

module.exports = {
  constructPrompt
};