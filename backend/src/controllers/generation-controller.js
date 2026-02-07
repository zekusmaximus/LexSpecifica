const llmService = require('../services/llm-service');

async function generateFramework(req, res) {
    try {
        const { worldConcept, parameters } = req.body;
        if (!worldConcept) {
            return res.status(400).json({ error: 'World concept is required' });
        }

        const text = await llmService.generateContent('legal-framework', worldConcept, parameters);
        res.json({ legalFramework: text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function generatePolicies(req, res) {
    try {
        const { worldConcept, parameters } = req.body;
        if (!worldConcept) {
            return res.status(400).json({ error: 'World concept is required' });
        }

        const text = await llmService.generateContent('policies', worldConcept, parameters);
        const policies = llmService.parsePolicies(text);

        // Fallback if parsing fails totally, sending raw text as one policy
        if (policies.length === 0) {
            res.json({ policies: [{ name: "Generated Policies", description: text }] });
        } else {
            res.json({ policies });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function generateConflicts(req, res) {
    try {
        const { worldConcept, parameters } = req.body;
        if (!worldConcept) {
            return res.status(400).json({ error: 'World concept is required' });
        }

        const text = await llmService.generateContent('conflicts', worldConcept, parameters);
        const conflicts = llmService.parseConflicts(text);
        res.json({ conflicts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    generateFramework,
    generatePolicies,
    generateConflicts
};
