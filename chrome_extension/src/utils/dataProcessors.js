import { 
  calculateAdoptionRating, 
  calculateReleaseManagementRating, 
  calculateFootprintRating, 
  calculateDocumentationRating, 
  calculateMaintenanceFrequencyRating 
} from './ratingCalculators';
import { 
  formatDownloads, 
  formatNumber, 
  formatLastPush, 
  formatIssuesCombined, 
  formatLastPrMerged 
} from './formatters';

// Create categories with real data where available
export function getCategoriesData(packageData, downloadsData, githubData, githubHealthData, githubActivityData, loading = false, error = null) {
  return {
    communityAdoption: {
      rating: calculateAdoptionRating(downloadsData, githubData, loading, error),
      data: {
        monthlyDownloads: formatDownloads(downloadsData?.monthly_downloads),
        stars: formatNumber(githubData?.stars) || 'N/A',
        forks: formatNumber(githubData?.forks) || 'N/A'
      }
    },
    releaseManagement: {
      rating: calculateReleaseManagementRating(packageData, githubData, loading, error),
      data: {
        daysSinceLastRelease: packageData?.days_since_last_release?.toString() || 'N/A',
        releasesLastYear: packageData?.releases_last_year?.toString() || 'N/A',
        isArchived: githubData?.is_maintained === false && githubData?.is_archived !== undefined 
          ? (githubData.is_archived ? '✓' : '✗') 
          : null,
        maintainersCount: packageData?.maintainers_count?.toString() || 'N/A'
      }
    },
    implementationFootprint: {
      rating: calculateFootprintRating(packageData, loading, error),
      data: {
        bundleSize: packageData?.bundle_size || 'N/A',
        dependenciesCount: packageData?.dependencies_count?.toString() || 'N/A'
      }
    },
    documentationCompleteness: {
      rating: calculateDocumentationRating(githubHealthData, loading, error),
      data: {
        healthPercentage: githubHealthData?.health_percentage 
          ? `${githubHealthData.health_percentage}%` 
          : 'N/A',
        hasReadme: githubHealthData?.has_readme !== undefined 
          ? (githubHealthData.has_readme ? '✓' : '✗') 
          : 'N/A',
        hasLicense: githubHealthData?.has_license !== undefined 
          ? (githubHealthData.has_license ? '✓' : '✗') 
          : 'N/A',
        hasContributing: githubHealthData?.has_contributing !== undefined 
          ? (githubHealthData.has_contributing ? '✓' : '✗') 
          : 'N/A',
        hasCodeOfConduct: githubHealthData?.has_code_of_conduct !== undefined 
          ? (githubHealthData.has_code_of_conduct ? '✓' : '✗') 
          : 'N/A'
      }
    },
    maintenanceFrequency: {
      rating: calculateMaintenanceFrequencyRating(githubData, githubActivityData, loading, error),
      data: {
        isMaintained: githubData?.is_maintained !== undefined 
          ? (githubData.is_maintained ? '✓' : '✗') 
          : 'N/A',
        lastCodePush: formatLastPush(githubData?.last_code_push) || 'N/A',
        issuesCombined: formatIssuesCombined(
          githubActivityData?.open_issues_count, 
          githubActivityData?.closed_issues_count
        ),
        lastPrCreated: githubActivityData?.last_pr_info || 'N/A',
        lastPrMerged: formatLastPrMerged(githubActivityData?.last_pr_merged_at) || 'N/A',
        lastPrUrl: githubActivityData?.last_pr_url || null
      }
    }
  };
}