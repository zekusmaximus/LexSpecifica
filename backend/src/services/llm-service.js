const { GoogleGenerativeAI } = require("@google/generative-ai");
const { constructPrompt } = require('../../prompt-templates');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function generateContent(type, worldConcept, parameters = {}) {
    try {
        const prompt = constructPrompt(type, {
            worldConcept,
            ...parameters
        });

        console.log(`Generating ${type} with prompt length: ${prompt.length}`);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error(`Error generating content (${type}):`, error);
        throw new Error(`Failed to generate content: ${error.message}`);
    }
}

// Parsing helpers (keeping logic similar to original but refined)
function parsePolicies(text) {
    // Simple robust parser looking for "NAME:" and "DESCRIPTION:"
    const policyRegex = /NAME:\s*(.*?)\n\s*DESCRIPTION:\s*([\s\S]*?)(?=(===POLICY|NAME:|$))/g;
    const policies = [];
    let match;

    while ((match = policyRegex.exec(text)) !== null) {
        policies.push({
            name: match[1].trim(),
            description: match[2].trim()
        });
    }

    // Fallback if regex fails but text exists (maybe structured differently)
    if (policies.length === 0 && text.length > 50) {
        return [{ name: "Generated Policy", description: text }];
    }

    return policies;
}

function parseConflicts(text) {
    const conflictRegex = /CONFLICT\s*\d+\s*:\s*([\s\S]*?)(?=(CONFLICT\s*\d+:|$))/gi;
    const conflicts = [];
    let match;

    while ((match = conflictRegex.exec(text)) !== null) {
        conflicts.push(match[1].trim());
    }

    // Fallback
    if (conflicts.length === 0 && text.length > 20) {
        // Split by newlines if it looks like a list
        const lines = text.split('\n').filter(l => l.trim().length > 10);
        return lines.length > 0 ? lines : [text];
    }

    return conflicts;
}

module.exports = {
    generateContent,
    parsePolicies,
    parseConflicts
};
