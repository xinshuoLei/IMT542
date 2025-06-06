import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function PackageHeader({ loading, error, packageData, onClose }) {
  return (
    <div>
      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Loading package data...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{ 
          backgroundColor: '#fef2f2', 
          border: '1px solid #fecaca', 
          borderRadius: '6px', 
          padding: '12px', 
          marginBottom: '12px' 
        }}>
          <div style={{ fontSize: '12px', fontWeight: '500', color: '#dc2626', marginBottom: '4px' }}>
            Error loading package data:
          </div>
          <div style={{ fontSize: '14px', color: '#7f1d1d' }}>
            {error}
          </div>
          <div style={{ fontSize: '12px', color: '#7f1d1d', marginTop: '4px' }}>
            Make sure your API is running on localhost:8000
          </div>
        </div>
      )}

      {/* Package Data */}
      {packageData && !loading && (
        <>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
                {packageData.name}
              </h2>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0' }}>
                v{packageData.latest_version}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <a href={packageData.npm_url} target="_blank" rel="noopener noreferrer" 
                 style={{ 
                   padding: '4px', 
                   color: '#9ca3af', 
                   textDecoration: 'none',
                   borderRadius: '4px'
                 }}
                 title="View on npm"
                 onMouseEnter={(e) => { e.target.style.color = '#6b7280'; e.target.style.backgroundColor = '#f3f4f6'; }}
                 onMouseLeave={(e) => { e.target.style.color = '#9ca3af'; e.target.style.backgroundColor = 'transparent'; }}>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
          <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5', marginBottom: '16px' }}>
            {packageData.description}
          </p>
          
          {/* Basic Information */}
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Basic Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#6b7280' }}>License:</span>
                <span style={{ fontWeight: '500', textAlign: 'right' }}>{packageData.license || 'N/A'}</span>
              </div>
              {packageData.homepage && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#6b7280' }}>Homepage:</span>
                  <a href={packageData.homepage} target="_blank" rel="noopener noreferrer"
                     style={{ 
                       color: '#2563eb', 
                       textDecoration: 'none', 
                       textAlign: 'right',
                       maxWidth: '60%', 
                       overflow: 'hidden', 
                       textOverflow: 'ellipsis',
                       whiteSpace: 'nowrap'
                     }}
                     onMouseEnter={(e) => e.target.style.color = '#1d4ed8'}
                     onMouseLeave={(e) => e.target.style.color = '#2563eb'}>
                    {packageData.homepage.replace('https://', '')}
                  </a>
                </div>
              )}
              {/* Repository - Always show this row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#6b7280' }}>Repository:</span>
                {packageData.repository ? (
                  <a href={packageData.repository} target="_blank" rel="noopener noreferrer"
                     style={{ 
                       color: '#2563eb', 
                       textDecoration: 'none', 
                       textAlign: 'right',
                       maxWidth: '60%', 
                       overflow: 'hidden', 
                       textOverflow: 'ellipsis',
                       whiteSpace: 'nowrap'
                     }}
                     onMouseEnter={(e) => e.target.style.color = '#1d4ed8'}
                     onMouseLeave={(e) => e.target.style.color = '#2563eb'}>
                    {packageData.repository.replace('https://github.com/', '')}
                  </a>
                ) : (
                  <span style={{ 
                    color: '#dc2626', 
                    fontSize: '12px', 
                    fontWeight: '500',
                    backgroundColor: '#fef2f2',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid #fecaca',
                    textAlign: 'right'
                  }}>
                    No repository information
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#6b7280' }}>npm URL:</span>
                <a href={packageData.npm_url} target="_blank" rel="noopener noreferrer"
                   style={{ 
                     color: '#2563eb', 
                     textDecoration: 'none', 
                     textAlign: 'right',
                     maxWidth: '60%', 
                     overflow: 'hidden', 
                     textOverflow: 'ellipsis',
                     whiteSpace: 'nowrap'
                   }}
                   onMouseEnter={(e) => e.target.style.color = '#1d4ed8'}
                   onMouseLeave={(e) => e.target.style.color = '#2563eb'}>
                  npmjs.com/package/{packageData.name}
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}