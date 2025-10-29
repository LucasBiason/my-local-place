"""System schemas for resource monitoring.

This module defines Pydantic models for system resource metrics,
including CPU, memory, and disk usage information.
"""

from pydantic import BaseModel, Field


class MemoryInfo(BaseModel):
    """Memory information model.

    Represents system memory statistics.

    Attributes:
        total_gb: Total system memory in gigabytes.
        used_gb: Currently used memory in gigabytes.
        percent: Memory usage as percentage (0-100).

    Example:
        >>> memory = MemoryInfo(
        ...     total_gb=32.0,
        ...     used_gb=18.5,
        ...     percent=57.8
        ... )
    """

    total_gb: float = Field(..., description="Total memory in GB")
    used_gb: float = Field(..., description="Used memory in GB")
    percent: float = Field(..., description="Memory usage percentage")

    class Config:
        """Pydantic configuration."""

        json_schema_extra = {
            "example": {"total_gb": 30.46, "used_gb": 18.61, "percent": 67.1}
        }


class DiskInfo(BaseModel):
    """Disk information model.

    Represents disk space statistics for root filesystem.

    Attributes:
        total_gb: Total disk space in gigabytes.
        used_gb: Currently used disk space in gigabytes.
        percent: Disk usage as percentage (0-100).

    Example:
        >>> disk = DiskInfo(
        ...     total_gb=1000.0,
        ...     used_gb=600.0,
        ...     percent=60.0
        ... )
    """

    total_gb: float = Field(..., description="Total disk space in GB")
    used_gb: float = Field(..., description="Used disk space in GB")
    percent: float = Field(..., description="Disk usage percentage")

    class Config:
        """Pydantic configuration."""

        json_schema_extra = {
            "example": {
                "total_gb": 936.79,
                "used_gb": 583.07,
                "percent": 65.6,
            }
        }


class SystemMetrics(BaseModel):
    """System resource metrics model.

    Aggregates CPU, memory, and disk usage information
    for the host system.

    Attributes:
        cpu_percent: CPU usage as percentage (0-100+).
        memory: Memory usage information.
        disk: Disk space information.

    Example:
        >>> metrics = SystemMetrics(
        ...     cpu_percent=25.5,
        ...     memory=MemoryInfo(total_gb=32.0, used_gb=18.5, percent=57.8),
        ...     disk=DiskInfo(total_gb=1000.0, used_gb=600.0, percent=60.0)
        ... )
    """

    cpu_percent: float = Field(..., description="CPU usage percentage")
    memory: MemoryInfo = Field(..., description="Memory information")
    disk: DiskInfo = Field(..., description="Disk information")

    class Config:
        """Pydantic configuration."""

        json_schema_extra = {
            "example": {
                "cpu_percent": 21.8,
                "memory": {
                    "total_gb": 30.46,
                    "used_gb": 18.61,
                    "percent": 67.1,
                },
                "disk": {
                    "total_gb": 936.79,
                    "used_gb": 583.07,
                    "percent": 65.6,
                },
            }
        }
