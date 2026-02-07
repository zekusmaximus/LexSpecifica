import React from 'react';

const InputForm = ({
    worldConcept,
    setWorldConcept,
    techLevel,
    setTechLevel,
    governmentType,
    setGovernmentType,
    onSubmit,
    isGenerating
}) => {
    return (
        <>
            <div style={{ marginTop: '20px' }}>
                <label>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>World Concept:</span>
                        <span style={{ fontSize: '14px', color: '#666' }}>{worldConcept.length}/1000 characters</span>
                    </div>
                    <textarea
                        style={{
                            width: '100%',
                            padding: '12px',
                            marginTop: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '6px',
                            minHeight: '120px',
                            fontSize: '15px',
                            lineHeight: '1.5',
                            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                        }}
                        rows="4"
                        value={worldConcept}
                        onChange={(e) => setWorldConcept(e.target.value)}
                        placeholder="Describe your fictional world in detail. Include information about its unique features, history, social structures, technological development, and any special elements (magic systems, future technologies, supernatural beings, etc.)"
                        maxLength="1000"
                    />
                </label>
                <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                    <strong>Tip:</strong> The more detailed your description, the more tailored your legal framework will be. Consider including information about power structures, resources, cultural values, and major conflicts.
                </div>
            </div>

            <div style={{ marginTop: '16px' }}>
                <label>
                    Technology Level: {techLevel}
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={techLevel}
                        onChange={(e) => setTechLevel(parseInt(e.target.value))}
                        style={{ width: '100%', marginTop: '8px' }}
                    />
                </label>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span>Primitive</span>
                    <span>Contemporary</span>
                    <span>Advanced</span>
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginTop: '6px', fontStyle: 'italic' }}>
                    {techLevel <= 3 ?
                        "Pre-industrial technology with limited written communication and simple tools" :
                        techLevel <= 6 ?
                            "Modern technology with digital communication, computers, and global networks" :
                            "Advanced technology potentially including AI, quantum computing, or interstellar travel"}
                </div>
            </div>

            <div style={{ marginTop: '16px' }}>
                <label>
                    Government Type:
                    <select
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginTop: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                        value={governmentType}
                        onChange={(e) => setGovernmentType(e.target.value)}
                    >
                        <option value="">Select type...</option>
                        <option value="democratic-republic">Democratic Republic</option>
                        <option value="monarchy">Monarchy</option>
                        <option value="oligarchy">Oligarchy</option>
                        <option value="technocratic-council">Technocratic Council</option>
                        <option value="theocracy">Theocracy</option>
                        <option value="corporate-federation">Corporate Federation</option>
                        <option value="magical-conclave">Magical Conclave</option>
                        <option value="ai-guided-system">AI-Guided System</option>
                        <option value="hive-mind-consensus">Hive Mind Consensus</option>
                        <option value="tribal-confederation">Tribal Confederation</option>
                    </select>
                </label>
            </div>

            <button
                style={{
                    marginTop: '20px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    width: '100%',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                onClick={onSubmit}
                disabled={isGenerating || !worldConcept}
            >
                {isGenerating ? 'Generating...' : 'Generate Legal Framework'}
            </button>
        </>
    );
};

export default InputForm;
