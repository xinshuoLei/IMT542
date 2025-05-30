from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import uvicorn

from routes import npm, github

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

@app.get("/")
async def root():
    """
    Welcome endpoint that introduces the API and lists available endpoints.
    
    Returns:
        dict: Information about the API and its available endpoints.
    """
    return {
        "message": "Welcome to the JavaScript Package Health API",
        "description": "This API aggregates health and usability signals for JavaScript packages from npm, GitHub, and other sources.",
        "version": "0.1.0",
        "available_endpoints": [
            {
                "path": "/npm/metadata/{package_name}",
                "description": "Get basic metadata about an npm package",
                "example": "/npm/metadata/react"
            },
            {
                "path": "/npm/downloads/month/{package_name}",
                "description": "Get monthly download count for an npm package",
                "example": "/npm/downloads/month/react"
            },
            {
                "path": "/npm/downloads/trend/{package_name}",
                "description": "Get daily download trends for the last month",
                "example": "/npm/downloads/trend/react"
            },
            {
                "path": "/github/repo/{owner}/{repo}",
                "description": "Get GitHub repository data like stars, forks, and issues",
                "example": "/github/repo/facebook/react"
            },
            {
                "path": "/github/health/{owner}/{repo}",
                "description": "Get GitHub community health metrics",
                "example": "/github/health/facebook/react"
            }
        ],
        "documentation": "/docs",
        "openapi_schema": "/openapi.json"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)