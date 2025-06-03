import React from 'react';
import { Calendar, ExternalLink } from 'lucide-react';

export default function LastPrSection({ created, mergedAt, url, loading = false }) {
  if (loading) {
    return (
      <div style={{ padding: '4px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
          <Calendar size={14} />
          <span>Last PR Merged</span>
        </div>
        <div style={{ marginLeft: '22px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ width: '120px', height: '14px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}></div>
          <div style={{ width: '100px', height: '14px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '4px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
          <Calendar size={14} />
          <span>Last PR Merged</span>
          {url && (
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: '#2563eb', 
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                marginLeft: '4px'
              }}
              onMouseEnter={(e) => e.target.style.color = '#1d4ed8'}
              onMouseLeave={(e) => e.target.style.color = '#2563eb'}
              title="View PR"
            >
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
      <div style={{ marginLeft: '22px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px', marginTop: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#6b7280' }}>Created:</span>
          <span style={{ fontWeight: '500', color: '#374151' }}>{created}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#6b7280' }}>Merged:</span>
          <span style={{ fontWeight: '500', color: '#374151' }}>{mergedAt}</span>
        </div>
      </div>
    </div>
  );
}