"""Container schemas for request/response validation.

This module defines Pydantic models for Docker container-related
data structures, ensuring type safety and automatic validation.
"""

from typing import Any, Dict, List

from pydantic import BaseModel, Field


class ContainerInfo(BaseModel):
    """Container information model.

    Represents detailed information about a Docker container,
    including its state, configuration, and runtime details.

    Attributes:
        id: Container short ID (12 characters).
        name: Unique container name.
        status: Current status (e.g., 'running', 'exited').
        state: Detailed state information.
        image: Docker image name or ID.
        ports: List of port mappings (e.g., ['8000:80/tcp']).
        created: ISO 8601 creation timestamp.
        running: True if container is currently running.

    Example:
        >>> info = ContainerInfo(
        ...     id="abc123",
        ...     name="postgres",
        ...     status="running",
        ...     state="running",
        ...     image="postgres:17",
        ...     ports=["5432:5432/tcp"],
        ...     created="2025-10-29T10:00:00Z",
        ...     running=True
        ... )
    """

    id: str = Field(..., description="Container short ID")
    name: str = Field(..., description="Container name")
    status: str = Field(..., description="Container status")
    state: str | Dict[str, Any] = Field(..., description="Container state")
    image: str = Field(..., description="Image name")
    ports: List[str] = Field(default_factory=list, description="Port mappings")
    created: str = Field(..., description="Creation timestamp")
    running: bool = Field(..., description="Is container running")

    class Config:
        """Pydantic configuration."""

        json_schema_extra = {
            "example": {
                "id": "abc123def456",
                "name": "local-postgres",
                "status": "running",
                "state": "running",
                "image": "postgres:17",
                "ports": ["5432:5432/tcp"],
                "created": "2025-10-29T10:00:00Z",
                "running": True,
            }
        }


class ContainerAction(BaseModel):
    """Container action response model.

    Represents the result of a container action operation
    (start, stop, restart).

    Attributes:
        status: Operation status ('success' or 'error').
        message: Human-readable result message.

    Example:
        >>> action = ContainerAction(
        ...     status="success",
        ...     message="Container postgres started"
        ... )
    """

    status: str = Field(..., description="Action status")
    message: str = Field(..., description="Action message")

    class Config:
        """Pydantic configuration."""

        json_schema_extra = {
            "example": {
                "status": "success",
                "message": "Container local-postgres started",
            }
        }


class ContainerStats(BaseModel):
    """Container resource statistics model.

    Represents real-time resource usage metrics for a container.

    Attributes:
        cpu_percent: CPU usage as percentage (0-100+).
        memory_usage_mb: Current memory usage in megabytes.
        memory_limit_mb: Memory limit in megabytes.
        memory_percent: Memory usage as percentage.
        network_rx_mb: Total network received in megabytes.
        network_tx_mb: Total network transmitted in megabytes.

    Example:
        >>> stats = ContainerStats(
        ...     cpu_percent=2.5,
        ...     memory_usage_mb=150.5,
        ...     memory_limit_mb=2048.0,
        ...     memory_percent=7.35,
        ...     network_rx_mb=10.5,
        ...     network_tx_mb=5.2
        ... )
    """

    cpu_percent: float = Field(..., description="CPU usage percentage")
    memory_usage_mb: float = Field(..., description="Memory usage in MB")
    memory_limit_mb: float = Field(..., description="Memory limit in MB")
    memory_percent: float = Field(..., description="Memory usage percentage")
    network_rx_mb: float = Field(..., description="Network received in MB")
    network_tx_mb: float = Field(..., description="Network transmitted in MB")

    class Config:
        """Pydantic configuration."""

        json_schema_extra = {
            "example": {
                "cpu_percent": 2.45,
                "memory_usage_mb": 156.8,
                "memory_limit_mb": 2048.0,
                "memory_percent": 7.66,
                "network_rx_mb": 12.34,
                "network_tx_mb": 6.78,
            }
        }


class ContainerLogs(BaseModel):
    """Container logs model.

    Represents log output from a Docker container.

    Attributes:
        container: Name or ID of the container.
        lines: List of log lines with timestamps.
        tail: Number of lines returned.

    Example:
        >>> logs = ContainerLogs(
        ...     container="postgres",
        ...     lines=["2025-10-29T10:00:00Z Starting...",
        ...            "2025-10-29T10:00:01Z Ready"],
        ...     tail=2
        ... )
    """

    container: str = Field(..., description="Container name")
    lines: List[str] = Field(..., description="Log lines")
    tail: int = Field(..., description="Number of lines returned")

    class Config:
        """Pydantic configuration."""

        json_schema_extra = {
            "example": {
                "container": "local-postgres",
                "lines": [
                    "2025-10-29T10:00:00Z PostgreSQL started",
                    "2025-10-29T10:00:01Z Listening on port 5432",
                ],
                "tail": 2,
            }
        }
