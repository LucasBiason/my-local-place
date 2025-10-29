"""System router."""

from fastapi import APIRouter

from app.controllers import SystemController
from app.schemas import SystemMetrics

router = APIRouter(prefix="/api/v1/system", tags=["System"])


@router.get("/metrics", response_model=SystemMetrics)
async def get_system_metrics():
    """Get system resource metrics (CPU, RAM, Disk)."""
    return SystemController.get_metrics()

