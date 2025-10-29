"""Health check schema."""

from pydantic import BaseModel, Field
from datetime import datetime


class HealthResponse(BaseModel):
    """Health check response."""
    
    status: str = Field(..., description="Health status")
    docker_connected: bool = Field(..., description="Docker connection status")
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat(), description="Timestamp")
    version: str = Field(default="2.0.0", description="API version")

