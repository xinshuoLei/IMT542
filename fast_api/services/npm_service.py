import httpx
import re
from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta

class PackageNotFoundError(Exception):
    """Exception raised when a package is not found."""
    pass

class PackageDataError(Exception):
    """Exception raised when there is an error processing package data."""
    pass

async def fetch_npm_metadata(package_name: str) -> Dict[str, Any]:
    """
    Fetch full metadata for a package from the npm registry.
    
    Args:
        package_name: Name of the npm package
        
    Returns:
        Dict containing package metadata
        
    Raises:
        PackageNotFoundError: If the package is not found
        httpx.HTTPStatusError: For other HTTP errors
    """
    url = f"https://registry.npmjs.org/{package_name}"
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                raise PackageNotFoundError(f"Package '{package_name}' not found") from e
            raise

def format_bundle_size(size_in_bytes: int) -> str:
    """
    Format a file size in bytes to a human-readable string using decimal units (1000-based),
    matching npm website's display format.
    
    Args:
        size_in_bytes: Size in bytes
        
    Returns:
        Formatted string like "9.21 MB" or "456.7 KB"
    """
    if size_in_bytes == 0:
        return "0 B"
        
    # Use 1000-based units to match npm website
    KB = 1000
    MB = KB * 1000
    GB = MB * 1000
    TB = GB * 1000
    
    if size_in_bytes < KB:
        return f"{size_in_bytes} B"
    elif size_in_bytes < MB:
        return f"{size_in_bytes / KB:.2f} KB"
    elif size_in_bytes < MB * 10:
        # For smaller MB values, use 2 decimal places
        return f"{size_in_bytes / MB:.2f} MB"
    elif size_in_bytes < GB:
        # For larger MB values, use 1 decimal place
        return f"{size_in_bytes / MB:.1f} MB"
    elif size_in_bytes < TB:
        return f"{size_in_bytes / GB:.2f} GB"
    else:
        return f"{size_in_bytes / TB:.2f} TB"

def clean_repository_url(repo_url: str) -> str:
    """
    Clean the repository URL by removing the git+ prefix and .git suffix.
    
    Args:
        repo_url: Repository URL from npm metadata
        
    Returns:
        Cleaned repository URL
    """
    if not repo_url:
        return ""
        
    # Remove git+ prefix if present
    cleaned_url = re.sub(r'^git\+', '', repo_url)
    # Remove .git suffix if present
    cleaned_url = re.sub(r'\.git$', '', cleaned_url)
    return cleaned_url

def extract_repository_url(repository_data: Any) -> str:
    """Extract repository URL from various formats and clean it."""
    if isinstance(repository_data, dict):
        url = repository_data.get("url", "")
    elif isinstance(repository_data, str):
        url = repository_data
    else:
        return ""
    
    return clean_repository_url(url)

def calculate_days_since_release(release_date_str: Optional[str]) -> Optional[int]:
    """
    Calculate days since a release date.
    
    Args:
        release_date_str: ISO format date string
        
    Returns:
        Number of days since the release, or None if date is invalid
    """
    if not release_date_str:
        return None
        
    try:
        release_date = datetime.fromisoformat(release_date_str.replace('Z', '+00:00')).replace(tzinfo=None)
        return (datetime.now() - release_date).days
    except ValueError:
        return None

def count_releases_last_year(time_info: Dict[str, str]) -> int:
    """
    Count the number of releases in the past year.
    
    Args:
        time_info: Time data from npm metadata
        
    Returns:
        Number of releases in the past year
    """
    one_year_ago = datetime.now() - timedelta(days=365)
    releases_last_year = 0
    
    for version, date_str in time_info.items():
        if version not in ['created', 'modified']:
            try:
                release_date = datetime.fromisoformat(date_str.replace('Z', '+00:00')).replace(tzinfo=None)
                if release_date >= one_year_ago:
                    releases_last_year += 1
            except ValueError:
                continue
    
    return releases_last_year

def count_maintainers(maintainers_data: List[Dict[str, str]]) -> int:
    """
    Count the number of maintainers for a package.
    
    Args:
        maintainers_data: List of maintainer objects from npm metadata
        
    Returns:
        Number of maintainers
    """
    return len(maintainers_data) if isinstance(maintainers_data, list) else 0

async def extract_npm_package_info(package_name: str) -> Dict[str, Any]:
    """
    Extract relevant information from npm package metadata.
    
    Args:
        package_name: Name of the npm package
        
    Returns:
        Dict containing extracted package information
        
    Raises:
        PackageNotFoundError: If the package is not found
        PackageDataError: If there is an error processing the package data
        httpx.HTTPStatusError: For HTTP errors other than 404
    """
    # Fetch the full metadata
    metadata = await fetch_npm_metadata(package_name)
    
    # Get the latest version
    latest_version = metadata.get("dist-tags", {}).get("latest")
    if not latest_version:
        raise PackageDataError(f"Could not determine latest version for {package_name}")
    
    # Get the version-specific info
    version_info = metadata.get("versions", {}).get(latest_version, {})
    if not version_info:
        raise PackageDataError(f"Could not retrieve version info for {package_name}@{latest_version}")
    
    # Get the time information
    time_info = metadata.get("time", {})
    last_release = time_info.get(latest_version)
    
    # Calculate maintenance metrics
    days_since_last_release = calculate_days_since_release(last_release)
    releases_last_year = count_releases_last_year(time_info)
    
    # Extract the repository URL
    repository_url = extract_repository_url(version_info.get("repository", {}))
    
    # Count dependencies
    dependencies = version_info.get("dependencies", {})
    dependencies_count = len(dependencies) if dependencies else 0
    
    # Get bundle size if available
    dist_info = version_info.get("dist", {})
    bundle_size_bytes = dist_info.get("unpackedSize", 0)
    bundle_size = format_bundle_size(bundle_size_bytes)
    
    # Count maintainers
    maintainers_count = count_maintainers(metadata.get("maintainers", []))
    
    # Get the description from metadata
    description = version_info.get("description", "")
    
    # Generate npm page URL
    npm_url = f"https://www.npmjs.com/package/{package_name}"
    
    return {
        "name": package_name,
        "latest_version": latest_version,
        "description": description,
        "license": version_info.get("license", ""),
        "homepage": version_info.get("homepage", ""),
        "bundle_size": bundle_size,
        "dependencies_count": dependencies_count,
        "repository": repository_url,
        "npm_url": npm_url,
        "last_release": last_release,
        "days_since_last_release": days_since_last_release,
        "releases_last_year": releases_last_year,
        "maintainers_count": maintainers_count
    }

async def fetch_npm_download_stats(package_name: str) -> Dict[str, Any]:
    """
    Fetch weekly download data for a package for the past 20 weeks
    and calculate the monthly download count from that data.
    
    Args:
        package_name: Name of the npm package
        
    Returns:
        Dict containing monthly download total and weekly download trend
        
    Raises:
        PackageNotFoundError: If the package is not found
        httpx.HTTPStatusError: For other HTTP errors
    """
    # Calculate date range for past 20 weeks
    end_date = datetime.now().date()
    start_date = end_date - timedelta(weeks=20)
    
    # Format dates for npm API
    start_str = start_date.strftime("%Y-%m-%d")
    end_str = end_date.strftime("%Y-%m-%d")
    
    # Create API URL
    url = f"https://api.npmjs.org/downloads/range/{start_str}:{end_str}/{package_name}"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
        
        # Process the data into weekly buckets
        daily_downloads = data.get("downloads", [])
        
        # Sort by date to ensure chronological order
        daily_downloads.sort(key=lambda x: x["day"])
        
        # Group into 7-day chunks working backwards from the end
        weekly_downloads = []
        
        # Ensure we have enough data
        if daily_downloads:
            # Calculate number of complete weeks available
            num_weeks = min(20, len(daily_downloads) // 7)
            
            for i in range(num_weeks):
                # Get 7 days for this week, working backwards from the end
                start_idx = len(daily_downloads) - (i + 1) * 7
                end_idx = len(daily_downloads) - i * 7
                
                week_data = daily_downloads[start_idx:end_idx]
                
                if week_data:
                    week_start_date = week_data[0]["day"]
                    week_end_date = week_data[-1]["day"]
                    week_total = sum(day["downloads"] for day in week_data)
                    
                    weekly_downloads.insert(0, {  # Insert at beginning to maintain chronological order
                        "start": week_start_date,
                        "end": week_end_date,
                        "downloads": week_total
                    })
        
        # Calculate monthly downloads (last 4 weeks)
        monthly_downloads = 0
        if weekly_downloads and len(weekly_downloads) >= 4:
            monthly_downloads = sum(week["downloads"] for week in weekly_downloads[-4:])
        
        return {
            "monthly_downloads": monthly_downloads,
            "weekly_trend": weekly_downloads
        }
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise PackageNotFoundError(f"Package '{package_name}' not found") from e
        raise