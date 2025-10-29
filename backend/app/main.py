"""MyLocalPlace Backend API - Main application entry point.

This module initializes and configures the FastAPI application,
including middleware, CORS, and router registration.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import (
    alerts_router,
    cleanup_router,
    containers_router,
    health_router,
    system_router,
    volumes_router,
)

# Create FastAPI application instance
app = FastAPI(
    title="MyLocalPlace API",
    description="Dashboard API for managing Docker containers and resources",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    contact={
        "name": "Lucas Biason",
        "url": "https://github.com/LucasBiason/my-local-place",
    },
)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React production
        "http://localhost:5173",  # Vite dev server
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(health_router)
app.include_router(containers_router)
app.include_router(system_router)
app.include_router(alerts_router)
app.include_router(volumes_router)
app.include_router(cleanup_router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
