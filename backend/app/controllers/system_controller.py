"""System controller - Business logic for system resource monitoring.

This module handles system-level resource monitoring operations,
providing CPU, memory, and disk usage metrics for the host machine.
"""

import psutil
from fastapi import HTTPException, status

from app.schemas import SystemMetrics


class SystemController:
    """Handles system resource monitoring business logic.

    Provides methods for retrieving host system metrics including
    CPU usage, memory statistics, and disk space information.

    Example:
        >>> metrics = SystemController.get_metrics()
        >>> print(f"CPU: {metrics.cpu_percent}%")
        >>> print(f"RAM: {metrics.memory.used_gb}GB")
    """

    @staticmethod
    def get_metrics() -> SystemMetrics:
        """Get system resource metrics.

        Retrieves real-time CPU, memory, and disk usage statistics
        for the host machine where the application is running.

        Returns:
            SystemMetrics model with CPU, memory, and disk information.

        Raises:
            HTTPException: 500 if unable to retrieve system metrics.

        Example:
            >>> metrics = SystemController.get_metrics()
            >>> if metrics.cpu_percent > 80:
            ...     print("High CPU usage detected!")
            >>> if metrics.memory.percent > 90:
            ...     print("Low memory warning!")
        """
        try:
            return SystemMetrics(
                cpu_percent=psutil.cpu_percent(interval=1),
                memory={
                    "total_gb": round(
                        psutil.virtual_memory().total / 1024**3, 2
                    ),
                    "used_gb": round(
                        psutil.virtual_memory().used / 1024**3, 2
                    ),
                    "percent": psutil.virtual_memory().percent,
                },
                disk={
                    "total_gb": round(
                        psutil.disk_usage("/").total / 1024**3, 2
                    ),
                    "used_gb": round(
                        psutil.disk_usage("/").used / 1024**3, 2
                    ),
                    "percent": psutil.disk_usage("/").percent,
                },
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to get system metrics: {str(e)}",
            )
