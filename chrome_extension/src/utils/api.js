const API_BASE_URL = 'http://localhost:8000';

export async function fetchNpmMetadata(packageName) {
  try {
    const response = await fetch(`${API_BASE_URL}/npm/metadata/${packageName}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching npm metadata:', error);
    throw error;
  }
}

export async function fetchNpmDownloads(packageName) {
  try {
    const response = await fetch(`${API_BASE_URL}/npm/downloads/${packageName}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching npm downloads:', error);
    throw error;
  }
}

export async function fetchGitHubRepo(owner, repo) {
  try {
    const response = await fetch(`${API_BASE_URL}/github/repo/${owner}/${repo}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching GitHub repo data:', error);
    throw error;
  }
}

export async function fetchGitHubHealth(owner, repo) {
  try {
    const response = await fetch(`${API_BASE_URL}/github/health/${owner}/${repo}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching GitHub health data:', error);
    throw error;
  }
}

export async function fetchGitHubActivity(owner, repo) {
  try {
    const response = await fetch(`${API_BASE_URL}/github/activity/${owner}/${repo}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching GitHub activity data:', error);
    throw error;
  }
}

// NEW: npm search function - calls npm API directly
export async function searchNpmPackages(query, size = 10) {
  try {
    const response = await fetch(
      `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(query)}&size=${size}`
    );
    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`);
    }
    const data = await response.json();
    return data.objects.map(obj => ({
      name: obj.package.name,
      description: obj.package.description,
      version: obj.package.version,
      keywords: obj.package.keywords || [],
      date: obj.package.date,
      publisher: obj.package.publisher?.username || 'Unknown',
      maintainers: obj.package.maintainers || []
    }));
  } catch (error) {
    console.error('npm search error:', error);
    throw error;
  }
}

// Utility function to extract GitHub owner and repo from repository URL
export function extractGitHubInfo(repositoryUrl) {
  if (!repositoryUrl) return null;
  
  // Match GitHub URLs like https://github.com/owner/repo
  const match = repositoryUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;
  
  return {
    owner: match[1],
    repo: match[2]
  };
}