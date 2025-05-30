from fastapi import APIRouter, HTTPException
from typing import Dict, List, Any
from services.npm_service import (
    extract_npm_package_info, 
    fetch_npm_download_stats,
    PackageNotFoundError,
    PackageDataError
)
import httpx
router = APIRouter(prefix="/npm")

@router.get("/metadata/{package_name}", response_model=Dict[str, Any])
async def get_npm_metadata(package_name: str):
    """
    Retrieve metadata about an npm package.
    
    Args:
        package_name (str): The name of the npm package.
        
    Returns:
        dict: Package metadata including name, latest version, description, license,
              homepage, bundle size, dependencies count, repository URL, npm URL,
              last release date, days since last release, releases in the last year,
              and maintainer count.
              
    Example:
        Request: GET /npm/metadata/react-is
        Response:
            {
                "name": "react-is",
                "latest_version": "19.1.0",
                "description": "Brand checking of React Elements.",
                "license": "MIT",
                "homepage": "https://react.dev/",
                "bundle_size": "13.60 KB",
                "dependencies_count": 0,
                "repository": "https://github.com/facebook/react",
                "npm_url": "https://www.npmjs.com/package/react-is",
                "last_release": "2025-03-28T20:00:12.918Z",
                "days_since_last_release": 60,
                "releases_last_year": 556,
                "maintainers_count": 2
            }
    """
    try:
        package_info = await extract_npm_package_info(package_name)
        return package_info
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise HTTPException(status_code=404, detail=f"Package '{package_name}' not found")
        raise HTTPException(status_code=e.response.status_code, detail=f"Error fetching npm metadata: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/downloads/{package_name}", response_model=Dict[str, Any])
async def get_npm_downloads(package_name: str):
    """
    Retrieve download statistics for an npm package, including weekly trend for the past 20 weeks.
    
    Args:
        package_name (str): The name of the npm package.
        
    Returns:
        dict: An object containing total downloads and weekly download trend.
        
    Example:
        Request: GET /npm/downloads/react
        Response:
            {
                "downloads": 45876941,
                "download_trend": [
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
        download_stats = await fetch_npm_download_stats(package_name)
        return download_stats
    except PackageNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Error fetching download stats: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")