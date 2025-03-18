
import { useState } from 'react';
import './App.css';

function App() {
  const [worldConcept, setWorldConcept] = useState('');
  const [techLevel, setTechLevel] = useState(5);
  const [governmentType, setGovernmentType] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  
  const handleGenerate = async () => {
    if (!worldConcept) return;
    
    setIsGenerating(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = {
        legalFramework: "This is a simulated legal framework for " + worldConcept,
        policies: ["Policy 1", "Policy 2", "Policy 3"],
        conflicts: ["Conflict 1", "Conflict 2", "Conflict 3"],
        legalDocuments: [{
          title: "Sample Document",
          content: "This is a sample legal document for " + worldConcept
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
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>LexSpecifica</h1>
      <p>Speculative Legal Framework Generator for Fiction Writers</p>
      
      <div style={{ marginTop: '20px' }}>
        <label>
          World Concept:
          <textarea
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginTop: '8px', 
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            rows="4"
            value={worldConcept}
            onChange={(e) => setWorldConcept(e.target.value)}
            placeholder="Describe your fictional world..."
          />
        </label>
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
            <option value="democracy">Democracy</option>
            <option value="monarchy">Monarchy</option>
            <option value="oligarchy">Oligarchy</option>
            <option value="technocracy">Technocracy</option>
            <option value="theocracy">Theocracy</option>
            <option value="corporatocracy">Corporatocracy</option>
          </select>
        </label>
      </div>
      
      <button
        style={{ 
          marginTop: '20px', 
          backgroundColor: '#3b82f6', 
          color: 'white', 
          padding: '8px 16px', 
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
        onClick={handleGenerate}
        disabled={isGenerating || !worldConcept}
      >
        {isGenerating ? 'Generating...' : 'Generate Legal Framework'}
      </button>
      
      {generatedContent && (
        <div style={{ marginTop: '32px', border: '1px solid #ccc', borderRadius: '4px', padding: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Generated Framework</h2>
          
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Legal Framework</h3>
            <p>{generatedContent.legalFramework}</p>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Policies</h3>
            <ul style={{ paddingLeft: '20px' }}>
              {generatedContent.policies.map((policy, index) => (
                <li key={index}>{policy}</li>
              ))}
            </ul>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Conflicts</h3>
            <ul style={{ paddingLeft: '20px' }}>
              {generatedContent.conflicts.map((conflict, index) => (
                <li key={index}>{conflict}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Legal Documents</h3>
            {generatedContent.legalDocuments.map((doc, index) => (
              <div key={index} style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '12px', marginBottom: '12px' }}>
                <h4 style={{ fontWeight: 'bold' }}>{doc.title}</h4>
                <p>{doc.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
