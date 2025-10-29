"""Container schemas."""

from typing import List, Dict, Any
from pydantic import BaseModel, Field


class ContainerInfo(BaseModel):
    """Container information."""
    
    id: str = Field(..., description="Container short ID")
    name: str = Field(..., description="Container name")
    status: str = Field(..., description="Container status")
    state: str = Field(..., description="Container state")
    image: str = Field(..., description="Image name")
    ports: List[str] = Field(default_factory=list, description="Port mappings")
    created: str = Field(..., description="Creation timestamp")
    running: bool = Field(..., description="Is container running")


class ContainerAction(BaseModel):
    """Container action response."""
    
    status: str = Field(..., description="Action status")
    message: str = Field(..., description="Action message")


class ContainerStats(BaseModel):
    """Container resource statistics."""
    
    cpu_percent: float = Field(..., description="CPU usage percentage")
    memory_usage_mb: float = Field(..., description="Memory usage in MB")
    memory_limit_mb: float = Field(..., description="Memory limit in MB")
    memory_percent: float = Field(..., description="Memory usage percentage")
    network_rx_mb: float = Field(..., description="Network received in MB")
    network_tx_mb: float = Field(..., description="Network transmitted in MB")


class ContainerLogs(BaseModel):
    """Container logs."""
    
    container: str = Field(..., description="Container name")
    lines: List[str] = Field(..., description="Log lines")
    tail: int = Field(..., description="Number of lines returned")

