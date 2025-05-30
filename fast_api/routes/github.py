# routes/github.py
from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from services.github_service import (
    fetch_github_repo_data, 
    fetch_github_community_health,
    fetch_github_contribution_metrics,
    RepositoryNotFoundError, 
    GitHubAPIError
)

router = APIRouter(prefix="/github")

@router.get("/repo/{owner}/{repo}", response_model=Dict[str, Any])
async def get_github_repo_data(owner: str, repo: str):
    """
    Retrieve essential repository health data from GitHub.
    
    Args:
        owner (str): The GitHub username or organization that owns the repository.
        repo (str): The name of the repository.
        
    Returns:
        dict: Key repository health metrics including stars, forks,
              maintenance status, and last code push information.
        
    Example:
        Request: GET /github/repo/facebook/react
        Response:
            {
                "stars": 178954,
                "forks": 36874,
                "last_code_push": "2025-05-22T15:30:10Z",
                "is_archived": false,
                "is_maintained": true
            }
    """
    try:
        repo_data = await fetch_github_repo_data(owner, repo)
        return repo_data
    except RepositoryNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except GitHubAPIError as e:
        raise HTTPException(status_code=429 if "rate limit" in str(e).lower() else 500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/health/{owner}/{repo}", response_model=Dict[str, Any])
async def get_github_community_health(owner: str, repo: str):
    """
    Retrieve community health metrics for a GitHub repository.
    
    Args:
        owner (str): The GitHub username or organization that owns the repository.
        repo (str): The name of the repository.
        
    Returns:
        dict: Community health metrics including health percentage and 
              presence of recommended community files.
        
    Example:
        Request: GET /github/health/facebook/react
        Response:
            {
                "health_percentage": 85,
                "has_readme": true,
                "has_license": true,
                "has_contributing": true,
                "has_code_of_conduct": true
            }
    """
    try:
        health_data = await fetch_github_community_health(owner, repo)
        return health_data
    except RepositoryNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except GitHubAPIError as e:
        raise HTTPException(status_code=429 if "rate limit" in str(e).lower() else 500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/activity/{owner}/{repo}", response_model=Dict[str, Any])
async def get_github_activity_metrics(owner: str, repo: str):
    """
    Retrieve comprehensive activity metrics for a GitHub repository,
    including issues and pull request statistics.
    
    Args:
        owner (str): The GitHub username or organization that owns the repository.
        repo (str): The name of the repository.
        
    Returns:
        dict: Activity metrics for the repository, including:
            - Issue counts (open, closed, total)
            - PR information (when last PR was merged and how long it took)
        
    Example:
        Request: GET /github/activity/facebook/react
        Response:
            {
                "open_issues_count": 1052,
                "closed_issues_count": 11516,
                "total_issues_count": 12568,
                "last_pr_merged_at": "2025-05-27T12:34:56Z",
                "last_pr_merge_time": {
                    "days": 3.5,
                    "human_readable": "3 days, 12 hours"
                }
            }
    """
    try:
        activity_data = await fetch_github_contribution_metrics(owner, repo)
        return activity_data
    except RepositoryNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except GitHubAPIError as e:
        raise HTTPException(status_code=429 if "rate limit" in str(e).lower() else 500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")