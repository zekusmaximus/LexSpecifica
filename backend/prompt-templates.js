// prompt-templates.js - Templates for constructing prompts for different LLM tasks

// Main function to construct prompts based on template type and parameters
function constructPrompt(templateType, parameters) {
    const { 
      worldConcept, 
      techLevel, 
      governmentType, 
      detailLevel, 
      worldElements = [],
      citizenRights = []
    } = parameters;
    
    // Base context for all prompts
    const baseContext = `
  You are an expert in speculative legal systems, governance structures, and policy development for fictional worlds. 
  You're helping a fiction writer design realistic legal and policy frameworks for their fictional world.
  
  WORLD CONCEPT: ${worldConcept}
  
  TECHNOLOGY LEVEL (1-10): ${techLevel} (where 1 is primitive, 5 is contemporary, 10 is highly advanced)
  
  GOVERNMENT TYPE: ${governmentType || "Not specified"}
  
  ADDITIONAL WORLD ELEMENTS: ${worldElements.join(', ')}
  
  CITIZEN RIGHTS EMPHASIS: ${citizenRights.join(', ')}
  
  Your task is to create legally coherent and narratively interesting content that:
  1. Feels authentic within the logic of the fictional world
  2. Shows deep understanding of how legal systems function
  3. Creates opportunities for character conflict and plot development
  4. Avoids legal anachronisms that don't fit the world concept
  5. Balances creative speculation with legal realism
  `;
    
    // Select the appropriate template based on the type
    switch (templateType) {
      case 'legal-framework':
        return legalFrameworkTemplate(baseContext, detailLevel);
      case 'policies':
        return policiesTemplate(baseContext, detailLevel);
      case 'conflicts':
        return conflictsTemplate(baseContext, detailLevel);
      case 'legal-documents':
        return legalDocumentsTemplate(baseContext, detailLevel);
      case 'document-constitution':
        return constitutionTemplate(baseContext, detailLevel);
      case 'document-court-case':
        return courtCaseTemplate(baseContext, detailLevel);
      case 'document-legislation':
        return legislationTemplate(baseContext, detailLevel);
      default:
        throw new Error(`Unknown template type: ${templateType}`);
    }
  }
  
  // Template for generating the legal framework
  function legalFrameworkTemplate(baseContext, detailLevel) {
    return `${baseContext}
  
  You will now create a detailed description of the legal and governance framework for this fictional world.
  Your response should include:
  
  1. The fundamental structure of the legal system (e.g., common law, civil law, religious law, AI-guided law, etc.)
  2. How laws are created, enforced, and adjudicated
  3. The basic rights and obligations of citizens/inhabitants
  4. The relationship between different branches of government or power centers
  5. How the legal system reflects the unique aspects of this world
  
  Be creative but realistic within the constraints of the world concept. The description should be coherent, 
  thought-provoking, and useful for a fiction writer developing their world.
  
  DETAIL LEVEL: ${detailLevel} (provide a ${detailLevel}-length description)
  
  Format your response as a cohesive narrative overview of the legal system, with paragraph breaks for readability.
  Do not use numbered lists in your response - instead provide a flowing explanation of how the system works.
  Focus on creating a unique, internally consistent legal framework that reflects the technology level and social
  structures implied by the world concept.
  `;
  }
  
  // Template for generating policies
  function policiesTemplate(baseContext, detailLevel) {
    return `${baseContext}
  
  You will now create a list of 5 key policies or laws that would exist in this fictional world.
  These should be specific, unique to the world concept, and address the major social, technological,
  or otherworldly challenges this society would face.
  
  For each policy:
  1. Provide a plausible name for the policy/law (e.g., "Neural Network Rights Act" or "Arcane Materials Control Statute")
  2. Focus on policy areas that would generate interesting conflicts or story opportunities
  3. Consider what social tensions the policy might create or resolve
  4. Think about how the policy reflects the values and priorities of this society
  
  Be creative but logical. These policies should feel like a natural extension of the world concept
  and technology level.
  
  DETAIL LEVEL: ${detailLevel} (provide ${detailLevel} detail for each policy)
  
  Format your response as a numbered list, with 5 distinct policy names. Do not include descriptions of the policies - 
  just provide compelling, realistic policy titles that a fiction writer could expand upon.
  `;
  }
  
  // Template for generating conflicts
  function conflictsTemplate(baseContext, detailLevel) {
    return `${baseContext}
  
  You will now create a list of 5 potential legal conflicts, controversies, or edge cases that could
  arise in this fictional world. These should provide interesting plot points or narrative tension
  for a fiction writer.
  
  For each conflict:
  1. Describe a specific scenario where the laws or policies of this world create tension
  2. Identify the competing interests or rights at stake
  3. Explain how this could develop into an interesting story element
  4. Focus on conflicts that challenge assumptions or create ethical dilemmas
  
  Focus on conflicts that:
  - Are unique to this world's legal system
  - Challenge fundamental assumptions of the society
  - Create moral or ethical dilemmas for characters
  - Highlight unintended consequences of the world's laws or policies
  - Could drive compelling storylines
  
  DETAIL LEVEL: ${detailLevel} (provide ${detailLevel} detail for each conflict)
  
  Format your response as 5 distinct conflict scenarios, each written as a paragraph. 
  Avoid using numbered lists or bullet points in your response.
  `;
  }
  
  // Template for generating legal document examples
  function legalDocumentsTemplate(baseContext, detailLevel) {
    return `${baseContext}
  
  You will now create 1-2 brief excerpts from legal documents that might exist in this fictional world.
  These should showcase the style, terminology, and unique aspects of the legal system you've envisioned.
  
  Choose from among these document types:
  - Constitutional text or founding document
  - Legislation or statute
  - Court ruling or legal precedent
  - Executive order or proclamation
  - Legal contract or agreement
  - Regulatory code
  
  For each document excerpt:
  1. Create a title or heading that indicates what the document is
  2. Write a brief excerpt (3-10 sentences) that demonstrates the legal language and concepts
  3. Include terminology specific to this fictional world
  4. Ensure the document reflects the technology level and social structures
  
  DETAIL LEVEL: ${detailLevel} (provide ${detailLevel} detail for each document)
  
  Format each document with a clear heading followed by the excerpt. Make these documents feel authentic 
  to the world concept while still recognizable as legal texts in structure and formality.
  `;
  }
  
  // Template for generating a constitutional document
  function constitutionTemplate(baseContext, detailLevel) {
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
  
  DETAIL LEVEL: ${detailLevel} (provide a ${detailLevel}-length document)
  
  Format your response as a formal constitutional document with appropriate sections, articles, and clauses.
  Focus on creating a document that feels authentic to the world concept while providing interesting
  legal foundations that could generate stories or conflicts.
  `;
  }
  
  // Template for generating a court case
  function courtCaseTemplate(baseContext, detailLevel) {
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
  
  DETAIL LEVEL: ${detailLevel} (provide a ${detailLevel}-length document)
  
  Format your response as a formal legal document with appropriate sections for facts, legal analysis, and conclusions.
  Create a case that highlights interesting tensions in the legal system and could serve as a plot point or
  background element in a story set in this world.
  `;
  }
  
  // Template for generating legislation
  function legislationTemplate(baseContext, detailLevel) {
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
  
  DETAIL LEVEL: ${detailLevel} (provide a ${detailLevel}-length document)
  
  Format your response as a formal legal document with appropriate sections, articles, or clauses.
  Create legislation that addresses a challenge or issue unique to this fictional world, using
  terminology and concepts that fit the technology level and social structures.
  `;
  }
  
  module.exports = {
    constructPrompt
  };