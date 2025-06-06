from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any
import logging
from services.health_service import get_comprehensive_package_health
from services.npm_service import PackageNotFoundError

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/health")

@router.get("/", response_model=Dict[str, Any])
async def get_package_health(package: str = Query(..., description="The npm package name")):
    """
    Retrieve comprehensive health and usability data for an npm package.
    This endpoint combines npm metadata, download statistics, and GitHub metrics
    into a single response for efficient frontend consumption.
    
    Args:
        package (str): The name of the npm package (query parameter).
        
    Returns:
        dict: Complete package health data including:
            - package_name: Name of the analyzed package
            - retrieved_at: ISO timestamp when the data was fetched
            - npm metadata (name, version, description, dependencies, etc.)
            - download statistics (monthly downloads, weekly trend)
            - github data (stars, forks, maintenance info, health metrics, activity)
            - calculated health ratings for each category
        
    Example:
        Request: GET /health?package=react
        Response:
            {
                "package_name": "react",
                "retrieved_at": "2025-06-04T15:30:45.123Z",
                "npm_data": { ... },
                "downloads_data": { ... },
                "github_data": { ... },
                "health_ratings": {
                    "community_adoption": "Strong",
                    "maintenance_frequency": "Regular", 
                    "release_management": "Regular",
                    "implementation_footprint": "Moderate",
                    "documentation_completeness": "Thorough"
                },
                "success": true,
                "errors": []
            }
    """
    try:
        logger.info(f"Health endpoint called for package: {package}")
        result = await get_comprehensive_package_health(package)
        return result
        
    except PackageNotFoundError as e:
        logger.error(f"Package not found: {package}")
        raise HTTPException(status_code=404, detail=f"Package '{package}' not found")
    except Exception as e:
        logger.error(f"Unexpected error in health endpoint for {package}: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/rating-criteria", response_model=Dict[str, Any])
async def get_rating_criteria():
    """
    Retrieve the rating criteria and thresholds used for calculating package health ratings.
    This endpoint provides transparency into how ratings are calculated.
    
    Returns:
        dict: Complete rating criteria for all health categories
        
    Example:
        Request: GET /health/rating-criteria
    """
    return {
        "community_adoption": {
            "description": "Measures how widely the package is used and supported",
            "data_sources": ["npm monthly downloads", "github stars", "github forks"],
            "thresholds": {
                "strong": "monthly_downloads >= 1M OR github_stars >= 10K",
                "moderate": "monthly_downloads >= 100K OR github_stars >= 1K",
                "limited": "below moderate thresholds"
            }
        },
        "maintenance_frequency": {
            "description": "Indicates how actively the package is being maintained",
            "data_sources": ["github archived status", "github maintained status", "last code push", "last pr merge"],
            "thresholds": {
                "regular": "github_maintained AND (code_push <= 30 days OR pr_merge <= 14 days)",
                "occasional": "code_push <= 90 days OR pr_merge <= 30 days",
                "infrequent": "above thresholds OR archived repository"
            }
        },
        "release_management": {
            "description": "Measures how regularly new versions are released",
            "data_sources": ["npm days since last release", "npm releases in past year", "github archived status"],
            "thresholds": {
                "regular": "days_since_release <= 30 AND releases_last_year >= 12",
                "occasional": "days_since_release <= 90 AND releases_last_year >= 4",
                "infrequent": "above thresholds OR archived repository"
            }
        },
        "implementation_footprint": {
            "description": "Assesses the technical impact of adding the package",
            "data_sources": ["npm bundle size", "npm dependencies count"],
            "thresholds": {
                "lightweight": "bundle_size < 100KB AND dependencies < 5",
                "moderate": "bundle_size < 500KB AND dependencies < 15",
                "heavy": "above moderate thresholds"
            }
        },
        "documentation_completeness": {
            "description": "Evaluates how well the package is documented",
            "data_sources": ["github community health score", "readme file", "license file", "contributing guide", "code of conduct"],
            "thresholds": {
                "thorough": "health >= 80% AND readme AND license AND (contributing OR code_of_conduct)",
                "adequate": "health >= 50% AND readme AND license",
                "sparse": "below adequate thresholds"
            }
        }
    }