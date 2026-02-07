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
                {conflicts.map((conflict, index) => {
                    // Normalize conflict structure if it's just a string vs object
                    const title = typeof conflict === 'object' ? conflict.title : `Conflict ${index + 1}`;
                    const text = typeof conflict === 'object' ? conflict.text : conflict;

                    return (
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
                                {title}
                            </div>
                            <div style={{
                                fontSize: '15px',
                                lineHeight: '1.6',
                                textAlign: 'left'
                            }}>
                                {text}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ConflictsSection;
