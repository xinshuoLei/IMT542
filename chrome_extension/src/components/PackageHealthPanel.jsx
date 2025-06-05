import React, { useState, useEffect } from 'react';
import PackageHeader from './PackageHeader';
import CategoryPanel from './CategoryPanel';
import SearchPage from './SearchPage';
import { usePackageData } from '../hooks/usePackageData';
import { usePackageSearch } from '../hooks/usePackageSearch';
import { getCategoriesData } from '../utils/dataProcessors';

// TODO: Remove this hardcoded value in next step
const FALLBACK_PACKAGE_NAME = 'echarts';

const categories = [
  { key: 'communityAdoption', title: 'Community Adoption' },
  { key: 'maintenanceFrequency', title: 'Maintenance Frequency' },
  { key: 'releaseManagement', title: 'Release Management' },
  { key: 'implementationFootprint', title: 'Implementation Footprint' },
  { key: 'documentationCompleteness', title: 'Documentation Completeness' }
];

export default function PackageHealthPanel({ onClose, selectedText = '' }) {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showSearchPage, setShowSearchPage] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [hasSelectedPackage, setHasSelectedPackage] = useState(false);

  // Custom hooks
  const {
    packageData,
    downloadsData,
    githubData,
    githubHealthData,
    githubActivityData,
    loading,
    error,
    loadPackageData,
    clearPackageData
  } = usePackageData();

  const {
    searchResults,
    loading: searchLoading,
    error: searchError
  } = usePackageSearch(selectedText);

  // Show search page when there are search results or we're searching (but not if user has selected a package)
  useEffect(() => {
    const shouldShowSearch = selectedText && selectedText.trim().length >= 2 && !hasSelectedPackage;
    setShowSearchPage(shouldShowSearch);
    
    if (!shouldShowSearch && !selectedText && !hasSelectedPackage) {
      // Fallback mode - load default package
      loadPackageData(FALLBACK_PACKAGE_NAME);
    }
  }, [selectedText, hasSelectedPackage, loadPackageData]);

  // Handle package selection from search results
  const handleSelectPackage = async (pkg) => {
    setSelectedPackage(pkg);
    setHasSelectedPackage(true);
    setShowSearchPage(false);
    
    // Use the selected package name for analysis!
    await loadPackageData(pkg.name);
  };

  // Function to go back to search
  const handleBackToSearch = () => {
    setShowSearchPage(true);
    setSelectedPackage(null);
    setHasSelectedPackage(false);
    clearPackageData();
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Process data for categories
  const categoriesData = getCategoriesData(
    packageData,
    downloadsData,
    githubData,
    githubHealthData,
    githubActivityData
  );

  return (
    <div style={{ 
      width: '28rem', 
      height: '100vh', 
      backgroundColor: '#f9fafb', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      
      {/* Show Search Page or Analysis Page */}
      {showSearchPage ? (
        <SearchPage
          selectedText={selectedText}
          searchResults={searchResults}
          loading={searchLoading}
          error={searchError}
          onSelectPackage={handleSelectPackage}
          onClose={onClose}
        />
      ) : (
        <>
          {/* Header with back button */}
          <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <button
                onClick={handleBackToSearch}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#374151',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              >
                ← Back to Search Results
              </button>
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

            {/* Selected Package Info */}
            {selectedPackage && (
              <div style={{ 
                backgroundColor: '#ecfdf5', 
                border: '1px solid #10b981', 
                borderRadius: '6px', 
                padding: '8px 12px', 
                marginBottom: '12px',
                fontSize: '14px'
              }}>
                <div style={{ fontSize: '12px', fontWeight: '500', color: '#047857', marginBottom: '4px' }}>
                  Selected Package:
                </div>
                <div style={{ color: '#065f46', fontFamily: 'monospace', fontWeight: '600' }}>
                  {selectedPackage.name}
                </div>
              </div>
            )}

            {/* Package Analysis Header */}
            <PackageHeader 
              loading={loading}
              error={error}
              packageData={packageData}
            />
          </div>

          {/* Categories */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {categories.map(({ key, title }) => {
                const categoryData = categoriesData[key];
                if (!categoryData) {
                  console.error(`Missing category data for key: ${key}`);
                  return null;
                }
                return (
                  <CategoryPanel
                    key={key}
                    title={title}
                    category={key}
                    rating={categoryData.rating}
                    data={categoryData.data}
                    expanded={expandedCategories[key]}
                    onToggle={() => toggleCategory(key)}
                    loading={loading}
                    downloadsData={key === 'communityAdoption' ? downloadsData : null}
                  />
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div style={{ backgroundColor: 'white', borderTop: '1px solid #e5e7eb', padding: '12px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', margin: 0 }}>
              Package Health Extension - Analyzing: {selectedPackage?.name || packageData?.name || FALLBACK_PACKAGE_NAME}
            </p>
          </div>
        </>
      )}
    </div>
  );
}