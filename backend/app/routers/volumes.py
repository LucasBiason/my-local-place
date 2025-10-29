"""Volumes router - API endpoints for volume management."""

from typing import List

from fastapi import APIRouter, HTTPException, status

from app.repositories.volume_repository import VolumeRepository
from app.schemas.volume import VolumeInfo

router = APIRouter(prefix="/api/v1/volumes", tags=["Volumes"])

repository = VolumeRepository()


@router.get("", response_model=List[VolumeInfo])
async def list_volumes() -> List[VolumeInfo]:
    """List all Docker volumes.

    Returns:
        List of volume information.
    """
    try:
        volumes = repository.list_volumes()
        return [VolumeInfo(**v) for v in volumes]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list volumes: {str(e)}",
        )


@router.get("/unused", response_model=List[str])
async def get_unused_volumes() -> List[str]:
    """Get list of unused volume names.

    Returns:
        List of unused volume names.
    """
    try:
        return repository.get_unused_volumes()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get unused volumes: {str(e)}",
        )

