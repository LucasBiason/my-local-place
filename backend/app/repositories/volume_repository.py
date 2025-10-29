"""Volume repository - Data access layer for Docker volumes.

Provides data access layer for Docker volume operations.
"""

from typing import Any, Dict, List

from docker.errors import APIError, NotFound

from app.core import docker_client


class VolumeRepository:
    """Repository for Docker volume operations.

    Handles Docker volume listing, inspection, and pruning.

    Example:
        >>> repo = VolumeRepository()
        >>> volumes = repo.list_volumes()
        >>> unused = repo.get_unused_volumes()
    """

    def __init__(self) -> None:
        """Initialize repository with Docker client."""
        self.client = docker_client.client

    def list_volumes(self) -> List[Dict[str, Any]]:
        """List all Docker volumes.

        Returns:
            List of volume information dictionaries.

        Example:
            >>> repo = VolumeRepository()
            >>> volumes = repo.list_volumes()
            >>> total_size = sum(v['size_mb'] for v in volumes)
        """
        volumes = self.client.volumes.list()

        return [
            {
                "name": v.name,
                "driver": v.attrs.get("Driver", "local"),
                "mountpoint": v.attrs.get("Mountpoint", ""),
                "created": v.attrs.get("CreatedAt", ""),
                "labels": v.attrs.get("Labels") or {},
                "scope": v.attrs.get("Scope", "local"),
            }
            for v in volumes
        ]

    def get_volume_details(self, name: str) -> Dict[str, Any]:
        """Get detailed volume information.

        Args:
            name: Volume name.

        Returns:
            Dictionary with volume details.

        Raises:
            ValueError: If volume not found.
        """
        try:
            volume = self.client.volumes.get(name)
            return {
                "name": volume.name,
                "driver": volume.attrs.get("Driver", "local"),
                "mountpoint": volume.attrs.get("Mountpoint", ""),
                "created": volume.attrs.get("CreatedAt", ""),
                "labels": volume.attrs.get("Labels") or {},
                "scope": volume.attrs.get("Scope", "local"),
                "options": volume.attrs.get("Options") or {},
            }
        except NotFound:
            raise ValueError(f"Volume {name} not found")

    def prune_volumes(self) -> Dict[str, Any]:
        """Remove unused volumes.

        Returns:
            Dictionary with prune results.

        Example:
            >>> repo = VolumeRepository()
            >>> result = repo.prune_volumes()
            >>> print(f"Freed: {result['space_reclaimed_mb']}MB")
        """
        try:
            result = self.client.volumes.prune()
            return {
                "volumes_deleted": len(result.get("VolumesDeleted") or []),
                "space_reclaimed_bytes": result.get("SpaceReclaimed", 0),
                "space_reclaimed_mb": round(
                    result.get("SpaceReclaimed", 0) / 1024 / 1024, 2
                ),
            }
        except APIError as e:
            raise RuntimeError(f"Failed to prune volumes: {e}")

    def get_unused_volumes(self) -> List[str]:
        """Get list of unused volume names.

        Returns:
            List of volume names not in use.

        Example:
            >>> repo = VolumeRepository()
            >>> unused = repo.get_unused_volumes()
            >>> print(f"{len(unused)} volumes unused")
        """
        all_volumes = {v.name for v in self.client.volumes.list()}
        used_volumes = set()

        for container in self.client.containers.list(all=True):
            for mount in container.attrs.get("Mounts", []):
                if mount.get("Type") == "volume":
                    used_volumes.add(mount.get("Name"))

        return list(all_volumes - used_volumes)

