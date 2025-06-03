import React, { useState } from 'react';
import { FileText, HelpCircle, ExternalLink } from 'lucide-react';

export default function HealthScoreRow({ value, loading = false }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => setShowTooltip(true);
  const handleMouseLeave = () => setShowTooltip(false);

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
          <FileText size={14} />
          <span>Health Score</span>
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative' }}
          >
            <button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                color: '#9ca3af'
              }}
              title="Click for more info"
            >
              <HelpCircle size={12} />
            </button>
            
            {showTooltip && (
              <>
                {/* Invisible bridge to prevent tooltip from disappearing */}
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '-12px',
                  right: '-12px',
                  height: '8px',
                  backgroundColor: 'transparent'
                }} />
                
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: '-100px',
                  width: '280px',
                  backgroundColor: '#1f2937',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  lineHeight: '1.4',
                  zIndex: 1000,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>GitHub Community Health Score</strong>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    This percentage reflects how well the repository follows GitHub's recommended 
                    community standards, including presence of README, license, contributing guidelines, 
                    code of conduct, issue templates, and other community files.
                  </div>
                  <a 
                    href="https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/about-community-profiles-for-public-repositories"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      color: '#60a5fa', 
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#93c5fd'}
                    onMouseLeave={(e) => e.target.style.color = '#60a5fa'}
                  >
                    Learn more about GitHub community profiles
                    <ExternalLink size={10} />
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
        <div style={{ fontSize: '14px', fontWeight: '500' }}>
          {loading ? (
            <div style={{ width: '48px', height: '16px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}></div>
          ) : (
            value
          )}
        </div>
      </div>
    </div>
  );
}