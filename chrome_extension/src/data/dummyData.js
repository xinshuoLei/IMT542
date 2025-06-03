export const dummyCategories = {
  communityAdoption: {
    rating: 'Strong',
    data: {
      monthlyDownloads: '45,876,941',
      stars: '178,954',
      forks: '36,874'
    }
  },
  maintenanceFrequency: {
    rating: 'Regular',
    data: {
      daysSinceLastRelease: '12',
      releasesLastYear: '24',
      lastCodePush: '2 days ago',
      maintainersCount: '12'
    }
  },
  implementationFootprint: {
    rating: 'Moderate',
    data: {
      bundleSize: '42.2 KB',
      dependenciesCount: '2'
    }
  },
  documentationCompleteness: {
    rating: 'Thorough',
    data: {
      healthPercentage: '100%',
      hasReadme: true,
      hasLicense: true,
      hasContributing: true,
      hasCodeOfConduct: true
    }
  },
  supportResponsiveness: {
    rating: 'Responsive',
    data: {
      openIssues: '1,052',
      lastPrMerged: '3 days ago'
    }
  }
};

export const categories = [
  { key: 'communityAdoption', title: 'Community Adoption' },
  { key: 'maintenanceFrequency', title: 'Maintenance Frequency' },
  { key: 'implementationFootprint', title: 'Implementation Footprint' },
  { key: 'documentationCompleteness', title: 'Documentation Completeness' },
  { key: 'supportResponsiveness', title: 'Support Responsiveness' }
];

export const PACKAGE_NAME = 'echarts';