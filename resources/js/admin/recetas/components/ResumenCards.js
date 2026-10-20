import React from 'react';

// Grid de cards del mismo tamaño para mostrar resúmenes (cotización, saldos, etc.)
const ResumenCards = ({ items = [], title }) => (
    <div style={{ marginBottom: '16px' }}>
        {title && <h4 style={{ marginBottom: '10px' }}>{title}</h4>}
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                gap: '12px',
            }}
        >
            {items.map((item) => (
                <div
                    key={item.label}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        minHeight: '78px',
                        padding: '12px 16px',
                        background: '#fff',
                        border: '1px solid #e5e7eb',
                        borderTop: `3px solid ${item.color || '#1677ff'}`,
                        borderRadius: '8px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    }}
                >
                    <span style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                        {item.label}
                    </span>
                    <span
                        style={{
                            fontSize: '16px',
                            fontWeight: 600,
                            color: item.valueColor || '#111827',
                            wordBreak: 'break-word',
                        }}
                    >
                        {item.value ?? '-'}
                    </span>
                    {item.hint && (
                        <span style={{ fontSize: '12px', color: item.valueColor || '#6b7280', marginTop: '2px' }}>
                            {item.hint}
                        </span>
                    )}
                </div>
            ))}
        </div>
    </div>
);

export default ResumenCards;
