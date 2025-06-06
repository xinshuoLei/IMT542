import React, { useState, useEffect } from 'react';
import { Search, Package, Sparkles } from 'lucide-react';
import SearchPage from './SearchPage';
import { usePackageSearch } from '../hooks/usePackageSearch';

export default function ManualSearchPage({ 
  onSelectPackage, 
  onClose, 
  onSearchPerformed, 
  initialQuery = '', 
  hasSearched = false 
}) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [hasSearchedLocal, setHasSearchedLocal] = useState(hasSearched);

  // Use the prop values on mount and when they change
  useEffect(() => {
    setHasSearchedLocal(hasSearched);
    setSearchQuery(initialQuery);
  }, [hasSearched, initialQuery]);

  // Use the search hook with the manual query
  const {
    searchResults,
    loading: searchLoading,
    error: searchError
  } = usePackageSearch(hasSearchedLocal ? searchQuery : '');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      setHasSearchedLocal(true);
      // Notify parent of the search query
      if (onSearchPerformed) {
        onSearchPerformed(searchQuery.trim());
      }
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    // Reset search state if input is cleared
    if (e.target.value.trim().length === 0) {
      setHasSearchedLocal(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  // If we have searched and have a query, show the search results page
  if (hasSearchedLocal && searchQuery.trim()) {
    return (
      <SearchPage
        selectedText={searchQuery}
        searchResults={searchResults}
        loading={searchLoading}
        error={searchError}
        onSelectPackage={onSelectPackage}
        onClose={onClose}
        isManualSearch={true}
        onBackToManualSearch={() => setHasSearchedLocal(false)}
      />
    );
  }

  // Show the manual search input page
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={20} />
            Package Health
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

        {/* Search Form */}
        <form onSubmit={handleSearch}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>
              <Search size={16} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Search npm packages..."
              autoFocus
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                backgroundColor: 'white'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            {searchQuery.trim().length >= 2 && (
              <button
                type="submit"
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: '6px 12px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
              >
                Search
              </button>
            )}
          </div>
        </form>

        <p style={{ fontSize: '12px', color: '#6b7280', margin: '8px 0 0', textAlign: 'center' }}>
          Search for any npm package to view detailed health metrics
        </p>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '32px' }}>
        <div style={{ textAlign: 'center', maxWidth: '300px' }}>
          <div style={{ marginBottom: '24px' }}>
            <Sparkles size={48} style={{ color: '#3b82f6', margin: '0 auto' }} />
          </div>
          
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
            Discover Package Health
          </h3>
          
          <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5', marginBottom: '24px' }}>
            Get comprehensive health and usability insights for any JavaScript package. 
            Search by name, functionality, or use case.
          </p>

          <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #0ea5e9', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
            <p style={{ fontSize: '12px', color: '#0c4a6e', margin: 0, lineHeight: '1.4' }}>
              You can also highlight package names on any webpage and use the keyboard shortcut 
              <span style={{ fontFamily: 'monospace', backgroundColor: '#e0f2fe', padding: '2px 4px', borderRadius: '3px', margin: '0 4px' }}>
                Ctrl+H
              </span>
              (
              <span style={{ fontFamily: 'monospace', backgroundColor: '#e0f2fe', padding: '2px 4px', borderRadius: '3px', margin: '0 4px' }}>
                Cmd+H
              </span>
              on Mac) to analyze them instantly!
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', fontSize: '12px', color: '#6b7280' }}>
            <div style={{ textAlign: 'center' }}>
              <strong style={{ color: '#374151' }}>Example searches:</strong>
              <br />react • chart library • @types/node • lodash • express
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: 'white', borderTop: '1px solid #e5e7eb', padding: '12px' }}>
        <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', margin: 0 }}>
          Package Health Extension - Start by searching above
        </p>
      </div>
    </div>
  );
}