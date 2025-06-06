import React from 'react';

export default function MetricRow({ icon: Icon, label, value, loading = false }) {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'flex-start', // Change to flex-start to handle wrapping better
      justifyContent: 'space-between', 
      padding: '6px 0', // Slightly more padding
      minHeight: '32px', // Ensure minimum height
      gap: '8px' // Add gap between elements
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        fontSize: '14px', 
        color: '#6b7280',
        minWidth: '0', // Allow shrinking
        flex: '1', // Take available space
        wordBreak: 'break-word' // Prevent overflow
      }}>
        <Icon size={14} style={{ flexShrink: 0 }} />
        <span>{label}</span>
      </div>
      <div style={{ 
        fontSize: '14px', 
        fontWeight: '500',
        flexShrink: 0, // Don't shrink the value
        textAlign: 'right',
        marginLeft: '8px' // Ensure some space from label
      }}>
        {loading ? (
          <div style={{ width: '48px', height: '16px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}></div>
        ) : (
          <span style={{ wordBreak: 'break-all' }}>{value}</span> // Allow breaking long values
        )}
      </div>
    </div>
  );
}