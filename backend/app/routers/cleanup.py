"""Cleanup router - API endpoints for Docker cleanup operations."""

from fastapi import APIRouter, HTTPException, status

from app.controllers.cleanup_controller import CleanupController
from app.schemas.volume import CleanupResult

router = APIRouter(prefix="/api/v1/cleanup", tags=["Cleanup"])


@router.post("/all", response_model=CleanupResult)
async def cleanup_all() -> CleanupResult:
    """Run all cleanup operations.

    Removes:
    - Stopped containers
    - Unused images
    - Unused volumes
    - Build cache

    Returns:
        Cleanup statistics.

    Example:
        POST /api/v1/cleanup/all
    """
    try:
        result = CleanupController.cleanup_all()
        return CleanupResult(**result)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Cleanup failed: {str(e)}",
        )


@router.post("/containers", response_model=dict)
async def cleanup_containers() -> dict:
    """Remove stopped containers only."""
    try:
        return CleanupController.cleanup_containers()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )


@router.post("/volumes", response_model=dict)
async def cleanup_volumes() -> dict:
    """Remove unused volumes only."""
    try:
        return CleanupController.cleanup_volumes()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )


@router.post("/images", response_model=dict)
async def cleanup_images() -> dict:
    """Remove unused images only."""
    try:
        return CleanupController.cleanup_images()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )

