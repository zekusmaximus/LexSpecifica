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

CREATE A DETAILED LEGAL FRAMEWORK OVERVIEW:

You are crafting the foundational legal system for a fictional world. Begin directly with an immersive description of this world's legal framework WITHOUT mentioning the parameters or prompt inputs.

Your response must:
- Provide a comprehensive, richly detailed description (600-800 words minimum) 
- Organize the content into clearly titled sections with at least 5-7 well-developed paragraphs
- Include specific terminology, institutions, and concepts unique to this world
- Maintain internal consistency throughout the legal system

Cover these essential elements in depth:
1. FUNDAMENTAL PRINCIPLES: The philosophical foundations, core values, and underlying assumptions of the legal system
2. LEGAL STRUCTURES: The hierarchies, institutions, or mechanisms through which law operates
3. LAWMAKING PROCESSES: How laws are created, amended, and repealed, and by which authorities
4. ENFORCEMENT MECHANISMS: The methods, technologies, and entities responsible for ensuring compliance
5. JUDICIAL SYSTEM: How disputes are resolved, trials conducted, and precedents established
6. RIGHTS & OBLIGATIONS: The fundamental rights, privileges, and duties of different classes of beings
7. UNIQUE LEGAL CONCEPTS: Special legal doctrines, procedures, or frameworks specific to this world

Your description should feel like an excerpt from a detailed worldbuilding guide or academic text about this fictional society. Use concrete examples to illustrate abstract concepts. Develop ideas fully with substantive explanations rather than brief mentions.

DO NOT USE PLACEHOLDER TEXT OR GENERIC DESCRIPTIONS. CREATE SPECIFIC, DISTINCTIVE LEGAL ELEMENTS THAT REFLECT THE UNIQUE NATURE OF THIS WORLD.

IMPORTANT: Begin immediately with the content. Do NOT start with phrases like "This legal framework for [world concept]..." or any other meta-references to the prompt.

FORMAT YOUR RESPONSE IN PLAIN TEXT WITH CLEAR PARAGRAPH BREAKS. Do not use any special formatting, numbering, or markdown.
`;
}

// Template for generating just the policies
function policiesTemplate(baseContext) {
  return `${baseContext}

CREATE 5 DETAILED AND UNIQUE POLICIES FOR THIS FICTIONAL WORLD:

You are crafting key laws or regulations that would exist in this fictional society. Each policy should be SPECIFIC to this world's unique characteristics and challenges.

For EACH policy provide:
1. A distinctive, creative POLICY NAME (4-8 words) that reflects the world's terminology and style
2. A DETAILED DESCRIPTION (3-5 sentences) explaining:
   - What the policy regulates or establishes
   - Why this policy exists in this society
   - How it is enforced
   - Who is most affected by it
   - Any interesting exceptions or special provisions

IMPORTANT REQUIREMENTS:
- Each policy must be directly related to the world concept
- Policies should cover different aspects of society (resources, rights, technology, governance, etc.)
- Use language, terminology, and concepts appropriate to the world's technology level
- Include at least one policy that creates interesting story possibilities or conflicts
- DO NOT use generic policy names or descriptions

FORMAT YOUR RESPONSE AS:
===POLICY 1===
NAME: [Distinctive Policy Name]
DESCRIPTION: [3-5 sentence detailed description specific to this world]

===POLICY 2===
NAME: [Distinctive Policy Name]
DESCRIPTION: [3-5 sentence detailed description specific to this world]

(Repeat for all 5 policies)

IMPORTANT: Ensure each policy has both a DISTINCTIVE NAME and DETAILED DESCRIPTION specific to this world.
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