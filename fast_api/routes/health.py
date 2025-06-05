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