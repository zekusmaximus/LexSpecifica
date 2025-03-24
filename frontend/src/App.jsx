import { useState } from 'react';
import './App.css';
import heroImage from './assets/LexSpecifica.png';

function App() {
  const [worldConcept, setWorldConcept] = useState('');
  const [techLevel, setTechLevel] = useState(5);
  const [governmentType, setGovernmentType] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingPolicies, setIsGeneratingPolicies] = useState(false);
  const [isGeneratingConflicts, setIsGeneratingConflicts] = useState(false);
  const [legalFramework, setLegalFramework] = useState(null);
  const [policies, setPolicies] = useState(null);
  const [conflicts, setConflicts] = useState(null);
  const [activeTab, setActiveTab] = useState('input');
  const [expandedPolicies, setExpandedPolicies] = useState({});
  
  const handleGenerateFramework = async () => {
    if (!worldConcept) return;
    
    setIsGenerating(true);
    
    try {
      // Use the actual API call instead of mock data
      const response = await fetch('/api/generate/framework', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          worldConcept,
          parameters: {
            techLevel,
            governmentType
          }
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Framework response:", result);
      
      setLegalFramework(result.legalFramework);
      // Clear any previous policies and conflicts
      setPolicies(null);
      setConflicts(null);
    } catch (error) {
      console.error("Error generating framework:", error);
      // Show error to user (optional)
      setLegalFramework("Error: Failed to generate legal framework. " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleGeneratePolicies = async () => {
    if (!worldConcept) return;
    
    setIsGeneratingPolicies(true);
    
    try {
      // Use the actual API call instead of mock data
      const response = await fetch('/api/generate/policies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          worldConcept,
          parameters: {
            techLevel,
            governmentType
          }
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Policies response:", result);
      
      if (result.policies && Array.isArray(result.policies)) {
        setPolicies(result.policies);
      } else {
        console.error("Unexpected policies format:", result);
        throw new Error("Invalid response format for policies");
      }
    } catch (error) {
      console.error("Error generating policies:", error);
      // Show error to user (optional)
      setPolicies([{
        name: "Error", 
        description: "Failed to generate policies: " + error.message
      }]);
    } finally {
      setIsGeneratingPolicies(false);
    }
  };
  

// Replace your current handleGenerateConflicts function with this one
const handleGenerateConflicts = async () => {
  if (!worldConcept) return;
  
  setIsGeneratingConflicts(true);
  
  try {
    const response = await fetch('/api/generate/conflicts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        worldConcept,
        parameters: {
          techLevel,
          governmentType
        }
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error ${response.status}`);
    }
    
    const result = await response.json();
    console.log("Conflicts response:", result);
    
    if (result.conflicts && Array.isArray(result.conflicts)) {
      // Process the conflicts to ensure proper formatting
      const processedConflicts = [];
      
      for (let i = 0; i < result.conflicts.length; i++) {
        const conflict = result.conflicts[i];
        
        // If it's a simple string
        if (typeof conflict === 'string') {
          // Check if this conflict contains multiple conflicts (this happens sometimes)
          if (conflict.includes('CONFLICT 2:') || conflict.includes('CONFLICT 3:')) {
            // Split by "CONFLICT N:" pattern
            const parts = conflict.split(/CONFLICT\s+\d+\s*:/i);
            // First part might be empty or contain "CONFLICT 1:"
            for (let j = 0; j < parts.length; j++) {
              if (parts[j].trim()) {
                processedConflicts.push({
                  title: `Conflict ${processedConflicts.length + 1}`,
                  text: parts[j].trim()
                });
              }
            }
          } else {
            // Try to extract conflict title if it's in the format "CONFLICT N: Text"
            const titleMatch = conflict.match(/^CONFLICT\s*(\d+)\s*:\s*(.*?)$/im);
            if (titleMatch) {
              processedConflicts.push({
                title: `Conflict ${titleMatch[1]}`,
                text: conflict.replace(/^CONFLICT\s*\d+\s*:\s*/im, '').trim()
              });
            } else {
              // No pattern matched, just use as is
              processedConflicts.push({
                title: `Conflict ${processedConflicts.length + 1}`,
                text: conflict.trim()
              });
            }
          }
        } else if (typeof conflict === 'object' && conflict !== null) {
          // It's already an object, just make sure it has title and text properties
          processedConflicts.push({
            title: conflict.title || `Conflict ${processedConflicts.length + 1}`,
            text: conflict.text || JSON.stringify(conflict)
          });
        }
      }
      
      setConflicts(processedConflicts);
    } else {
      console.error("Unexpected conflicts format:", result);
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("Error generating conflicts:", error);
    // Show error to user
    setConflicts([
      {
        title: "Error",
        text: "Failed to generate conflicts. " + error.message
      }
    ]);
  } finally {
    setIsGeneratingConflicts(false);
  }
};
  
// Add this new component to your App.jsx file, before the main App component
const ConflictsSection = ({ conflicts }) => {
  if (!conflicts || conflicts.length === 0) return null;
  
  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{ 
        fontSize: '18px', 
        fontWeight: 'bold', 
        marginBottom: '12px', 
        color: '#2c3e50', 
        borderBottom: '2px solid #e53e3e', 
        paddingBottom: '8px' 
      }}>
        Story Conflicts
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {conflicts.map((conflict, index) => (
          <div key={index} style={{ 
            padding: '16px', 
            backgroundColor: '#fff8f0', 
            borderRadius: '6px',
            borderLeft: '3px solid #ed8936',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{
              fontWeight: 'bold',
              fontSize: '16px',
              marginBottom: '8px',
              color: '#c05621',
              textAlign: 'left'
            }}>
              {conflict.title || `Conflict ${index + 1}`}
            </div>
            <div style={{ 
              fontSize: '15px',
              lineHeight: '1.6',
              textAlign: 'left'
            }}>
              {conflict.text || conflict}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

  // Move the function HERE - outside of handleGenerateConflicts
  const togglePolicy = (index) => {
    setExpandedPolicies(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  // Function to compile all generated content into a single formatted document
  const compileFullFramework = () => {
    if (!legalFramework) return null;
    
    let compiledContent = `# LEGAL FRAMEWORK FOR "${worldConcept.substring(0, 40)}${worldConcept.length > 40 ? '...' : ''}"\n\n`;
    compiledContent += `Technology Level: ${techLevel}/10\n`;
    compiledContent += `Government Type: ${governmentType || 'Unspecified'}\n\n`;
    
    compiledContent += `## LEGAL SYSTEM\n\n${legalFramework}\n\n`;
    
    if (policies && policies.length > 0) {
      compiledContent += `## KEY POLICIES\n\n`;
      policies.forEach((policy, index) => {
        compiledContent += `### ${policy.name}\n\n${policy.description}\n\n`;
      });
    }
    
    if (conflicts && conflicts.length > 0) {
      compiledContent += `## LEGAL CONFLICTS\n\n`;
      conflicts.forEach((conflict, index) => {
        let conflictTitle = `Conflict ${index + 1}`;
        let conflictText = conflict;
        
        // If conflict is an object with title and text
        if (typeof conflict === 'object' && conflict.title && conflict.text) {
          conflictTitle = conflict.title;
          conflictText = conflict.text;
        } else if (typeof conflict === 'string') {
          // Try to extract title from format "Conflict N: Title"
          const titleMatch = conflict.match(/^CONFLICT\s*\d+\s*:\s*(.*?)$/im);
          if (titleMatch) {
            conflictTitle = titleMatch[1].trim();
            conflictText = conflict.replace(/^CONFLICT\s*\d+\s*:\s*(.*?)$/im, '').trim();
          }
        }
        
        compiledContent += `### ${conflictTitle}\n\n${conflictText}\n\n`;
      });
    }
    
    compiledContent += `---\nGenerated by LexSpecifica on ${new Date().toLocaleDateString()}\n`;
    
    return compiledContent;
  };
  
  // Function to download the compiled framework as a text file
  const downloadFramework = () => {
    const content = compileFullFramework();
    if (!content) return;
    
    // Create a normalized filename from the world concept
    const filename = worldConcept
      .substring(0, 20)
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();
    
    // Create a blob with the content
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_legal_framework.md`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  // Function to copy the compiled framework to clipboard
  const [copyStatus, setCopyStatus] = useState('');
  
  const copyFrameworkToClipboard = async () => {
    const content = compileFullFramework();
    if (!content) return;
    
    try {
      await navigator.clipboard.writeText(content);
      setCopyStatus('Copied!');
      
      // Clear the status after 3 seconds
      setTimeout(() => {
        setCopyStatus('');
      }, 3000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      setCopyStatus('Failed to copy');
      
      // Clear the status after 3 seconds
      setTimeout(() => {
        setCopyStatus('');
      }, 3000);
    }
  };
  
  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        marginBottom: '20px',
        background: 'linear-gradient(135deg, #2c3e50, #1a2a38)',
        padding: '20px',
        borderRadius: '8px',
        color: 'white'
      }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>LexSpecifica</h1>
        <p style={{ fontSize: '18px', marginBottom: '20px' }}>Speculative Legal Framework Generator for Fiction Writers</p>
        
        {/* Hero image would go here */}
        <div style={{ 
          width: '100%',
          maxWidth: '700px',
          height: '400px',
          backgroundColor: '#1a2a38',
          borderRadius: '8px',
          marginBottom: '20px',
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}></div>
          <div style={{ 
            backgroundColor: 'rgba(0,0,0,0.5)', 
            padding: '15px 20px', 
            borderRadius: '5px',
            maxWidth: '700px',
            width: '100%',
            textAlign: 'center',
            marginBottom: '10px'
          }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
              Create realistic legal frameworks for your fictional worlds
            </span>
          </div>
        </div>
      
      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '1px solid #ccc', 
        marginBottom: '20px' 
      }}>
        <button 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: activeTab === 'input' ? '#3b82f6' : 'transparent',
            color: activeTab === 'input' ? 'white' : 'inherit',
            border: 'none',
            borderRadius: '4px 4px 0 0',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('input')}
        >
          Create Framework
        </button>
        <button 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: activeTab === 'instructions' ? '#3b82f6' : 'transparent',
            color: activeTab === 'instructions' ? 'white' : 'inherit',
            border: 'none',
            borderRadius: '4px 4px 0 0',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('instructions')}
        >
          Instructions
        </button>
      </div>
      
      {/* Conditional content based on active tab */}
      {activeTab === 'instructions' ? (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f9f9f9', 
          borderRadius: '8px',
          marginBottom: '20px' 
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>How to Use LexSpecifica</h2>
          
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>1. Describe Your World</h3>
            <p>Start by describing your fictional world in as much detail as possible. Include information about its unique features, social structures, technological development, and any special elements (magic, future tech, supernatural beings, etc.)</p>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>2. Set Technology Level</h3>
            <p>Adjust the slider to match the technological development of your world. This helps generate appropriate legal frameworks for primitive, contemporary, or advanced societies.</p>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>3. Select Government Type</h3>
            <p>Choose the primary governmental structure for your society. This will influence the underlying principles and priorities of the legal system.</p>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>4. Generate and Explore</h3>
            <p>Click "Generate Legal Framework" to create the core legal system for your world. Then, use the additional buttons to explore:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
              <li><strong>Key Policies:</strong> Specific laws that would exist in your world</li>
              <li><strong>Story Conflicts:</strong> Potential legal disputes that could drive your narrative</li>
            </ul>
          </div>
          
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>5. Use in Your Fiction</h3>
            <p>Incorporate the generated elements into your worldbuilding. The legal systems and conflicts can add depth to your setting and drive compelling story arcs.</p>
          </div>
        </div>
      ) : (
        /* Input Form Tab Content */
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
            onClick={handleGenerateFramework}
            disabled={isGenerating || !worldConcept}
          >
            {isGenerating ? 'Generating...' : 'Generate Legal Framework'}
          </button>
          
          {legalFramework && (
            <div style={{ marginTop: '32px', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ padding: '16px 20px', backgroundColor: '#2c3e50', color: 'white' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold' }}>Legal Framework for Your World</h2>
              </div>
              
              <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '24px', backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '6px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#2c3e50', borderBottom: '2px solid #3b82f6', paddingBottom: '8px' }}>Legal Framework</h3>
                  <div style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap', textAlign: 'left' }}>
                    {legalFramework}
                  </div>
                </div>
                
                {/* Action buttons for policies and conflicts */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                  <button
                    style={{ 
                      flex: '1',
                      padding: '10px', 
                      backgroundColor: policies ? '#f0f9ff' : '#3b82f6', 
                      color: policies ? '#2c5282' : 'white',
                      border: policies ? '1px solid #3b82f6' : 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '60px'
                    }}
                    onClick={handleGeneratePolicies}
                    disabled={isGeneratingPolicies}
                  >
                    {isGeneratingPolicies ? (
                      'Generating...'
                    ) : policies ? (
                      <>
                        <span>✓ Key Policies</span>
                        <span style={{ fontSize: '12px', fontWeight: 'normal' }}>Regenerate</span>
                      </>
                    ) : (
                      'Generate Key Policies'
                    )}
                  </button>
                  
                  <button
                    style={{ 
                      flex: '1',
                      padding: '10px', 
                      backgroundColor: conflicts ? '#fff5f5' : '#e53e3e', 
                      color: conflicts ? '#c53030' : 'white',
                      border: conflicts ? '1px solid #e53e3e' : 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '60px'
                    }}
                    onClick={handleGenerateConflicts}
                    disabled={isGeneratingConflicts}
                  >
                    {isGeneratingConflicts ? (
                      'Generating...'
                    ) : conflicts ? (
                      <>
                        <span>✓ Story Conflicts</span>
                        <span style={{ fontSize: '12px', fontWeight: 'normal' }}>Regenerate</span>
                      </>
                    ) : (
                      'Generate Story Conflicts'
                    )}
                  </button>
                </div>
                
                {/* Policies Section with Expandable Cards */}
                {policies && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#2c3e50', borderBottom: '2px solid #3b82f6', paddingBottom: '8px' }}>Key Policies</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {policies.map((policy, index) => (
                        <div 
                          key={index} 
                          style={{ 
                            padding: '16px', 
                            backgroundColor: '#f0f4f8', 
                            borderRadius: '6px',
                            borderLeft: '3px solid #3b82f6',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onClick={() => togglePolicy(index)}
                        >
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <div style={{ 
                              fontWeight: 'bold', 
                              fontSize: '16px',
                              color: '#2c5282',
                              textAlign: 'left'
                            }}>
                              {policy.name}
                            </div>
                            <div>
                              {expandedPolicies[index] ? '▲' : '▼'}
                            </div>
                          </div>
                          
                          {expandedPolicies[index] && (
                            <div style={{ 
                              fontSize: '15px',
                              lineHeight: '1.6',
                              marginTop: '12px',
                              paddingTop: '12px',
                              borderTop: '1px solid #ccc',
                              textAlign: 'left',
                              whiteSpace: 'pre-wrap'
                            }}>
                              {policy.description}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                
                {conflicts && <ConflictsSection conflicts={conflicts} />}
                
                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
                  <button
                    style={{ 
                      padding: '8px 16px', 
                      backgroundColor: '#3b82f6', 
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                    onClick={() => {
                      setWorldConcept('');
                      setLegalFramework(null);
                      setPolicies(null);
                      setConflicts(null);
                    }}
                  >
                    Create New Framework
                  </button>
                  <button
                    style={{ 
                      padding: '8px 16px', 
                      backgroundColor: 'transparent', 
                      color: '#3b82f6',
                      border: '1px solid #3b82f6',
                      borderRadius: '4px',
                      cursor: 'pointer' 
                    }}
                    onClick={downloadFramework}
                  >
                    Save Framework
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;