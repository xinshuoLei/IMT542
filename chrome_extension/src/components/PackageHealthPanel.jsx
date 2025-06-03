import React, { useState, useEffect } from 'react';
import PackageHeader from './PackageHeader';
import CategoryPanel from './CategoryPanel';
import { fetchNpmMetadata, fetchNpmDownloads } from '../utils/api';
import { dummyCategories, categories, PACKAGE_NAME } from '../data/dummyData';

export default function PackageHealthPanel({ onClose, selectedText = '' }) {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [packageData, setPackageData] = useState(null);
  const [downloadsData, setDownloadsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch package data on component mount
  useEffect(() => {
    async function loadPackageData() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both npm metadata and downloads data
        const [npmData, downloadStats] = await Promise.all([
          fetchNpmMetadata(PACKAGE_NAME),
          fetchNpmDownloads(PACKAGE_NAME)
        ]);
        
        setPackageData(npmData);
        setDownloadsData(downloadStats);
      } catch (err) {
        setError(err.message);
        console.error('Failed to load package data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPackageData();
  }, []);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Create categories with real data where available
  const getCategoriesData = () => {
    if (!packageData) return dummyCategories;

    return {
      communityAdoption: {
        rating: calculateAdoptionRating(downloadsData),
        data: {
          monthlyDownloads: formatDownloads(downloadsData?.monthly_downloads),
          stars: 'Loading...', // Need GitHub API
          forks: 'Loading...' // Need GitHub API
        }
      },
      maintenanceFrequency: {
        rating: calculateMaintenanceRating(packageData),
        data: {
          daysSinceLastRelease: packageData.days_since_last_release?.toString() || 'N/A',
          releasesLastYear: packageData.releases_last_year?.toString() || 'N/A',
          lastCodePush: 'Loading...', // Need GitHub API
          maintainersCount: packageData.maintainers_count?.toString() || 'N/A'
        }
      },
      implementationFootprint: {
        rating: calculateFootprintRating(packageData),
        data: {
          bundleSize: packageData.bundle_size || 'N/A',
          dependenciesCount: packageData.dependencies_count?.toString() || 'N/A'
        }
      },
      documentationCompleteness: {
        rating: 'Loading...', // Need GitHub API
        data: {
          healthPercentage: 'Loading...', // Need GitHub API
          hasReadme: 'Loading...', // Need GitHub API
          hasLicense: 'Loading...', // Need GitHub API
          hasContributing: 'Loading...', // Need GitHub API
          hasCodeOfConduct: 'Loading...' // Need GitHub API
        }
      },
      supportResponsiveness: {
        rating: 'Loading...', // Need GitHub API
        data: {
          openIssues: 'Loading...', // Need GitHub API
          lastPrMerged: 'Loading...' // Need GitHub API
        }
      }
    };
  };

  // Format downloads with commas
  function formatDownloads(downloads) {
    if (!downloads) return 'N/A';
    return downloads.toLocaleString();
  }

  // Calculate adoption rating based on monthly downloads
  function calculateAdoptionRating(downloadData) {
    if (!downloadData?.monthly_downloads) return 'Limited';
    
    const monthly = downloadData.monthly_downloads;
    if (monthly >= 1000000) return 'Strong'; // 1M+ downloads
    if (monthly >= 100000) return 'Moderate'; // 100K+ downloads
    return 'Limited'; // Less than 100K
  }

  // Simple rating calculation functions
  function calculateMaintenanceRating(data) {
    const daysSinceRelease = data.days_since_last_release;
    const releasesLastYear = data.releases_last_year;
    
    if (daysSinceRelease <= 30 && releasesLastYear >= 12) return 'Regular';
    if (daysSinceRelease <= 90 && releasesLastYear >= 4) return 'Occasional';
    return 'Infrequent';
  }

  function calculateFootprintRating(data) {
    const sizeInKB = parseFloat(data.bundle_size?.replace(/[^\d.]/g, '') || '0');
    const deps = data.dependencies_count || 0;
    
    if (sizeInKB < 100 && deps < 5) return 'Lightweight';
    if (sizeInKB < 500 && deps < 15) return 'Moderate';
    return 'Heavy';
  }

  return (
    <div style={{ 
      width: '28rem', 
      height: '100vh', 
      backgroundColor: '#f9fafb', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      {/* Header */}
      <PackageHeader 
        selectedText={selectedText}
        loading={loading}
        error={error}
        packageData={packageData}
        onClose={onClose}
      />

      {/* Categories */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {categories.map(({ key, title }) => {
            const categoryData = getCategoriesData()[key];
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
          Package Health Extension
        </p>
      </div>
    </div>
  );
}