import React from 'react';

export default function MetricRow({ icon: Icon, label, value, loading = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
        <Icon size={14} />
        <span>{label}</span>
      </div>
      <div style={{ fontSize: '14px', fontWeight: '500' }}>
        {loading ? (
          <div style={{ width: '48px', height: '16px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}></div>
        ) : (
          value
        )}
      </div>
    </div>
  );
}