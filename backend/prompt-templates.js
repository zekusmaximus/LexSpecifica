// prompt-templates.js - Enhanced templates for better content generation

// Main function to construct prompts based on template type and parameters
function constructPrompt(templateType, parameters) {
  const { 
    worldConcept, 
    techLevel = 5, 
    governmentType = 'unspecified', 
    detailLevel = 'medium', 
    worldElements = [],
    citizenRights = []
  } = parameters;
  
  // Determine detail multiplier based on requested detail level
  let detailMultiplier = 1;
  switch (detailLevel) {
    case 'brief': detailMultiplier = 0.7; break;
    case 'medium': detailMultiplier = 1; break;
    case 'comprehensive': detailMultiplier = 1.5; break;
    default: detailMultiplier = 1;
  }
  
  // Base context for all prompts with enhancements for better results
  const baseContext = `
You are an expert in speculative legal systems, governance structures, and policy development for fictional worlds. 
You're helping a fiction writer design realistic legal and policy frameworks for their fictional world.

WORLD CONCEPT: ${worldConcept}

TECHNOLOGY LEVEL (1-10): ${techLevel} (where 1 is primitive, 5 is contemporary, 10 is highly advanced)

GOVERNMENT TYPE: ${governmentType}

ADDITIONAL WORLD ELEMENTS: ${worldElements.join(', ')}

CITIZEN RIGHTS EMPHASIS: ${citizenRights.join(', ')}

Your task is to create legally coherent and narratively interesting content that:
1. Feels authentic within the logic of the fictional world
2. Shows deep understanding of how legal systems function
3. Creates opportunities for character conflict and plot development
4. Avoids legal anachronisms that don't fit the world concept
5. Balances creative speculation with legal realism

Guidelines for your response:
- Be creative and original but maintain internal consistency
- Use terminology that reflects the technology level and cultural context
- Develop ideas that could drive interesting narrative conflicts
- Consider power dynamics, resource allocation, and social tensions
- Incorporate any specified world elements in thoughtful ways
- Create a system that feels both authentic and unique
`;
  
  // Select the appropriate template based on the type
  switch (templateType) {
    case 'legal-framework':
      return legalFrameworkTemplate(baseContext, detailMultiplier, techLevel, governmentType);
    case 'policies':
      return policiesTemplate(baseContext, detailMultiplier, techLevel, governmentType);
    case 'conflicts':
      return conflictsTemplate(baseContext, detailMultiplier, techLevel, governmentType);
    case 'legal-documents':
      return legalDocumentsTemplate(baseContext, detailMultiplier, techLevel, governmentType);
    case 'document-constitution':
      return constitutionTemplate(baseContext, detailMultiplier, techLevel, governmentType);
    case 'document-court-case':
      return courtCaseTemplate(baseContext, detailMultiplier, techLevel, governmentType);
    case 'document-legislation':
      return legislationTemplate(baseContext, detailMultiplier, techLevel, governmentType);
    default:
      throw new Error(`Unknown template type: ${templateType}`);
  }
}

// Enhanced template for generating the legal framework
function legalFrameworkTemplate(baseContext, detailMultiplier, techLevel, governmentType) {
  // Tailor additional guidance based on tech level and government type
  let governanceGuidance = '';
  
  if (techLevel <= 3) {
    governanceGuidance = `
For this primitive technology level, consider:
- Oral traditions and custom as sources of law
- Religious or mystical elements in legal authority
- Simple enforcement mechanisms based on community pressure
- Limited record-keeping and emphasis on memory and ritual
`;
  } else if (techLevel <= 6) {
    governanceGuidance = `
For this contemporary technology level, consider:
- Formalized legal codes and procedures
- Bureaucratic institutions for law creation and enforcement
- Digital records and communication in legal processes
- Complex interactions between different legal authorities
`;
  } else {
    governanceGuidance = `
For this advanced technology level, consider:
- AI or algorithm-assisted legal decision making
- Novel enforcement techniques enabled by advanced surveillance or technology
- Integration of digital/virtual and physical legal jurisdictions
- How advanced technology might reshape fundamental legal concepts
`;
  }
  
  // Specific guidance based on government type
  let governmentTypeGuidance = '';
  
  switch (governmentType) {
    case 'democratic-republic':
      governmentTypeGuidance = `
For this democratic republic, emphasize:
- Separation of powers between branches of government
- Citizen participation in governance through voting and representation
- Individual rights and protections from government overreach
- Checks and balances within the system
`;
      break;
    case 'monarchy':
      governmentTypeGuidance = `
For this monarchy, emphasize:
- The role of the sovereign in creating, interpreting, and enforcing law
- Hereditary or divine right principles in legal authority
- The relationship between nobility and commoners in legal standing
- Traditional legitimacy and continuity in legal principles
`;
      break;
    case 'technocratic-council':
      governmentTypeGuidance = `
For this technocratic council, emphasize:
- Expertise and demonstrated knowledge as the basis for authority
- Meritocratic principles in legal standing and advancement
- Technical solutions to social problems
- Data-driven policy development and decision making
`;
      break;
    case 'corporate-federation':
      governmentTypeGuidance = `
For this corporate federation, emphasize:
- Market principles applied to citizenship and legal rights
- Contractual relationships as the foundation of law
- Corporate entities as legal and governing bodies
- Economic efficiency as a legal value
`;
      break;
    case 'magical-conclave':
      governmentTypeGuidance = `
For this magical conclave, emphasize:
- Magical ability as a determinant of legal standing
- Regulation of magical practices and resources
- Protection of non-magical individuals
- Integration of magical principles into legal frameworks
`;
      break;
  }

  return `${baseContext}
${governanceGuidance}
${governmentTypeGuidance}

You will now create a detailed description of the legal and governance framework for this fictional world.
Your response should include:

1. The fundamental structure of the legal system (e.g., common law, civil law, religious law, AI-guided law, etc.)
2. How laws are created, enforced, and adjudicated
3. The basic rights and obligations of citizens/inhabitants
4. The relationship between different branches of government or power centers
5. How the legal system reflects the unique aspects of this world

Be creative but realistic within the constraints of the world concept. The description should be coherent, 
thought-provoking, and useful for a fiction writer developing their world.

Format your response as a cohesive narrative overview of the legal system, with paragraph breaks for readability.
Do not use numbered lists in your response - instead provide a flowing explanation of how the system works.
Focus on creating a unique, internally consistent legal framework that reflects the technology level and social
structures implied by the world concept.

Your description should be ${Math.round(500 * detailMultiplier)} words in length.
`;
}

// Enhanced template for generating policies
function policiesTemplate(baseContext, detailMultiplier, techLevel, governmentType) {
  return `${baseContext}

You will now create a list of 5 key policies or laws that would exist in this fictional world.
These should be specific, unique to the world concept, and address the major social, technological,
or otherworldly challenges this society would face.

For each policy:
1. Provide a plausible, engaging name for the policy/law that reflects the world's unique terminology and style
2. Focus on policy areas that would generate interesting conflicts or story opportunities
3. Consider what social tensions the policy might create or resolve
4. Think about how the policy reflects the values and priorities of this society

The policies should cover diverse aspects of society, potentially including:
- Resource management and allocation
- Rights and privileges of different social groups
- Technology or magic regulation
- Criminal justice and conflict resolution
- Education, information, or knowledge control
- Environment, territory, or spatial governance
- Health, body, or biological regulation

Be creative but logical. These policies should feel like a natural extension of the world concept
and technology level, while also being specific enough to generate narrative tension.

Format your response as a list of 5 distinct policy names, each with a brief (${Math.round(30 * detailMultiplier)} words) 
explanation of what the policy entails and why it exists in this society.
`;
}

// Enhanced template for generating conflicts
function conflictsTemplate(baseContext, detailMultiplier, techLevel, governmentType) {
  return `${baseContext}

You will now create a list of 5 potential legal conflicts, controversies, or edge cases that could
arise in this fictional world. These should provide interesting plot points or narrative tension
for a fiction writer.

For each conflict:
1. Describe a specific scenario where the laws or policies of this world create tension
2. Identify the competing interests or rights at stake
3. Explain how this could develop into an interesting story element
4. Focus on conflicts that challenge assumptions or create ethical dilemmas

The conflicts should be:
- Unique to this world's legal system and societal structure
- Challenging to fundamental assumptions of the society
- Creating moral or ethical dilemmas for characters
- Highlighting unintended consequences of the world's laws or policies
- Capable of driving compelling storylines with no easy solutions

The most interesting conflicts often arise at the intersections of:
- Different social classes or groups with unequal power
- Competing legitimate interests that can't be easily reconciled
- Traditional practices versus new developments
- Individual rights versus collective welfare
- Stated ideals versus practical realities

Format your response as 5 distinct conflict scenarios, each written as a paragraph of ${Math.round(80 * detailMultiplier)} words.
Make each conflict concrete and specific, not abstract or general.
Avoid using numbered lists or bullet points in your response.
`;
}

// Enhanced template for generating legal document examples
function legalDocumentsTemplate(baseContext, detailMultiplier, techLevel, governmentType) {
  return `${baseContext}

You will now create a Foundation Charter or similar foundational legal document for this fictional world.
This should establish the core principles, rights, and governmental structure that define the legal system.

Your Foundation Charter should include:
1. A preamble that establishes the document's purpose and the society's core values
2. Clear articulation of the fundamental principles governing this society
3. Delineation of powers and authorities within the system
4. Rights and responsibilities of citizens/inhabitants
5. Special considerations unique to this world's particular challenges or features

When writing this document:
- Use language and terminology appropriate to the world's technology level and culture
- Include specific references to unique elements of the world concept
- Create a document that feels authentic to the setting while being recognizable as a legal text
- Focus on elements that could drive interesting narrative conflicts

Format your response as a formal legal document with appropriate sections and articles.
The document should be approximately ${Math.round(300 * detailMultiplier)} words in length.
Title the document "FOUNDATION CHARTER" followed by a subtitle appropriate to the world.
`;
}

// Enhanced template for generating a constitutional document
function constitutionTemplate(baseContext, detailMultiplier, techLevel, governmentType) {
  return `${baseContext}

You will now create an excerpt from the constitution or founding document of this fictional world.
This should establish the fundamental principles, rights, and governmental structure that form the
legal foundation of this society.

Your constitutional excerpt should include:
1. A preamble or introduction stating the document's purpose and foundational values
2. Several articles covering key aspects such as:
   - Distribution of governmental powers
   - Rights of citizens or inhabitants
   - Central institutions and their authorities
   - Amendment processes
3. Language that reflects the world's history, values, and unique attributes
4. Carefully considered terminology appropriate to the technology level and social structures

Format your response as a formal constitutional document with appropriate sections, articles, and clauses.
Focus on creating a document that feels authentic to the world concept while providing interesting
legal foundations that could generate stories or conflicts.

The document should be approximately ${Math.round(400 * detailMultiplier)} words in length.
`;
}

// Enhanced template for generating a court case
function courtCaseTemplate(baseContext, detailMultiplier, techLevel, governmentType) {
  return `${baseContext}

You will now create an excerpt from a court ruling or legal case in this fictional world.
This should showcase how the legal system handles disputes, interprets laws, and establishes precedents.

Your court case excerpt should include:
1. A case title or reference number in the style appropriate to this world
2. A brief summary of the facts or background of the case
3. The legal questions at issue
4. The court's reasoning and decision
5. Any dissenting opinions or controversial aspects of the ruling
6. References to legal principles, precedents, or statutes specific to this world

Choose a case that would:
- Establish an important precedent in this legal system
- Highlight the unique aspects of this world's legal framework
- Create narrative opportunities through its implications
- Reflect the values and tensions in this society

Format your response as a formal legal document with appropriate sections for facts, legal analysis, and conclusions.
Create a case that highlights interesting tensions in the legal system and could serve as a plot point or
background element in a story set in this world.

The document should be approximately ${Math.round(300 * detailMultiplier)} words in length.
`;
}

// Enhanced template for generating legislation
function legislationTemplate(baseContext, detailMultiplier, techLevel, governmentType) {
  return `${baseContext}

You will now create an excerpt from a piece of legislation or statute in this fictional world.
This should demonstrate how laws are codified and structured in this society.

Your legislation excerpt should include:
1. A title or designation for the law
2. The purpose or scope of the legislation
3. Definitions of key terms specific to this world
4. Several substantive provisions that establish rights, obligations, or prohibitions
5. Enforcement mechanisms or penalties for violations
6. Any special circumstances, exceptions, or limitations

The legislation should address a challenge or issue unique to this fictional world, such as:
- Regulation of a world-specific resource or technology
- Management of relationships between different groups or classes
- Control of activities that could threaten social order
- Protection of vulnerable individuals or groups
- Response to a specific crisis or development

Format your response as a formal legal document with appropriate sections, articles, or clauses.
Use terminology and structures that reflect the world's technology level and cultural context.

The document should be approximately ${Math.round(300 * detailMultiplier)} words in length.
`;
}

module.exports = {
  constructPrompt
};