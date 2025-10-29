"""Volume schemas for Docker volume management."""

from typing import Dict, List

from pydantic import BaseModel, Field


class VolumeInfo(BaseModel):
    """Volume information model."""

    name: str = Field(..., description="Volume name")
    driver: str = Field(..., description="Volume driver")
    mountpoint: str = Field(..., description="Mount point path")
    created: str = Field(..., description="Creation timestamp")
    labels: Dict[str, str] = Field(
        default_factory=dict, description="Volume labels"
    )
    scope: str = Field(..., description="Volume scope")


class CleanupResult(BaseModel):
    """Cleanup operation result."""

    containers_deleted: int = Field(
        default=0, description="Number of containers deleted"
    )
    images_deleted: int = Field(
        default=0, description="Number of images deleted"
    )
    volumes_deleted: int = Field(
        default=0, description="Number of volumes deleted"
    )
    total_freed_mb: float = Field(
        ..., description="Total space freed in MB"
    )

