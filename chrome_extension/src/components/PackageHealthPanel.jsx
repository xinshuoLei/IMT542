import React, { useState, useEffect } from 'react';
import PackageHeader from './PackageHeader';
import CategoryPanel from './CategoryPanel';
import { fetchNpmMetadata, fetchNpmDownloads, fetchGitHubRepo, fetchGitHubHealth, fetchGitHubActivity, extractGitHubInfo } from '../utils/api';

// Define categories and package name directly in this file
const PACKAGE_NAME = 'echarts';

const categories = [
  { key: 'communityAdoption', title: 'Community Adoption' },
  { key: 'maintenanceFrequency', title: 'Maintenance Frequency' },
  { key: 'releaseManagement', title: 'Release Management' },
  { key: 'implementationFootprint', title: 'Implementation Footprint' },
  { key: 'documentationCompleteness', title: 'Documentation Completeness' }
];

export default function PackageHealthPanel({ onClose, selectedText = '' }) {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [packageData, setPackageData] = useState(null);
  const [downloadsData, setDownloadsData] = useState(null);
  const [githubData, setGithubData] = useState(null);
  const [githubHealthData, setGithubHealthData] = useState(null);
  const [githubActivityData, setGithubActivityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch package data on component mount
  useEffect(() => {
    async function loadPackageData() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch npm data first
        const [npmData, downloadStats] = await Promise.all([
          fetchNpmMetadata(PACKAGE_NAME),
          fetchNpmDownloads(PACKAGE_NAME)
        ]);
        
        setPackageData(npmData);
        setDownloadsData(downloadStats);

        // Extract GitHub info and fetch GitHub data if available
        const githubInfo = extractGitHubInfo(npmData.repository);
        if (githubInfo) {
          try {
            const [repoData, healthData, activityData] = await Promise.all([
              fetchGitHubRepo(githubInfo.owner, githubInfo.repo),
              fetchGitHubHealth(githubInfo.owner, githubInfo.repo),
              fetchGitHubActivity(githubInfo.owner, githubInfo.repo)
            ]);
            setGithubData(repoData);
            setGithubHealthData(healthData);
            setGithubActivityData(activityData);
          } catch (githubError) {
            console.error('Failed to load GitHub data:', githubError);
            // Continue without GitHub data
          }
        }
        
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
    return {
      communityAdoption: {
        rating: calculateAdoptionRating(downloadsData, githubData),
        data: {
          monthlyDownloads: formatDownloads(downloadsData?.monthly_downloads),
          stars: formatNumber(githubData?.stars) || 'N/A',
          forks: formatNumber(githubData?.forks) || 'N/A'
        }
      },
      releaseManagement: {
        rating: calculateReleaseManagementRating(packageData, githubData),
        data: {
          daysSinceLastRelease: packageData?.days_since_last_release?.toString() || 'N/A',
          releasesLastYear: packageData?.releases_last_year?.toString() || 'N/A',
          isArchived: githubData?.is_maintained === false && githubData?.is_archived !== undefined ? (githubData.is_archived ? '✓' : '✗') : null,
          maintainersCount: packageData?.maintainers_count?.toString() || 'N/A'
        }
      },
      implementationFootprint: {
        rating: calculateFootprintRating(packageData),
        data: {
          bundleSize: packageData?.bundle_size || 'N/A',
          dependenciesCount: packageData?.dependencies_count?.toString() || 'N/A'
        }
      },
      documentationCompleteness: {
        rating: calculateDocumentationRating(githubHealthData),
        data: {
          healthPercentage: githubHealthData?.health_percentage ? `${githubHealthData.health_percentage}%` : 'N/A',
          hasReadme: githubHealthData?.has_readme !== undefined ? (githubHealthData.has_readme ? '✓' : '✗') : 'N/A',
          hasLicense: githubHealthData?.has_license !== undefined ? (githubHealthData.has_license ? '✓' : '✗') : 'N/A',
          hasContributing: githubHealthData?.has_contributing !== undefined ? (githubHealthData.has_contributing ? '✓' : '✗') : 'N/A',
          hasCodeOfConduct: githubHealthData?.has_code_of_conduct !== undefined ? (githubHealthData.has_code_of_conduct ? '✓' : '✗') : 'N/A'
        }
      },
      maintenanceFrequency: {
        rating: calculateMaintenanceFrequencyRating(githubData, githubActivityData),
        data: {
          isMaintained: githubData?.is_maintained !== undefined ? (githubData.is_maintained ? '✓' : '✗') : 'N/A',
          lastCodePush: formatLastPush(githubData?.last_code_push) || 'N/A',
          issuesCombined: formatIssuesCombined(githubActivityData?.open_issues_count, githubActivityData?.closed_issues_count),
          lastPrCreated: githubActivityData?.last_pr_info || 'N/A',
          lastPrMerged: formatLastPrMerged(githubActivityData?.last_pr_merged_at) || 'N/A',
          lastPrUrl: githubActivityData?.last_pr_url || null
        }
      }
    };
  };

  // Format downloads with commas
  function formatDownloads(downloads) {
    if (!downloads) return 'N/A';
    return downloads.toLocaleString();
  }

  // Format numbers with K/M suffixes
  function formatNumber(num) {
    if (!num) return 'N/A';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  }

  // Format last push date
  function formatLastPush(dateStr) {
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
  }

  // Calculate adoption rating based on downloads and GitHub metrics
  function calculateAdoptionRating(downloadData, githubData) {
    const monthly = downloadData?.monthly_downloads || 0;
    const stars = githubData?.stars || 0;
    
    // Strong: High downloads OR high stars
    if (monthly >= 1000000 || stars >= 10000) return 'Strong';
    // Moderate: Medium downloads OR medium stars
    if (monthly >= 100000 || stars >= 1000) return 'Moderate';
    return 'Limited';
  }

  // Calculate maintenance rating with GitHub data
  function calculateMaintenanceRating(npmData, githubData) {
    if (!npmData) return 'Infrequent';
    
    const daysSinceRelease = npmData.days_since_last_release;
    const releasesLastYear = npmData.releases_last_year;
    const isArchived = githubData?.is_archived;
    const isMaintained = githubData?.is_maintained;
    
    // If archived, definitely infrequent
    if (isArchived) return 'Infrequent';
    
    // If GitHub says it's maintained and has recent releases
    if (isMaintained && daysSinceRelease <= 90 && releasesLastYear >= 4) return 'Regular';
    
    // Based on npm data only
    if (daysSinceRelease <= 30 && releasesLastYear >= 12) return 'Regular';
    if (daysSinceRelease <= 90 && releasesLastYear >= 4) return 'Occasional';
    return 'Infrequent';
  }

  // Format combined PR info (merged date + creation time)
  function formatCombinedPrInfo(mergedAtStr, prInfo) {
    if (!mergedAtStr) return 'N/A';
    
    const mergedTimeAgo = formatLastPrMerged(mergedAtStr);
    if (mergedTimeAgo === 'N/A') return 'N/A';
    
    if (prInfo) {
      // Extract the time part from prInfo (e.g., "created 4 minutes before merge" -> "4 minutes")
      const timeMatch = prInfo.match(/created (.+?) before/);
      if (timeMatch) {
        return `${mergedTimeAgo} (${timeMatch[1]} after creation)`;
      }
    }
    
    return mergedTimeAgo;
  }

  // Format combined issues (open/closed)
  function formatIssuesCombined(openCount, closedCount) {
    if (!openCount && !closedCount) return 'N/A';
    
    const openFormatted = formatNumber(openCount) || '0';
    const closedFormatted = formatNumber(closedCount) || '0';
    
    return `${openFormatted} open / ${closedFormatted} closed`;
  }

  // Format last PR merged date
  function formatLastPrMerged(dateStr) {
    if (!dateStr) return 'N/A';
    
    try {
      const date = new Date(dateStr);
      const now = new Date();
      
      // Reset time to midnight for both dates to compare calendar days
      const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const diffInMs = nowOnly - dateOnly;
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) return 'Today';
      if (diffInDays === 1) return '1 day ago';
      if (diffInDays < 30) return `${diffInDays} days ago`;
      if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
      return `${Math.floor(diffInDays / 365)} years ago`;
    } catch {
      return 'N/A';
    }
  }

  // Calculate responsiveness rating based on GitHub activity data
  function calculateResponsivenessRating(activityData) {
    if (!activityData) return 'Backlogged';
    
    const openIssues = activityData.open_issues_count || 0;
    const totalIssues = activityData.total_issues_count || 0;
    const lastPrMergedAt = activityData.last_pr_merged_at;
    
    // Calculate open issues ratio
    const openIssuesRatio = totalIssues > 0 ? openIssues / totalIssues : 0;
    
    // Calculate days since last PR merge
    let daysSinceLastPr = null;
    if (lastPrMergedAt) {
      try {
        const lastPrDate = new Date(lastPrMergedAt);
        const now = new Date();
        daysSinceLastPr = Math.floor((now - lastPrDate) / (1000 * 60 * 60 * 24));
      } catch {
        daysSinceLastPr = null;
      }
    }
    
    // Responsive: Recent PR activity (≤14 days) AND manageable open issues (≤20%)
    if (daysSinceLastPr !== null && daysSinceLastPr <= 14 && openIssuesRatio <= 0.2) {
      return 'Responsive';
    }
    
    // Moderate: Some recent activity (≤30 days) AND balanced issue resolution (≤50%)
    if (daysSinceLastPr !== null && daysSinceLastPr <= 30 && openIssuesRatio <= 0.5) {
      return 'Moderate';
    }
    
    // Backlogged: Everything else (slow response times OR high open issues ratio OR no recent activity)
    return 'Backlogged';
  }

  // Calculate release management rating based on npm data
  function calculateReleaseManagementRating(npmData, githubData) {
    if (!npmData) return 'Infrequent';
    
    const daysSinceRelease = npmData.days_since_last_release;
    const releasesLastYear = npmData.releases_last_year;
    const isArchived = githubData?.is_archived;
    
    // If archived, definitely infrequent releases
    if (isArchived) return 'Infrequent';
    
    // Regular: Recent release AND frequent releases
    if (daysSinceRelease <= 30 && releasesLastYear >= 12) return 'Regular';
    
    // Occasional: Moderate release activity
    if (daysSinceRelease <= 90 && releasesLastYear >= 4) return 'Occasional';
    
    return 'Infrequent';
  }

  // Calculate maintenance frequency rating based on GitHub activity
  function calculateMaintenanceFrequencyRating(githubData, activityData) {
    if (!githubData && !activityData) return 'Infrequent';
    
    const isMaintained = githubData?.is_maintained;
    const isArchived = githubData?.is_archived;
    const lastCodePush = githubData?.last_code_push;
    const lastPrMergedAt = activityData?.last_pr_merged_at;
    
    // If archived, definitely infrequent
    if (isArchived) return 'Infrequent';
    
    // Calculate days since last code push
    let daysSinceCodePush = null;
    if (lastCodePush) {
      try {
        const pushDate = new Date(lastCodePush);
        const now = new Date();
        daysSinceCodePush = Math.floor((now - pushDate) / (1000 * 60 * 60 * 24));
      } catch {
        daysSinceCodePush = null;
      }
    }
    
    // Calculate days since last PR merge
    let daysSinceLastPr = null;
    if (lastPrMergedAt) {
      try {
        const lastPrDate = new Date(lastPrMergedAt);
        const now = new Date();
        daysSinceLastPr = Math.floor((now - lastPrDate) / (1000 * 60 * 60 * 24));
      } catch {
        daysSinceLastPr = null;
      }
    }
    
    // Regular: GitHub says it's maintained AND recent activity (code push within 30 days OR PR within 14 days)
    if (isMaintained && ((daysSinceCodePush !== null && daysSinceCodePush <= 30) || (daysSinceLastPr !== null && daysSinceLastPr <= 14))) {
      return 'Regular';
    }
    
    // Occasional: Some recent activity (code push within 90 days OR PR within 30 days)
    if ((daysSinceCodePush !== null && daysSinceCodePush <= 90) || (daysSinceLastPr !== null && daysSinceLastPr <= 30)) {
      return 'Occasional';
    }
    
    return 'Infrequent';
  }

  // Calculate documentation rating based on GitHub health data
  function calculateDocumentationRating(healthData) {
    if (!healthData) return 'Sparse';
    
    const healthPercentage = healthData.health_percentage || 0;
    const hasBasicFiles = healthData.has_readme && healthData.has_license;
    const hasAdvancedFiles = healthData.has_contributing && healthData.has_code_of_conduct;
    
    // Thorough: High health score AND all basic files AND at least one advanced file
    if (healthPercentage >= 80 && hasBasicFiles && (healthData.has_contributing || healthData.has_code_of_conduct)) {
      return 'Thorough';
    }
    
    // Adequate: Medium health score AND basic files
    if (healthPercentage >= 50 && hasBasicFiles) {
      return 'Adequate';
    }
    
    return 'Sparse';
  }

  function calculateFootprintRating(data) {
    if (!data) return 'Heavy';
    
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
          Package Health Extension
        </p>
      </div>
    </div>
  );
}