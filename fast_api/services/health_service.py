import re
import logging
from typing import Dict, Any, Optional
from datetime import datetime
from services.npm_service import (
    extract_npm_package_info, 
    fetch_npm_download_stats,
    PackageNotFoundError,
    PackageDataError
)
from services.github_service import (
    fetch_github_repo_data, 
    fetch_github_community_health,
    fetch_github_contribution_metrics,
    RepositoryNotFoundError, 
    GitHubAPIError
)

# Set up logging
logger = logging.getLogger(__name__)

async def get_comprehensive_package_health(package_name: str) -> Dict[str, Any]:
    """
    Fetch comprehensive health and usability data for an npm package.
    
    Args:
        package_name: Name of the npm package to analyze
        
    Returns:
        Dict containing all package health data, ratings, and any errors
        
    Raises:
        PackageNotFoundError: If the npm package doesn't exist
    """
    logger.info(f"Fetching comprehensive health data for package: {package_name}")
    
    # Add timestamp for when data was retrieved
    retrieved_at = datetime.utcnow().isoformat() + "Z"
    
    # Initialize response structure
    response = {
        "package_name": package_name,
        "retrieved_at": retrieved_at,
        "npm_data": None,
        "downloads_data": None,
        "github_data": {
            "repo": None,
            "health": None,
            "activity": None
        },
        "health_ratings": {},
        "success": True,
        "errors": []
    }
    
    # Step 1: Fetch npm data (required)
    try:
        npm_data = await extract_npm_package_info(package_name)
        response["npm_data"] = npm_data
        logger.info(f"Successfully fetched npm metadata for {package_name}")
    except PackageNotFoundError:
        logger.error(f"Package not found: {package_name}")
        raise
    except Exception as e:
        logger.error(f"Error fetching npm data for {package_name}: {e}")
        response["errors"].append(f"npm_metadata_error: {str(e)}")
        response["success"] = False
    
    # Step 2: Fetch download data
    try:
        downloads_data = await fetch_npm_download_stats(package_name)
        response["downloads_data"] = downloads_data
        logger.info(f"Successfully fetched download stats for {package_name}")
    except Exception as e:
        logger.error(f"Error fetching download data for {package_name}: {e}")
        response["errors"].append(f"npm_downloads_error: {str(e)}")
    
    # Step 3: Extract GitHub info and fetch GitHub data (optional)
    github_info = None
    if response["npm_data"] and response["npm_data"].get("repository"):
        github_info = extract_github_info(response["npm_data"]["repository"])
    
    if github_info:
        # Fetch all GitHub data concurrently
        github_tasks = [
            ("repo", fetch_github_repo_data(github_info["owner"], github_info["repo"])),
            ("health", fetch_github_community_health(github_info["owner"], github_info["repo"])),
            ("activity", fetch_github_contribution_metrics(github_info["owner"], github_info["repo"]))
        ]
        
        # Execute all GitHub API calls
        for github_type, task in github_tasks:
            try:
                github_result = await task
                response["github_data"][github_type] = github_result
                logger.info(f"Successfully fetched GitHub {github_type} data for {github_info['owner']}/{github_info['repo']}")
            except (RepositoryNotFoundError, GitHubAPIError) as e:
                logger.warning(f"GitHub {github_type} error for {package_name}: {e}")
                response["errors"].append(f"github_{github_type}_error: {str(e)}")
            except Exception as e:
                logger.error(f"Unexpected GitHub {github_type} error for {package_name}: {e}")
                response["errors"].append(f"github_{github_type}_error: {str(e)}")
    else:
        logger.info(f"No GitHub repository found for {package_name}")
        response["errors"].append("no_github_repository")
    
    # Step 4: Calculate health ratings
    response["health_ratings"] = calculate_health_ratings(
        response["npm_data"],
        response["downloads_data"], 
        response["github_data"]
    )
    
    # Step 5: Determine overall success
    response["success"] = response["npm_data"] is not None
    
    logger.info(f"Health data compilation completed for {package_name} - Success: {response['success']}")
    return response


def extract_github_info(repository_url: str) -> Optional[Dict[str, str]]:
    """
    Extract GitHub owner and repo from repository URL.
    
    Args:
        repository_url: Repository URL from npm metadata
        
    Returns:
        Dict with owner and repo, or None if not a GitHub URL
    """
    if not repository_url:
        return None
        
    # Match GitHub URLs like https://github.com/owner/repo
    match = re.search(r'github\.com/([^/]+)/([^/]+)', repository_url)
    if not match:
        return None
        
    return {
        "owner": match.group(1),
        "repo": match.group(2).replace('.git', '')  # Remove .git suffix if present
    }


def calculate_health_ratings(npm_data: Optional[Dict], downloads_data: Optional[Dict], github_data: Dict) -> Dict[str, str]:
    """
    Calculate health ratings for all categories based on available data.
    
    Args:
        npm_data: npm package metadata
        downloads_data: npm download statistics  
        github_data: GitHub repository data (repo, health, activity)
        
    Returns:
        Dict with calculated ratings for each health category
    """
    ratings = {}
    
    # Community Adoption Rating
    try:
        monthly_downloads = downloads_data.get("monthly_downloads", 0) if downloads_data else 0
        stars = github_data.get("repo", {}).get("stars", 0) if github_data.get("repo") else 0
        
        if monthly_downloads >= 1000000 or stars >= 10000:
            ratings["community_adoption"] = "Strong"
        elif monthly_downloads >= 100000 or stars >= 1000:
            ratings["community_adoption"] = "Moderate"
        else:
            ratings["community_adoption"] = "Limited"
    except Exception:
        ratings["community_adoption"] = "Unavailable"
    
    # Maintenance Frequency Rating
    try:
        if not github_data.get("repo") or not github_data.get("activity"):
            ratings["maintenance_frequency"] = "Unavailable"
        else:
            repo_data = github_data["repo"]
            activity_data = github_data["activity"]
            
            is_archived = repo_data.get("is_archived", False)
            is_maintained = repo_data.get("is_maintained", False)
            last_pr_merged_at = activity_data.get("last_pr_merged_at")
            
            if is_archived:
                ratings["maintenance_frequency"] = "Infrequent"
            elif is_maintained and last_pr_merged_at:
                # Calculate days since last PR
                try:
                    last_pr_date = datetime.fromisoformat(last_pr_merged_at.replace('Z', '+00:00'))
                    days_since_pr = (datetime.now(last_pr_date.tzinfo) - last_pr_date).days
                    
                    if days_since_pr <= 14:
                        ratings["maintenance_frequency"] = "Regular"
                    elif days_since_pr <= 30:
                        ratings["maintenance_frequency"] = "Occasional"
                    else:
                        ratings["maintenance_frequency"] = "Infrequent"
                except Exception:
                    ratings["maintenance_frequency"] = "Occasional"
            else:
                ratings["maintenance_frequency"] = "Infrequent"
    except Exception:
        ratings["maintenance_frequency"] = "Unavailable"
    
    # Release Management Rating
    try:
        if not npm_data:
            ratings["release_management"] = "Unavailable"
        else:
            days_since_release = npm_data.get("days_since_last_release", 999)
            releases_last_year = npm_data.get("releases_last_year", 0)
            is_archived = github_data.get("repo", {}).get("is_archived", False) if github_data.get("repo") else False
            
            if is_archived:
                ratings["release_management"] = "Infrequent"
            elif days_since_release <= 30 and releases_last_year >= 12:
                ratings["release_management"] = "Regular"
            elif days_since_release <= 90 and releases_last_year >= 4:
                ratings["release_management"] = "Occasional"
            else:
                ratings["release_management"] = "Infrequent"
    except Exception:
        ratings["release_management"] = "Unavailable"
    
    # Implementation Footprint Rating
    try:
        if not npm_data:
            ratings["implementation_footprint"] = "Unavailable"
        else:
            bundle_size_str = npm_data.get("bundle_size", "0")
            size_in_kb = float(re.sub(r'[^\d.]', '', bundle_size_str) or '0')
            deps_count = npm_data.get("dependencies_count", 0)
            
            if size_in_kb < 100 and deps_count < 5:
                ratings["implementation_footprint"] = "Lightweight"
            elif size_in_kb < 500 and deps_count < 15:
                ratings["implementation_footprint"] = "Moderate"
            else:
                ratings["implementation_footprint"] = "Heavy"
    except Exception:
        ratings["implementation_footprint"] = "Unavailable"
    
    # Documentation Completeness Rating
    try:
        if not github_data.get("health"):
            ratings["documentation_completeness"] = "Unavailable"
        else:
            health_data = github_data["health"]
            health_percentage = health_data.get("health_percentage", 0)
            has_readme = health_data.get("has_readme", False)
            has_license = health_data.get("has_license", False)
            has_contributing = health_data.get("has_contributing", False)
            has_code_of_conduct = health_data.get("has_code_of_conduct", False)
            
            if health_percentage >= 80 and has_readme and has_license and (has_contributing or has_code_of_conduct):
                ratings["documentation_completeness"] = "Thorough"
            elif health_percentage >= 50 and has_readme and has_license:
                ratings["documentation_completeness"] = "Adequate"
            else:
                ratings["documentation_completeness"] = "Sparse"
    except Exception:
        ratings["documentation_completeness"] = "Unavailable"
    
    return ratings