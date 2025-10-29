"""Alert schemas for resource monitoring."""

from typing import List

from pydantic import BaseModel, Field


class Alert(BaseModel):
    """Alert model.

    Represents a resource alert.
    """

    type: str = Field(..., description="Alert type")
    level: str = Field(..., description="Alert level (info/warning/critical)")
    message: str = Field(..., description="Alert message")
    value: float = Field(..., description="Resource value")


class AlertsResponse(BaseModel):
    """Alerts response model."""

    alerts: List[Alert] = Field(..., description="List of active alerts")
    critical_count: int = Field(..., description="Number of critical alerts")
    warning_count: int = Field(..., description="Number of warnings")
    info_count: int = Field(..., description="Number of info alerts")

