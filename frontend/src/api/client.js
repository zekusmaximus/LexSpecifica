const API_BASE_URL = '/api/generate';

/**
 * Helper to handle fetch responses
 */
async function handleResponse(response) {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error ${response.status}`);
    }
    return response.json();
}

/**
 * Generate Legal Framework
 */
export async function generateFramework(worldConcept, parameters) {
    const response = await fetch(`${API_BASE_URL}/framework`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ worldConcept, parameters }),
    });
    return handleResponse(response);
}

/**
 * Generate Policies
 */
export async function generatePolicies(worldConcept, parameters) {
    const response = await fetch(`${API_BASE_URL}/policies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ worldConcept, parameters }),
    });
    return handleResponse(response);
}

/**
 * Generate Conflicts
 */
export async function generateConflicts(worldConcept, parameters) {
    const response = await fetch(`${API_BASE_URL}/conflicts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ worldConcept, parameters }),
    });
    return handleResponse(response);
}
