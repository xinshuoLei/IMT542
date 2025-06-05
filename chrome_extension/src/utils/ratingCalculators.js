// Calculate adoption rating based on downloads and GitHub metrics
export function calculateAdoptionRating(downloadData, githubData, loading = false, error = null) {
  if (loading) return 'Loading';
  if (error) return 'Error';
  
  const monthly = downloadData?.monthly_downloads || 0;
  const stars = githubData?.stars || 0;
  
  // Strong: High downloads OR high stars
  if (monthly >= 1000000 || stars >= 10000) return 'Strong';
  // Moderate: Medium downloads OR medium stars
  if (monthly >= 100000 || stars >= 1000) return 'Moderate';
  return 'Limited';
}

// Calculate maintenance rating with GitHub data
export function calculateMaintenanceRating(npmData, githubData) {
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

// Calculate responsiveness rating based on GitHub activity data
export function calculateResponsivenessRating(activityData) {
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
export function calculateReleaseManagementRating(npmData, githubData) {
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
export function calculateMaintenanceFrequencyRating(githubData, githubActivityData, loading = false, error = null) {
  if (loading) return 'Loading';
  if (error) return 'Error';
  if (!githubData && !githubActivityData) return 'Unavailable';
  
  const isMaintained = githubData?.is_maintained;
  const isArchived = githubData?.is_archived;
  const lastCodePush = githubData?.last_code_push;
  const lastPrMergedAt = githubActivityData?.last_pr_merged_at;
  
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
export function calculateDocumentationRating(healthData, loading = false, error = null) {
  if (loading) return 'Loading';
  if (error) return 'Error';
  if (!healthData) return 'Unavailable';
  
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

export function calculateFootprintRating(data) {
  if (!data) return 'Heavy';
  
  const sizeInKB = parseFloat(data.bundle_size?.replace(/[^\d.]/g, '') || '0');
  const deps = data.dependencies_count || 0;
  
  if (sizeInKB < 100 && deps < 5) return 'Lightweight';
  if (sizeInKB < 500 && deps < 15) return 'Moderate';
  return 'Heavy';
}