"""System controller - business logic."""

import psutil
from fastapi import HTTPException, status

from app.schemas import SystemMetrics


class SystemController:
    """Handles system-related business logic."""
    
    @staticmethod
    def get_metrics() -> SystemMetrics:
        """Get system resource metrics."""
        try:
            return SystemMetrics(
                cpu_percent=psutil.cpu_percent(interval=1),
                memory={
                    "total_gb": round(psutil.virtual_memory().total / 1024**3, 2),
                    "used_gb": round(psutil.virtual_memory().used / 1024**3, 2),
                    "percent": psutil.virtual_memory().percent
                },
                disk={
                    "total_gb": round(psutil.disk_usage('/').total / 1024**3, 2),
                    "used_gb": round(psutil.disk_usage('/').used / 1024**3, 2),
                    "percent": psutil.disk_usage('/').percent
                }
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to get system metrics: {str(e)}"
            )

