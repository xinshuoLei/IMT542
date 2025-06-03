import React from 'react';
import { Download, Star, GitFork, Calendar, Package, FileText, AlertCircle, CheckCircle, Archive, HelpCircle, ExternalLink } from 'lucide-react';
import MetricRow from './MetricRow';
import DownloadTrendChart from './DownloadTrendChart';
import HealthScoreRow from './HealthScoreRow';
import LastPrSection from './LastPrSection';

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
    case 'releaseManagement':
      return (
        <>
          <MetricRow icon={Calendar} label="Days Since Last Release" value={data.daysSinceLastRelease} loading={loading} />
          <MetricRow icon={Package} label="Releases Last Year" value={data.releasesLastYear} loading={loading} />
          {data.isArchived !== null && (
            <MetricRow icon={Archive} label="Is Archived" value={data.isArchived} loading={loading} />
          )}
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
          <HealthScoreRow value={data.healthPercentage} loading={loading} />
          <MetricRow icon={FileText} label="README" value={data.hasReadme} loading={loading} />
          <MetricRow icon={FileText} label="License" value={data.hasLicense} loading={loading} />
          <MetricRow icon={FileText} label="Contributing Guide" value={data.hasContributing} loading={loading} />
          <MetricRow icon={FileText} label="Code of Conduct" value={data.hasCodeOfConduct} loading={loading} />
        </>
      );
    case 'maintenanceFrequency':
      return (
        <>
          <MetricRow icon={CheckCircle} label="Is Maintained" value={data.isMaintained} loading={loading} />
          <MetricRow icon={Calendar} label="Last Code Push" value={data.lastCodePush} loading={loading} />
          <MetricRow icon={AlertCircle} label="Issues" value={data.issuesCombined} loading={loading} />
          <LastPrSection 
            created={data.lastPrCreated} 
            mergedAt={data.lastPrMerged} 
            url={data.lastPrUrl} 
            loading={loading} 
          />
        </>
      );
    default:
      return null;
  }
}