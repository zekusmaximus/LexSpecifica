import { useState } from 'react';
import './App.css';
import heroImage from './assets/LexSpecifica.png';

function App() {
  const [worldConcept, setWorldConcept] = useState('');
  const [techLevel, setTechLevel] = useState(5);
  const [governmentType, setGovernmentType] = useState('');
  const [detailLevel, setDetailLevel] = useState('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [activeTab, setActiveTab] = useState('input'); // For switching between input and instructions
  
  const handleGenerate = async () => {
    if (!worldConcept) return;
    
    setIsGenerating(true);
    
    try {
      // In a production environment, this would be an actual API call
      // For now, we'll simulate it with a delay and mock data
      
      // Example of what the API call would look like:
      // const response = await fetch('/api/generate', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     worldConcept,
      //     parameters: {
      //       techLevel,
      //       governmentType,
      //       detailLevel,
      //       worldElements: [],
      //       citizenRights: []
      //     }
      //   }),
      // });
      // const result = await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response data
      const result = {
        legalFramework: `This is a ${detailLevel} legal framework for ${worldConcept} with a technology level of ${techLevel} and a ${governmentType || 'unspecified'} government type.`,
        policies: [
          `Universal Rights Protocol`,
          `Resource Allocation Directive`,
          `Citizenship Classification Act`,
          `Intergroup Conflict Resolution Statute`,
          `Authority Transfer Procedure`
        ],
        conflicts: [
          `A dispute arises when a citizen claims rights that conflict with the established order.`,
          `A novel technology challenges existing legal frameworks and requires new regulation.`,
          `Two classes of citizens have competing claims to scarce resources.`,
          `A marginalized group seeks recognition under the existing legal structure.`,
          `A legal authority exceeds its jurisdiction, creating precedent for future overreach.`
        ],
        legalDocuments: [{
          title: "Foundation Charter",
          content: `This document establishes the fundamental principles of governance for ${worldConcept}, acknowledging the inherent rights of all sentient entities and establishing the parameters of legal authority.`
        }]
      };
      
      setGeneratedContent(result);
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsGenerating(false);
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
        
        {/* Hero image */}
        <div style={{ 
          width: '100%',
          maxWidth: '600px',
          height: '200px',
          backgroundColor: '#1a2a38',
          borderRadius: '8px',
          marginBottom: '20px',
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'contain', // Changed to 'contain' to show the full image without cropping
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat', // Prevent the image from repeating
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
        }}>
          <div style={{ 
            backgroundColor: 'rgba(0,0,0,0.5)', 
            padding: '15px', 
            borderRadius: '5px',
            maxWidth: '80%',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
              Create realistic legal frameworks for your fictional worlds
            </span>
          </div>
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
            <p>Click "Generate Legal Framework" to create a comprehensive legal system for your world. The result will include:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
              <li><strong>Legal Framework:</strong> The foundational principles and structures of your world's legal system</li>
              <li><strong>Policies:</strong> Specific laws that would exist in your world</li>
              <li><strong>Conflicts:</strong> Potential legal disputes that could drive your narrative</li>
              <li><strong>Legal Documents:</strong> Sample text from constitutions, court cases, or other legal documents</li>
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
          
          <div style={{ marginTop: '16px' }}>
            <label>
              Detail Level:
              <select
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  marginTop: '8px', 
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
                value={detailLevel}
                onChange={(e) => setDetailLevel(e.target.value)}
              >
                <option value="brief">Brief</option>
                <option value="medium">Medium</option>
                <option value="comprehensive">Comprehensive</option>
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
            onClick={handleGenerate}
            disabled={isGenerating || !worldConcept}
          >
            {isGenerating ? 'Generating...' : 'Generate Legal Framework'}
          </button>
          
          {generatedContent && (
            <div style={{ marginTop: '32px', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ padding: '16px 20px', backgroundColor: '#2c3e50', color: 'white' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold' }}>Legal Framework for Your World</h2>
              </div>
              
              <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '24px', backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '6px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#2c3e50', borderBottom: '2px solid #3b82f6', paddingBottom: '8px' }}>Legal Foundation</h3>
                  <p style={{ lineHeight: '1.6' }}>{generatedContent.legalFramework}</p>
                </div>
                
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#2c3e50', borderBottom: '2px solid #3b82f6', paddingBottom: '8px' }}>Key Policies</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
                    {generatedContent.policies.map((policy, index) => (
                      <div key={index} style={{ 
                        padding: '12px', 
                        backgroundColor: '#f0f4f8', 
                        borderRadius: '6px',
                        borderLeft: '3px solid #3b82f6',
                        fontSize: '15px',
                        fontWeight: index === 0 ? 'bold' : 'normal'
                      }}>
                        {policy}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#2c3e50', borderBottom: '2px solid #3b82f6', paddingBottom: '8px' }}>Potential Conflicts</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {generatedContent.conflicts.map((conflict, index) => (
                      <div key={index} style={{ 
                        padding: '12px 16px', 
                        backgroundColor: '#fff8f0', 
                        borderRadius: '6px',
                        borderLeft: '3px solid #ed8936',
                        fontSize: '15px',
                        lineHeight: '1.5'
                      }}>
                        {conflict}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#2c3e50', borderBottom: '2px solid #3b82f6', paddingBottom: '8px' }}>Legal Documents</h3>
                  {generatedContent.legalDocuments.map((doc, index) => (
                    <div key={index} style={{ 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '6px', 
                      overflow: 'hidden',
                      marginBottom: '16px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                    }}>
                      <div style={{ padding: '12px 16px', backgroundColor: '#2c3e50', color: 'white', fontSize: '16px', fontWeight: 'bold' }}>
                        {doc.title}
                      </div>
                      <div style={{ 
                        padding: '16px', 
                        backgroundColor: '#f8fafc',
                        fontFamily: 'Georgia, serif',
                        lineHeight: '1.6',
                        fontSize: '15px'
                      }}>
                        {doc.content}
                      </div>
                    </div>
                  ))}
                </div>
                
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
                    onClick={() => setActiveTab('input')}
                  >
                    Generate Another
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