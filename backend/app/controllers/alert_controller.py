"""Alert controller - Business logic for resource alerts.

Monitors system resources and generates alerts when thresholds are exceeded.
"""

import psutil
from typing import Dict, List

from app.repositories.docker_repository import DockerRepository
from app.repositories.volume_repository import VolumeRepository


class AlertController:
    """Handles resource monitoring and alerting.

    Checks CPU, memory, disk usage and container/volume states.

    Example:
        >>> alerts = AlertController.check_all()
        >>> critical = [a for a in alerts if a['level'] == 'critical']
    """

    # Thresholds
    CPU_WARNING = 80.0
    CPU_CRITICAL = 95.0
    MEMORY_WARNING = 85.0
    MEMORY_CRITICAL = 95.0
    DISK_WARNING = 85.0
    DISK_CRITICAL = 95.0

    @staticmethod
    def check_all() -> List[Dict[str, str]]:
        """Check all resources and return alerts.

        Returns:
            List of alert dictionaries with type, level, message.

        Example:
            >>> alerts = AlertController.check_all()
            >>> for alert in alerts:
            ...     print(f"{alert['level']}: {alert['message']}")
        """
        alerts = []

        # System resources
        cpu = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory().percent
        disk = psutil.disk_usage("/").percent

        # CPU alerts
        if cpu >= AlertController.CPU_CRITICAL:
            alerts.append(
                {
                    "type": "cpu",
                    "level": "critical",
                    "message": f"CPU usage critically high: {cpu:.1f}%",
                    "value": cpu,
                }
            )
        elif cpu >= AlertController.CPU_WARNING:
            alerts.append(
                {
                    "type": "cpu",
                    "level": "warning",
                    "message": f"CPU usage high: {cpu:.1f}%",
                    "value": cpu,
                }
            )

        # Memory alerts
        if memory >= AlertController.MEMORY_CRITICAL:
            alerts.append(
                {
                    "type": "memory",
                    "level": "critical",
                    "message": f"Memory usage critically high: {memory:.1f}%",
                    "value": memory,
                }
            )
        elif memory >= AlertController.MEMORY_WARNING:
            alerts.append(
                {
                    "type": "memory",
                    "level": "warning",
                    "message": f"Memory usage high: {memory:.1f}%",
                    "value": memory,
                }
            )

        # Disk alerts
        if disk >= AlertController.DISK_CRITICAL:
            alerts.append(
                {
                    "type": "disk",
                    "level": "critical",
                    "message": f"Disk usage critically high: {disk:.1f}%",
                    "value": disk,
                }
            )
        elif disk >= AlertController.DISK_WARNING:
            alerts.append(
                {
                    "type": "disk",
                    "level": "warning",
                    "message": f"Disk usage high: {disk:.1f}%",
                    "value": disk,
                }
            )

        # Check unused containers
        try:
            docker_repo = DockerRepository()
            containers = docker_repo.list_containers(all=True)
            stopped = [c for c in containers if not c["running"]]

            if len(stopped) > 5:
                alerts.append(
                    {
                        "type": "containers",
                        "level": "info",
                        "message": f"{len(stopped)} stopped containers consuming resources",
                        "value": len(stopped),
                    }
                )
        except Exception:
            pass

        # Check unused volumes
        try:
            volume_repo = VolumeRepository()
            unused = volume_repo.get_unused_volumes()

            if len(unused) > 3:
                alerts.append(
                    {
                        "type": "volumes",
                        "level": "warning",
                        "message": f"{len(unused)} unused volumes detected",
                        "value": len(unused),
                    }
                )
        except Exception:
            pass

        return alerts

