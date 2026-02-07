import { useState } from 'react';

const PolicyCard = ({ policy }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            style={{
                padding: '16px',
                backgroundColor: '#f0f4f8',
                borderRadius: '6px',
                borderLeft: '3px solid #3b82f6',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginBottom: '12px'
            }}
            onClick={() => setExpanded(!expanded)}
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
                    {expanded ? '▲' : '▼'}
                </div>
            </div>

            {expanded && (
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
    );
};

export default PolicyCard;
