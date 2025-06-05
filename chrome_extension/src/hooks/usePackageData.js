import { useState } from 'react';
import { 
  fetchNpmMetadata, 
  fetchNpmDownloads, 
  fetchGitHubRepo, 
  fetchGitHubHealth, 
  fetchGitHubActivity, 
  extractGitHubInfo 
} from '../utils/api';

export function usePackageData() {
  const [packageData, setPackageData] = useState(null);
  const [downloadsData, setDownloadsData] = useState(null);
  const [githubData, setGithubData] = useState(null);
  const [githubHealthData, setGithubHealthData] = useState(null);
  const [githubActivityData, setGithubActivityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPackageData = async (packageName) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch npm data first
      const [npmData, downloadStats] = await Promise.all([
        fetchNpmMetadata(packageName),
        fetchNpmDownloads(packageName)
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
  };

  const clearPackageData = () => {
    setPackageData(null);
    setDownloadsData(null);
    setGithubData(null);
    setGithubHealthData(null);
    setGithubActivityData(null);
    setError(null);
  };

  return {
    packageData,
    downloadsData,
    githubData,
    githubHealthData,
    githubActivityData,
    loading,
    error,
    loadPackageData,
    clearPackageData
  };
}