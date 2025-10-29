"""System schemas."""

from typing import Dict
from pydantic import BaseModel, Field


class MemoryInfo(BaseModel):
    """Memory information."""
    
    total_gb: float = Field(..., description="Total memory in GB")
    used_gb: float = Field(..., description="Used memory in GB")
    percent: float = Field(..., description="Memory usage percentage")


class DiskInfo(BaseModel):
    """Disk information."""
    
    total_gb: float = Field(..., description="Total disk space in GB")
    used_gb: float = Field(..., description="Used disk space in GB")
    percent: float = Field(..., description="Disk usage percentage")


class SystemMetrics(BaseModel):
    """System resource metrics."""
    
    cpu_percent: float = Field(..., description="CPU usage percentage")
    memory: MemoryInfo = Field(..., description="Memory information")
    disk: DiskInfo = Field(..., description="Disk information")

