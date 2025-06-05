// Format downloads with commas
export function formatDownloads(downloads) {
  if (!downloads) return 'N/A';
  return downloads.toLocaleString();
}

// Format numbers with K/M suffixes
export function formatNumber(num) {
  if (!num) return 'N/A';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

// Format last push date
export function formatLastPush(dateStr) {
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

// Format last PR merged date
export function formatLastPrMerged(dateStr) {
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

// Format combined PR info (merged date + creation time)
export function formatCombinedPrInfo(mergedAtStr, prInfo) {
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
export function formatIssuesCombined(openCount, closedCount) {
  if (!openCount && !closedCount) return 'N/A';
  
  const openFormatted = formatNumber(openCount) || '0';
  const closedFormatted = formatNumber(closedCount) || '0';
  
  return `${openFormatted} open / ${closedFormatted} closed`;
}