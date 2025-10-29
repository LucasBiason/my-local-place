"""Health router - API endpoints for health checks.

This module defines REST API endpoints for verifying API availability
and Docker daemon connectivity.
"""

from app.core import docker_client
from app.schemas import HealthResponse
from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get("/", response_model=HealthResponse)
@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """Health check endpoint.

    Verifies API is running and Docker daemon is accessible.
    This endpoint is exposed at both root (/) and /health paths.

    Returns:
        Health status with Docker connectivity and timestamp.

    Example:
        GET /
        GET /health

    Response:
        {
            "status": "healthy",
            "docker_connected": true,
            "timestamp": "2025-10-29T20:42:25.695125",
            "version": "2.0.0"
        }
    """
    return HealthResponse(
        status="healthy", docker_connected=docker_client.is_connected()
    )
