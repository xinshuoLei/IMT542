import React from 'react';
import { Search, Package, Download, Calendar, ExternalLink } from 'lucide-react';

export default function SearchPage({ selectedText, searchResults, loading, error, onSelectPackage, onClose }) {
  
  const formatNumber = (num) => {
    if (!num) return 'N/A';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) return 'Today';
      if (diffInDays === 1) return '1 day ago';
      if (diffInDays < 30) return `${diffInDays} days ago`;
      if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
      return `${Math.floor(diffInDays / 365)} years ago`;
    } catch {
      return 'N/A';
    }
  };

  return (
    <div style={{ 
      width: '28rem', 
      height: '100vh', 
      backgroundColor: '#f9fafb', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={20} />
            Package Search
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '4px',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#9ca3af',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
            title="Close panel"
            onMouseEnter={(e) => { e.target.style.color = '#6b7280'; e.target.style.backgroundColor = '#f3f4f6'; }}
            onMouseLeave={(e) => { e.target.style.color = '#9ca3af'; e.target.style.backgroundColor = 'transparent'; }}>
            ✕
          </button>
        </div>

        {/* Selected Text Display */}
        {selectedText && (
          <div style={{ 
            backgroundColor: '#f0f9ff', 
            border: '1px solid #0ea5e9', 
            borderRadius: '6px', 
            padding: '8px 12px', 
            fontSize: '14px'
          }}>
            <div style={{ fontSize: '12px', fontWeight: '500', color: '#0369a1', marginBottom: '4px' }}>
              Searching for:
            </div>
            <div style={{ color: '#0c4a6e', fontFamily: 'monospace', wordBreak: 'break-word' }}>
              "{selectedText}"
            </div>
          </div>
        )}
      </div>

      {/* Search Results Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {/* Loading State */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '16px',
                border: '1px solid #e5e7eb',
                animation: 'pulse 1.5s ease-in-out infinite'
              }}>
                <div style={{ height: '20px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginBottom: '8px' }} />
                <div style={{ height: '16px', backgroundColor: '#f3f4f6', borderRadius: '4px', marginBottom: '8px' }} />
                <div style={{ height: '14px', backgroundColor: '#f3f4f6', borderRadius: '4px', width: '60%' }} />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{ 
            backgroundColor: '#fef2f2', 
            border: '1px solid #fecaca', 
            borderRadius: '8px', 
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '16px', fontWeight: '500', color: '#dc2626', marginBottom: '8px' }}>
              Search Failed
            </div>
            <div style={{ fontSize: '14px', color: '#7f1d1d', marginBottom: '12px' }}>
              {error}
            </div>
            <div style={{ fontSize: '12px', color: '#7f1d1d' }}>
              Please try again with a different search term.
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && searchResults && searchResults.length === 0 && (
          <div style={{ 
            backgroundColor: '#fefce8', 
            border: '1px solid #fde047', 
            borderRadius: '8px', 
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '16px', fontWeight: '500', color: '#a16207', marginBottom: '8px' }}>
              No packages found
            </div>
            <div style={{ fontSize: '14px', color: '#a16207' }}>
              Try a different search term or check your spelling.
            </div>
          </div>
        )}

        {/* Search Results */}
        {!loading && !error && searchResults && searchResults.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
              Found {searchResults.length} packages:
            </div>
            
            {searchResults.map((pkg, index) => (
              <div 
                key={pkg.name} 
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '16px',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={() => onSelectPackage(pkg)}
              >
                {/* Package Name and Version */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Package size={16} style={{ color: '#6b7280' }} />
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0, fontFamily: 'monospace' }}>
                      {pkg.name}
                    </h3>
                  </div>
                  <span style={{ fontSize: '12px', color: '#6b7280', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>
                    v{pkg.version}
                  </span>
                </div>

                {/* Description */}
                <p style={{ 
                  fontSize: '14px', 
                  color: '#6b7280', 
                  lineHeight: '1.4', 
                  margin: '0 0 12px 0',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {pkg.description || 'No description available'}
                </p>

                {/* Keywords */}
                {pkg.keywords && pkg.keywords.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
                      {pkg.keywords.slice(0, 4).map((keyword, idx) => (
                        <span key={idx} style={{
                          fontSize: '11px',
                          color: '#4f46e5',
                          backgroundColor: '#eef2ff',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          border: '1px solid #c7d2fe'
                        }}>
                          {keyword}
                        </span>
                      ))}
                      {pkg.keywords.length > 4 && (
                        <span style={{ 
                          fontSize: '11px', 
                          color: '#6b7280',
                          padding: '2px 4px',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          +{pkg.keywords.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Quick Stats */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#6b7280', marginTop: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} />
                    <span>Last publish {formatDate(pkg.date)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: 'white', borderTop: '1px solid #e5e7eb', padding: '12px' }}>
        <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', margin: 0 }}>
          Select a package to view detailed health metrics
        </p>
      </div>
    </div>
  );
}