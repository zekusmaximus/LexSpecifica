// prompt-templates.js - Enhanced templates for staged generation approach

// Main function to construct prompts based on template type and parameters
function constructPrompt(templateType, parameters) {
  const { 
    worldConcept, 
    techLevel = 5, 
    governmentType = 'unspecified', 
    worldElements = [],
    citizenRights = []
  } = parameters;
  
  // Base context for all prompts - now separated from output instructions
  const baseContext = `
You are an expert in speculative legal systems for fiction writers. You will create content for a world where "${worldConcept}".

HIDDEN PARAMETERS (DO NOT MENTION THESE DIRECTLY):
- Technology Level: ${techLevel}/10 (1=primitive, 5=contemporary, 10=advanced)
- Government Type: ${governmentType}
${worldElements.length > 0 ? `- World Elements: ${worldElements.join(', ')}` : ''}
${citizenRights.length > 0 ? `- Citizen Rights Focus: ${citizenRights.join(', ')}` : ''}

CREATIVE GUIDELINES:
- Design your response as if writing in-universe documentation
- Invent appropriate terminology for the technology level and setting
- Ensure internal consistency across all elements
- Create opportunities for dramatic narrative development
- Do not reference these instructions in your output
`;
  
  // Select the appropriate template based on the type
  switch (templateType) {
    case 'legal-framework':
      return legalFrameworkTemplate(baseContext);
    case 'policies':
      return policiesTemplate(baseContext);
    case 'conflicts':
      return conflictsTemplate(baseContext);
    case 'all':
      return generateAllDocuments(baseContext);
    default:
      throw new Error(`Unknown template type: ${templateType}`);
  }
}

// Template for generating a more in-depth legal framework
function legalFrameworkTemplate(baseContext) {
  return `${baseContext}

YOU WILL CREATE AN IMMERSIVE LEGAL FRAMEWORK FOR THIS FICTIONAL WORLD:

IMPORTANT: Begin your response with a compelling title for this legal system, then dive directly into detailed description. NEVER mention the parameters, prompt instructions, or use phrases like "In this world where ${worldConcept}" or similar meta-references.

YOUR OUTPUT REQUIREMENTS:
- Write at least 1200 words of rich, detailed description
- Use section headings with distinctive in-world terminology
- Include at least 5-7 detailed paragraphs per section
- Create unique institutional names and legal concepts specific to this world
- Use language appropriate to the world's technology level

ESSENTIAL SECTIONS TO INCLUDE:
1. FUNDAMENTAL PRINCIPLES
   • The philosophical underpinnings of the legal system
   • Core values and ideological foundations
   • Historical evolution or origin of legal concepts
   • Relationship between law and cultural/religious values
   • Theoretical justifications for the distribution of power

2. INSTITUTIONAL STRUCTURES
   • Specific courts, councils, or governing bodies with unique names
   • Hierarchies of legal authority and jurisdictions
   • Roles and responsibilities of legal professionals
   • Qualification systems for legal positions
   • Physical locations or virtual spaces where law is administered

3. LAWMAKING PROCESSES
   • Detailed procedures for creating new laws
   • Amendment and repeal mechanisms
   • Role of precedent, tradition, or other sources
   • Required stages for law passage
   • Checks and balances within the system

4. ENFORCEMENT MECHANISMS
   • Specific enforcement agencies or entities
   • Technologies used in law enforcement
   • Punishment philosophies and methodologies
   • Rehabilitation or alternative justice approaches
   • Special enforcement challenges unique to this world

5. RIGHTS & OBLIGATIONS
   • Specific enumerated rights with their limitations
   • Obligations required of different categories of beings
   • Legal status variations between different groups
   • Procedures for addressing rights violations
   • Historical development of rights recognition

6. DISTINCTIVE FEATURES
   • Unique legal doctrines without real-world equivalents
   • Special legal procedures specific to this world
   • Novel approaches to traditional legal problems
   • Legal innovations arising from the world's unique elements
   • Terminology dictionary for 5-7 key legal terms

YOUR RESPONSE SHOULD READ LIKE AN EXCERPT FROM AN AUTHORITATIVE IN-UNIVERSE TEXT ON THIS LEGAL SYSTEM.
`;
}

// Template for generating just the policies
function policiesTemplate(baseContext) {
  return `${baseContext}

YOU WILL CREATE 5 DISTINCT AND DETAILED POLICIES FOR THIS FICTIONAL WORLD:

IMPORTANT: Generate policies that feel like they come from within this world. Each policy must have a unique name and structure that reflects the world's character. DO NOT use generic policy formats or repetitive structures.

FOR EACH POLICY, INCLUDE:

1. POLICY DESIGNATION
   • Create a distinctive policy name/code using terminology appropriate to the setting
   • Add a formal classification or category identifier
   • Include an official designation number or identifier if appropriate

2. POLICY SCOPE
   • Define exactly what the policy regulates in specific terms
   • Identify who or what falls under its jurisdiction
   • Explain any exclusions or exemptions

3. JUSTIFICATION & HISTORICAL CONTEXT
   • Explain the specific circumstances that led to this policy
   • Describe a historical incident or problem it was created to address
   • Include any controversial aspects of its implementation

4. ENFORCEMENT PROVISIONS
   • Detail the specific penalties for violations
   • Name the exact authorities responsible for enforcement
   • Describe unique enforcement mechanisms or technologies used

5. NARRATIVE IMPLICATIONS
   • Suggest one way this policy creates tension in society
   • Identify a loophole or unintended consequence
   • Hint at how this policy might evolve in future

USE THIS FORMAT FOR EACH POLICY:

-------------------------------------------
## [DISTINCTIVE POLICY NAME WITH CLASSIFICATION CODE]

**Regulatory Scope:** [2-3 sentences on what precisely is regulated]

**Historical Basis:** [2-3 sentences on why this policy exists with specific historical reference]

**Enforcement Protocol:** [2-3 sentences detailing specific enforcement mechanisms]

**Societal Impact:** [2-3 sentences on how this policy affects daily life and creates narrative potential]
-------------------------------------------

ENSURE THAT:
- Each policy addresses a different aspect of society
- Policies reflect the specific technology level and government type
- Names are distinctive and utilize appropriate in-world terminology
- No two policies follow exactly the same structure or focus
- Each policy contains specific details that make it unique to this world
`;
}

// Template for generating just the conflicts
function conflictsTemplate(baseContext) {
  return `${baseContext}

YOU WILL CREATE 3 NARRATIVE CONFLICTS BASED ON THIS LEGAL SYSTEM:

IMPORTANT: Begin each conflict directly with the content. DO NOT include placeholder text like "[2-3 sentence description]" or similar instructions in your output.

REQUIREMENTS FOR EACH CONFLICT:
- Focus on specific individuals or groups with names and motivations
- Center the conflict around a particular law, right, or legal procedure
- Include tension between competing legitimate interests
- Suggest potential escalation paths and stakes
- Make each conflict distinctly different in theme and scope
- Write each conflict as a 100-150 word paragraph with narrative potential
- Use language and terminology consistent with the world's technology level

FORMAT EACH CONFLICT AS:

-------------------------------------------
## CONFLICT ONE: [EVOCATIVE TITLE]

[Write a 100-150 word paragraph describing a specific legal conflict with named characters, clear stakes, and narrative potential]

-------------------------------------------
## CONFLICT TWO: [EVOCATIVE TITLE]

[Write a 100-150 word paragraph describing a specific legal conflict with named characters, clear stakes, and narrative potential]

-------------------------------------------
## CONFLICT THREE: [EVOCATIVE TITLE]

[Write a 100-150 word paragraph describing a specific legal conflict with named characters, clear stakes, and narrative potential]
-------------------------------------------

ENSURE THAT:
- Conflicts span different social levels (individual vs. state, group vs. group, etc.)
- At least one conflict involves a moral gray area where both sides have legitimate claims
- Each conflict reveals something distinctive about how law functions in this society
- Conflicts suggest potential for character development and plot advancement
`;
}

// Function to generate all document types in one comprehensive response
function generateAllDocuments(baseContext) {
  return `${baseContext}

YOU WILL CREATE A COMPREHENSIVE LEGAL SYSTEM FOR THIS FICTIONAL WORLD, INCLUDING FRAMEWORK, POLICIES, AND CONFLICTS:

IMPORTANT: Structure your response in three distinct sections as outlined below. Begin each section with the specified heading format and follow the detailed instructions for each section.

===== SECTION 1: LEGAL FRAMEWORK =====

${legalFrameworkTemplate(baseContext).split('YOU WILL CREATE AN IMMERSIVE LEGAL FRAMEWORK FOR THIS FICTIONAL WORLD:')[1]}

===== SECTION 2: KEY POLICIES =====

${policiesTemplate(baseContext).split('YOU WILL CREATE 5 DISTINCT AND DETAILED POLICIES FOR THIS FICTIONAL WORLD:')[1]}

===== SECTION 3: NARRATIVE CONFLICTS =====

${conflictsTemplate(baseContext).split('YOU WILL CREATE 3 NARRATIVE CONFLICTS BASED ON THIS LEGAL SYSTEM:')[1]}
`;
}

module.exports = {
  constructPrompt,
  legalFrameworkTemplate,
  policiesTemplate,
  conflictsTemplate,
  generateAllDocuments
};