"""Health check schema for API status monitoring.

This module defines the Pydantic model for health check responses,
used to verify API availability and Docker connectivity.
"""

from datetime import datetime

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    """Health check response model.

    Represents the API health status and connectivity information.

    Attributes:
        status: Health status ('healthy' or 'unhealthy').
        docker_connected: Docker daemon connectivity status.
        timestamp: ISO 8601 timestamp of the check.
        version: API version string.

    Example:
        >>> health = HealthResponse(
        ...     status="healthy",
        ...     docker_connected=True,
        ...     timestamp="2025-10-29T20:00:00.000000",
        ...     version="2.0.0"
        ... )
    """

    status: str = Field(..., description="Health status")
    docker_connected: bool = Field(..., description="Docker connection status")
    timestamp: str = Field(
        default_factory=lambda: datetime.utcnow().isoformat(),
        description="Timestamp",
    )
    version: str = Field(default="2.0.0", description="API version")

    class Config:
        """Pydantic configuration."""

        json_schema_extra = {
            "example": {
                "status": "healthy",
                "docker_connected": True,
                "timestamp": "2025-10-29T20:42:25.695125",
                "version": "2.0.0",
            }
        }
