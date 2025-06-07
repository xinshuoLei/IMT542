from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import uvicorn

from routes import npm, github, health

app = FastAPI(
    title="JavaScript Package Health API",
    description="API that aggregates health and usability signals for JavaScript packages from npm, GitHub, and other sources.",
    version="0.1.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your extension's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers from route modules
app.include_router(npm.router, tags=["npm"])
app.include_router(github.router, tags=["github"])
app.include_router(health.router, tags=["health"])

@app.get("/")
async def root():
    """
    Welcome endpoint that introduces the API and lists available endpoints.
    
    Returns:
        dict: Information about the API and its available endpoints.
    """
    return {
        "message": "Welcome to the JavaScript Package Health & Usability API",
        "description": "This API aggregates health and usability signals for JavaScript packages from npm, GitHub, and other sources.",
        "available_endpoints": [
            {
                "path": "/health/?package={package_name}",
                "description": "Returns comprehensive health and usability data for an npm package",
                "example": "/health?package=react"
            },
            {
                "path": "/health/rating-criteria",
                "description": "Returns rating criteria and thresholds used for calculating package health ratings",
                "example": "/health/rating-criteria"
            },
            {
                "path": "/npm/metadata?package={package_name}",
                "description": "Returns basic metadata about an npm package",
                "example": "/npm/metadata?package=react"
            },
            {
                "path": "/npm/downloads?package={package_name}",
                "description": "Returns download statistics for an npm package",
                "example": "/npm/downloads?package=react"
            },
            {
                "path": "/github/repo/{owner}/{repo}",
                "description": "Returns GitHub repository data like stars, forks, and issues",
                "example": "/github/repo/facebook/react"
            },
            {
                "path": "/github/health/{owner}/{repo}",
                "description": "Returns GitHub community health metrics",
                "example": "/github/health/facebook/react"
            },
            {
                "path": "/github/activity/{owner}/{repo}",
                "description": "Returns GitHub activity and contribution metrics",
                "example": "/github/activity/facebook/react"
            }
        ],
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)