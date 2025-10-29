"""System router - API endpoints for system resource monitoring.

This module defines REST API endpoints for retrieving host system
resource metrics including CPU, memory, and disk usage.
"""

from fastapi import APIRouter

from app.controllers import SystemController
from app.schemas import SystemMetrics

router = APIRouter(prefix="/api/v1/system", tags=["System"])


@router.get("/metrics", response_model=SystemMetrics)
async def get_system_metrics() -> SystemMetrics:
    """Get host system resource metrics.

    Retrieves real-time CPU usage, memory statistics, and disk space
    information for the host machine.

    Returns:
        System resource metrics.

    Raises:
        500: Failed to retrieve system metrics.

    Example:
        GET /api/v1/system/metrics

    Response:
        {
            "cpu_percent": 21.8,
            "memory": {
                "total_gb": 30.46,
                "used_gb": 18.61,
                "percent": 67.1
            },
            "disk": {
                "total_gb": 936.79,
                "used_gb": 583.07,
                "percent": 65.6
            }
        }
    """
    return SystemController.get_metrics()
