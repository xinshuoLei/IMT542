import React from 'react';
import { Download, Star, GitFork, Calendar, Package, FileText, AlertCircle } from 'lucide-react';
import MetricRow from './MetricRow';
import DownloadTrendChart from './DownloadTrendChart';

export default function CategoryMetrics({ category, data, loading = false, downloadsData = null }) {
  switch (category) {
    case 'communityAdoption':
      return (
        <>
          <MetricRow icon={Download} label="Monthly Downloads" value={data.monthlyDownloads} loading={loading} />
          <MetricRow icon={Star} label="GitHub Stars" value={data.stars} loading={loading} />
          <MetricRow icon={GitFork} label="GitHub Forks" value={data.forks} loading={loading} />
          {downloadsData?.weekly_trend && (
            <DownloadTrendChart weeklyTrend={downloadsData.weekly_trend} />
          )}
        </>
      );
    case 'maintenanceFrequency':
      return (
        <>
          <MetricRow icon={Calendar} label="Days Since Last Release" value={data.daysSinceLastRelease} loading={loading} />
          <MetricRow icon={Package} label="Releases Last Year" value={data.releasesLastYear} loading={loading} />
          <MetricRow icon={Calendar} label="Last Code Push" value={data.lastCodePush} loading={loading} />
          <MetricRow icon={Star} label="Maintainers" value={data.maintainersCount} loading={loading} />
        </>
      );
    case 'implementationFootprint':
      return (
        <>
          <MetricRow icon={Package} label="Bundle Size" value={data.bundleSize} loading={loading} />
          <MetricRow icon={Package} label="Dependencies" value={data.dependenciesCount} loading={loading} />
        </>
      );
    case 'documentationCompleteness':
      return (
        <>
          <MetricRow icon={FileText} label="Health Score" value={data.healthPercentage} loading={loading} />
          <MetricRow icon={FileText} label="README" value={data.hasReadme ? '✓' : '✗'} loading={loading} />
          <MetricRow icon={FileText} label="License" value={data.hasLicense ? '✓' : '✗'} loading={loading} />
          <MetricRow icon={FileText} label="Contributing Guide" value={data.hasContributing ? '✓' : '✗'} loading={loading} />
          <MetricRow icon={FileText} label="Code of Conduct" value={data.hasCodeOfConduct ? '✓' : '✗'} loading={loading} />
        </>
      );
    case 'supportResponsiveness':
      return (
        <>
          <MetricRow icon={AlertCircle} label="Open Issues" value={data.openIssues} loading={loading} />
          <MetricRow icon={Calendar} label="Last PR Merged" value={data.lastPrMerged} loading={loading} />
        </>
      );
    default:
      return null;
  }
}