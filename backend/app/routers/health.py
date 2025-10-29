"""Health check router."""

from fastapi import APIRouter

from app.core import docker_client
from app.schemas import HealthResponse

router = APIRouter(tags=["Health"])


@router.get("/", response_model=HealthResponse)
@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return HealthResponse(
        status="healthy",
        docker_connected=docker_client.is_connected()
    )

