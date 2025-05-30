import httpx
import os
import asyncio
from typing import Dict, Any, Optional, List, Tuple
from datetime import datetime, timedelta
from dateutil import relativedelta

from dotenv import load_dotenv
load_dotenv()  # Load environment variables from .env file

# Get GitHub token from environment variable (once, outside functions)
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")

class RepositoryNotFoundError(Exception):
    """Exception raised when a GitHub repository is not found."""
    pass

class GitHubAPIError(Exception):
    """Exception raised when there is an error with the GitHub API."""
    pass

def format_time_difference(created_date: datetime, closed_date: datetime) -> Dict[str, Any]:
    """
    Calculate and format the time difference between two datetime objects.
    For times less than a day, shows hours.
    For times more than a day, shows only days.
    
    Args:
        created_date: When the item was created
        closed_date: When the item was closed or merged
        
    Returns:
        Dict containing time difference in days and human-readable format
    """
    # Calculate total time in days for numeric comparison
    total_seconds = (closed_date - created_date).total_seconds()
    days_difference = total_seconds / (60 * 60 * 24)
    
    # Format the human readable string based on duration
    if days_difference < 1:
        # Less than a day, show hours
        hours = total_seconds / 3600
        if hours < 1:
            minutes = total_seconds / 60
            human_readable = f"{int(minutes)} minute{'s' if minutes != 1 else ''}"
        else:
            human_readable = f"{int(hours)} hour{'s' if hours != 1 else ''}"
    else:
        # More than a day, show only days (rounded)
        days = round(days_difference)
        human_readable = f"{days} day{'s' if days != 1 else ''}"
    
    return {
        "days": round(days_difference, 2),
        "human_readable": human_readable
    }

async def fetch_github_repo_data(owner: str, repo: str) -> Dict[str, Any]:
    """
    Fetch essential repository health data from GitHub API.
    
    Args:
        owner: Repository owner (username or organization)
        repo: Repository name
        
    Returns:
        Dict containing repository health metrics
        
    Raises:
        RepositoryNotFoundError: If the repository is not found
        GitHubAPIError: If there is an error with the GitHub API
        httpx.HTTPStatusError: For other HTTP errors
    """
    url = f"https://api.github.com/repos/{owner}/{repo}"
    
    headers = {
        # Set User-Agent to avoid 403 errors
        "User-Agent": "JavaScript-Package-Health-API",
    }
    
    # Add authentication if token is available
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            repo_data = response.json()
            
            # Extract only the most relevant health and usability metrics
            pushed_at = repo_data.get("pushed_at")
            
            return {
                "stars": repo_data.get("stargazers_count", 0),
                "forks": repo_data.get("forks_count", 0),
                "last_code_push": pushed_at,  # Return the raw ISO date string
                "is_archived": repo_data.get("archived", False),
                "is_maintained": not repo_data.get("archived", False) and 
                                (pushed_at is not None and 
                                 calculate_days_since_date(pushed_at) <= 365)
            }
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise RepositoryNotFoundError(f"Repository '{owner}/{repo}' not found") from e
        elif e.response.status_code == 403 and "rate limit exceeded" in e.response.text.lower():
            raise GitHubAPIError("GitHub API rate limit exceeded, try again later") from e
        raise GitHubAPIError(f"GitHub API error: {str(e)}") from e
    except Exception as e:
        raise GitHubAPIError(f"Error fetching GitHub repository data: {str(e)}") from e
        
async def fetch_github_community_health(owner: str, repo: str) -> Dict[str, Any]:
    """
    Fetch community health data from GitHub API.
    
    Args:
        owner: Repository owner (username or organization)
        repo: Repository name
        
    Returns:
        Dict containing community health metrics
        
    Raises:
        RepositoryNotFoundError: If the repository is not found
        GitHubAPIError: If there is an error with the GitHub API
        httpx.HTTPStatusError: For other HTTP errors
    """
    url = f"https://api.github.com/repos/{owner}/{repo}/community/profile"
    
    headers = {
        # Set User-Agent to avoid 403 errors
        "User-Agent": "JavaScript-Package-Health-API",
    }
    
    # Add authentication if token is available
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            health_data = response.json()
            
            # Extract the health percentage and file presence information
            files = health_data.get("files", {})
            
            return {
                "health_percentage": health_data.get("health_percentage", 0),
                "has_readme": "readme" in files,
                "has_license": "license" in files,
                "has_contributing": "contributing" in files,
                "has_code_of_conduct": "code_of_conduct" in files
            }
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise RepositoryNotFoundError(f"Repository community profile for '{owner}/{repo}' not found") from e
        elif e.response.status_code == 403 and "rate limit exceeded" in e.response.text.lower():
            raise GitHubAPIError("GitHub API rate limit exceeded, try again later") from e
        raise GitHubAPIError(f"GitHub API error: {str(e)}") from e
    except Exception as e:
        raise GitHubAPIError(f"Error fetching GitHub community health data: {str(e)}") from e

async def fetch_github_issues_data(owner: str, repo: str) -> Dict[str, Any]:
    """
    Fetch issues metrics data from GitHub API.
    
    Args:
        owner: Repository owner (username or organization)
        repo: Repository name
        
    Returns:
        Dict containing issues metrics including open and closed counts
        
    Raises:
        RepositoryNotFoundError: If the repository is not found
        GitHubAPIError: If there is an error with the GitHub API
        httpx.HTTPStatusError: For other HTTP errors
    """
    # URLs for GitHub Search API to get issue counts
    open_issues_url = f"https://api.github.com/search/issues?q=repo:{owner}/{repo}+is:issue+is:open"
    closed_issues_url = f"https://api.github.com/search/issues?q=repo:{owner}/{repo}+is:issue+is:closed"
    
    headers = {
        "User-Agent": "JavaScript-Package-Health-API",
        "Accept": "application/vnd.github.v3+json"
    }
    
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
    
    try:
        async with httpx.AsyncClient() as client:
            # Make concurrent requests for efficiency
            open_issues_response, closed_issues_response = await asyncio.gather(
                client.get(open_issues_url, headers=headers),
                client.get(closed_issues_url, headers=headers)
            )
            
            # Check for errors
            open_issues_response.raise_for_status()
            closed_issues_response.raise_for_status()
            
            # Parse JSON responses
            open_issues_data = open_issues_response.json()
            closed_issues_data = closed_issues_response.json()
            
            # Get issue counts
            open_issues_count = open_issues_data.get("total_count", 0)
            closed_issues_count = closed_issues_data.get("total_count", 0)
            total_issues_count = open_issues_count + closed_issues_count
            
            return {
                "open_issues_count": open_issues_count,
                "closed_issues_count": closed_issues_count,
                "total_issues_count": total_issues_count
            }
    except Exception as e:
        raise GitHubAPIError(f"Error fetching GitHub issues data: {str(e)}") from e
    except Exception as e:
        raise GitHubAPIError(f"Error fetching GitHub issues data: {str(e)}") from e

async def fetch_github_pr_data(owner: str, repo: str) -> Dict[str, Any]:
    """
    Fetch pull request metrics data from GitHub API.
    
    Args:
        owner: Repository owner (username or organization)
        repo: Repository name
        
    Returns:
        Dict containing PR metrics including when the last PR was merged
        and how long it took to merge
        
    Raises:
        RepositoryNotFoundError: If the repository is not found
        GitHubAPIError: If there is an error with the GitHub API
        httpx.HTTPStatusError: For other HTTP errors
    """
    # URL for the most recently merged PR
    recent_merged_url = f"https://api.github.com/search/issues?q=repo:{owner}/{repo}+is:pr+is:merged&sort=updated&order=desc&per_page=1"
    
    headers = {
        "User-Agent": "JavaScript-Package-Health-API",
        "Accept": "application/vnd.github.v3+json"
    }
    
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
    
    try:
        async with httpx.AsyncClient() as client:
            # Make request for recent merged PR
            recent_merged_response = await client.get(recent_merged_url, headers=headers)
            recent_merged_response.raise_for_status()
            
            # Parse JSON response
            recent_merged_prs = recent_merged_response.json()
            
            # Get information about the most recently merged PR
            last_merged_at = None
            last_pr_info = None
            last_pr_url = None
            
            if recent_merged_prs and "items" in recent_merged_prs and len(recent_merged_prs["items"]) > 0:
                pr_info = recent_merged_prs["items"][0]
                pr_number = pr_info.get("number")
                last_pr_url = pr_info.get("html_url")
                
                # We need to get the PR details to get the merged_at timestamp
                pr_detail_url = f"https://api.github.com/repos/{owner}/{repo}/pulls/{pr_number}"
                pr_detail_response = await client.get(pr_detail_url, headers=headers)
                pr_detail_response.raise_for_status()
                
                pr_detail = pr_detail_response.json()
                created_at = pr_detail.get("created_at")
                merged_at = pr_detail.get("merged_at")
                
                if created_at and merged_at:
                    created_date = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                    merged_date = datetime.fromisoformat(merged_at.replace('Z', '+00:00'))
                    
                    last_merged_at = merged_at
                    time_diff = format_time_difference(created_date, merged_date)
                    
                    # Just provide the creation time info
                    last_pr_info = f"created {time_diff['human_readable']} ago"
            
            return {
                "last_pr_merged_at": last_merged_at,
                "last_pr_info": last_pr_info,
                "last_pr_url": last_pr_url
            }
    except Exception as e:
        raise GitHubAPIError(f"Error fetching GitHub PR data: {str(e)}") from e
    except Exception as e:
        raise GitHubAPIError(f"Error fetching GitHub PR data: {str(e)}") from e
    except Exception as e:
        raise GitHubAPIError(f"Error fetching GitHub PR data: {str(e)}") from e

async def fetch_github_contribution_metrics(owner: str, repo: str) -> Dict[str, Any]:
    """
    Fetch comprehensive contribution metrics for a repository.
    
    Args:
        owner: Repository owner (username or organization)
        repo: Repository name
        
    Returns:
        Dict containing both issues and PR metrics
        
    Raises:
        RepositoryNotFoundError: If the repository is not found
        GitHubAPIError: If there is an error with the GitHub API
    """
    try:
        # Fetch both issues and PR data concurrently
        issues_data, pr_data = await asyncio.gather(
            fetch_github_issues_data(owner, repo),
            fetch_github_pr_data(owner, repo)
        )
        
        # Combine the results
        return {
            **issues_data,
            **pr_data
        }
    except Exception as e:
        if isinstance(e, RepositoryNotFoundError):
            raise
        raise GitHubAPIError(f"Error fetching GitHub contribution metrics: {str(e)}") from e

def calculate_days_since_date(date_str: Optional[str]) -> Optional[int]:
    """
    Calculate days since a date string in ISO format.
    Used internally for determining if a repository is maintained.
    
    Args:
        date_str: ISO format date string
        
    Returns:
        Number of days since the date, or None if date is invalid
    """
    if not date_str:
        return None
        
    try:
        date = datetime.fromisoformat(date_str.replace('Z', '+00:00')).replace(tzinfo=None)
        return (datetime.now() - date).days
    except ValueError:
        return None