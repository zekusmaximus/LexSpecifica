// prompt-templates.js - Optimized templates for Gemini 1.5-Flash

// Main function to construct prompts based on template type and parameters
function constructPrompt(templateType, parameters) {
  const {
    worldConcept,
    techLevel = 5,
    governmentType = 'unspecified',
    worldElements = [],
    citizenRights = []
    // You could add more parameters here in the future, e.g., tone, target audience
  } = parameters;

  // Base context for all prompts
    // Explicitly instruct the model to use the parameters
    const baseContext = `
  You are an expert in speculative legal systems for fiction writers, specifically focusing on worldbuilding details. Your task is to create content based on the following world concept and parameters.
  
  WORLD CONCEPT: "${worldConcept}"
  
  PARAMETERS TO INTEGRATE:
  - Technology Level: ${techLevel}/10 (1=primitive, 5=contemporary, 10=advanced)
  - Government Type: ${governmentType}
  ${worldElements.length > 0 ? `- Key World Elements: ${worldElements.join(', ')}` : ''}
  ${citizenRights.length > 0 ? `- Citizen Rights Focus: ${citizenRights.join(', ')}` : ''}
  
  GENERAL INSTRUCTIONS FOR ALL OUTPUTS:
  - Directly address the prompt's specific request for content.
  - Integrate the provided WORLD CONCEPT and PARAMETERS throughout your response.
  - Use terminology, concepts, and a tone appropriate for the specified Technology Level and Government Type.
  - Ensure internal consistency within the generated content.
  - Focus on creating details that inspire story ideas and narrative conflict.
  - Avoid generic or placeholder text.
  - Do NOT include any introductory phrases, conversational text, or meta-commentary about the prompt or your role. Begin immediately with the requested content formatted as specified.
  `;

  // Select the appropriate template based on the type
  switch (templateType) {
    case 'legal-framework':
  return legalFrameworkTemplate(baseContext, worldConcept);
    case 'policies':
      return policiesTemplate(baseContext, worldConcept);
    case 'conflicts':
      return conflictsTemplate(baseContext, worldConcept);
     // Add a case for 'all' if you have a combined template
     // case 'all':
     //   return allDocumentTemplate(baseContext);
    default:
      throw new Error(`Unknown template type: ${templateType}`);
  }
}

// Template for generating a more in-depth legal framework
function legalFrameworkTemplate(baseContext, worldConcept) {
  return `${baseContext}

TASK: CREATE A DETAILED LEGAL FRAMEWORK OVERVIEW FOR THE "${worldConcept}" WORLD.

Your response must provide a comprehensive, richly detailed description of this world's foundational legal system.

REQUIREMENTS:
- Provide substantive, well-developed content covering the legal framework. Aim for depth over brevity.
- Integrate the Technology Level, Government Type, and other parameters throughout the description.
- Organize the content into clear sections. Use simple, descriptive section titles followed by a colon on a new line.
- Include specific terminology, institutions, and concepts unique to this world.
- The description should feel like an excerpt from a detailed worldbuilding guide or academic text about this fictional society. Use concrete examples to illustrate abstract concepts.
- Cover the following essential elements in depth within your sections:
    1. FUNDAMENTAL PRINCIPLES: The philosophical foundations, core values, and underlying assumptions.
    2. LEGAL STRUCTURES: The hierarchies, institutions, or mechanisms through which law operates.
    3. LAWMAKING PROCESSES: How laws are created, amended, and repealed.
    4. ENFORCEMENT MECHANISMS: Methods, technologies, and entities responsible for compliance.
    5. JUDICIAL SYSTEM: How disputes are resolved and justice administered.
    6. RIGHTS & OBLIGATIONS: Fundamental rights, privileges, and duties of different beings/groups.
    7. UNIQUE LEGAL CONCEPTS: Special doctrines, procedures, or frameworks specific to this world.

FORMATTING:
- Use simple line breaks for paragraphs.
- Use a simple title for each section on its own line, followed by a colon (e.g., **Fundamental Principles:**). Do NOT use markdown headers (like ##) or numbering for sections.
- Ensure clear separation between sections.

IMPORTANT: Begin immediately with the first section title and content. Do NOT include any introductory sentences before the first section.
`;
}

// Template for generating just the policies
function policiesTemplate(baseContext, worldConcept) {
  return `${baseContext}

TASK: CREATE 5 DETAILED AND UNIQUE POLICIES FOR THE "${worldConcept}" WORLD.

You are crafting key laws or regulations that would specifically exist in this fictional society based on its concept and parameters.

REQUIREMENTS:
- Generate exactly 5 distinct policies.
- Each policy must be directly related to the world concept and integrate the provided parameters.
- Policies should cover different aspects of society (e.g., resources, rights, technology, governance, social norms).
- Include at least one policy that clearly creates interesting story possibilities or inherent conflicts based on the world's nature.
- Use language, terminology, and concepts appropriate to the world's Technology Level and Government Type.
- Avoid generic policy ideas or descriptions.

For EACH of the 5 policies, provide the following structure and content:

FORMAT FOR EACH POLICY:
===POLICY [Number]===
NAME: [A distinctive, creative Policy Name relevant to the world, 4-8 words]
DESCRIPTION: [A detailed paragraph (aim for 3-5 sentences) explaining:
- What the policy regulates/establishes.
- The primary reason or context for its existence in THIS society.
- How it is typically enforced or its main mechanism.
- Who is most significantly affected (e.g., a specific group, all citizens, etc.).
- Any interesting nuances, exceptions, or points of tension.]

IMPORTANT:
- Use the exact marker "===POLICY [Number]===" (e.g., "===POLICY 1===") for each policy block.
- Use the exact labels "NAME:" and "DESCRIPTION:".
- Provide substantive detail in the DESCRIPTION field specific to the world.
- Begin immediately with "===POLICY 1===" without any introductory text.
`;
}

// Template for generating just the conflicts
function conflictsTemplate(baseContext, worldConcept) {
  return `${baseContext}

TASK: CREATE 3 NARRATIVE CONFLICT SCENARIOS BASED ON THE LEGAL SYSTEM AND WORLD CONCEPT OF "${worldConcept}".

Generate specific conflict scenarios that highlight tensions, loopholes, or points of contention within the world's legal framework and society, providing clear story hooks.

REQUIREMENTS:
- Generate exactly 3 distinct conflict scenarios.
- Each scenario must be plausible within the context of the world concept and parameters.
- Focus on tensions that reveal interesting aspects of the legal system, laws, or societal structure.
- Briefly mention the key characters or groups involved and the central legal or societal issue driving the conflict.
- Ensure each conflict has potential for driving a narrative storyline.
- Integrate the world's parameters (Tech Level, Government Type, etc.) into the conflict's nature.

FORMAT FOR EACH CONFLICT:
CONFLICT [Number]: [A concise, narrative description of the conflict scenario. Aim for 50-70 words (2-4 sentences).]

IMPORTANT:
- Use the exact marker "CONFLICT [Number]:" (e.g., "CONFLICT 1:") for each conflict description.
- Provide specific, narrative detail for the scenario.
- Begin immediately with "CONFLICT 1:" without any introductory text.
`;
}

// Example of a potential 'all' template structure - YOU NEED TO CREATE THIS if you use generateDocument('all', ...)
/*
function allDocumentTemplate(baseContext) {
    // This template needs to instruct the model to generate ALL sections
    // using distinct markers that parseAllDocumentSections can find.
    // The current parser expects markers like ===== SECTION 1: LEGAL FRAMEWORK =====
    return `${baseContext}

TASK: GENERATE A COMPLETE DOCUMENT INCLUDING LEGAL FRAMEWORK, POLICIES, AND CONFLICTS FOR THE "${worldConcept}" WORLD.

Provide all sections in order, using the specified markers and internal formats.

===== SECTION 1: LEGAL FRAMEWORK =====

[Content following the legalFrameworkTemplate's internal formatting rules (Section Titles: and paragraph breaks)]

===== SECTION 2: POLICIES =====

[Content following the policiesTemplate's internal formatting rules (===POLICY X===, NAME:, DESCRIPTION:)]

===== SECTION 3: CONFLICTS =====

[Content following the conflictsTemplate's internal formatting rules (CONFLICT X:)]

IMPORTANT: Use the exact markers shown above to separate the sections. Begin immediately with the first marker.
`;
}
*/


module.exports = {
  constructPrompt
};