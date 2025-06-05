from fastapi import APIRouter, HTTPException, Query
from typing import Dict, List, Any
from urllib.parse import unquote
from services.npm_service import (
    extract_npm_package_info, 
    fetch_npm_download_stats,
    PackageNotFoundError,
    PackageDataError
)
import httpx
router = APIRouter(prefix="/npm")

@router.get("/metadata", response_model=Dict[str, Any])
async def get_npm_metadata(package: str = Query(..., description="The npm package name")):
    """
    Retrieve metadata about an npm package.
    
    Args:
        package (str): The name of the npm package (query parameter).
        
    Returns:
        dict: Package metadata including name, latest version, description, license,
              homepage, bundle size, dependencies count, repository URL, npm URL,
              last release date, days since last release, releases in the last year,
              and maintainer count.
              
    Example:
        Request: GET /npm/metadata?package=@antv/g6
        Response:
            {
                "name": "@antv/g6",
                "latest_version": "4.8.24",
                "description": "A Graph Visualization Framework in JavaScript",
                "license": "MIT",
                "homepage": "https://g6.antv.antgroup.com",
                "bundle_size": "1.2 MB",
                "dependencies_count": 15,
                "repository": "https://github.com/antvis/g6",
                "npm_url": "https://www.npmjs.com/package/@antv/g6",
                "last_release": "2025-03-15T10:30:45.123Z",
                "days_since_last_release": 45,
                "releases_last_year": 28,
                "maintainers_count": 5
            }
    """
    try:
        print(f"[DEBUG] Received package name: {package}")
        package_info = await extract_npm_package_info(package)
        return package_info
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise HTTPException(status_code=404, detail=f"Package '{package}' not found")
        raise HTTPException(status_code=e.response.status_code, detail=f"Error fetching npm metadata: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/downloads", response_model=Dict[str, Any])
async def get_npm_downloads(package: str = Query(..., description="The npm package name")):
    """
    Retrieve download statistics for an npm package, including weekly trend for the past 20 weeks.
    
    Args:
        package (str): The name of the npm package (query parameter).
        
    Returns:
        dict: An object containing total downloads and weekly download trend.
        
    Example:
        Request: GET /npm/downloads?package=@antv/g6
        Response:
            {
                "monthly_downloads": 45876941,
                "weekly_trend": [
                    {
                        "start": "2025-01-01",
                        "end": "2025-01-07",
                        "downloads": 2500000
                    },
                    {
                        "start": "2025-01-08",
                        "end": "2025-01-14",
                        "downloads": 2600000
                    },
                    ...
                ]
            }
    """
    try:
        print(f"[DEBUG] Received package name for downloads: {package}")
        download_stats = await fetch_npm_download_stats(package)
        return download_stats
    except PackageNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Error fetching download stats: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")