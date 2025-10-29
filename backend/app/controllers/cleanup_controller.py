"""Cleanup controller - Business logic for Docker cleanup operations.

Handles cleanup of unused containers, images, volumes, and build cache.
"""

from typing import Dict

from app.core import docker_client
from app.repositories.volume_repository import VolumeRepository


class CleanupController:
    """Handles Docker cleanup operations.

    Provides methods for cleaning up Docker resources to free disk space.

    Example:
        >>> result = CleanupController.cleanup_all()
        >>> print(f"Freed {result['total_freed_mb']}MB")
    """

    @staticmethod
    def cleanup_containers() -> Dict[str, int]:
        """Remove stopped containers.

        Returns:
            Dictionary with cleanup statistics.
        """
        try:
            result = docker_client.client.containers.prune()
            return {
                "containers_deleted": len(
                    result.get("ContainersDeleted") or []
                ),
                "space_freed_mb": round(
                    result.get("SpaceReclaimed", 0) / 1024 / 1024, 2
                ),
            }
        except Exception as e:
            raise RuntimeError(f"Failed to cleanup containers: {e}")

    @staticmethod
    def cleanup_images() -> Dict[str, int]:
        """Remove unused images.

        Returns:
            Dictionary with cleanup statistics.
        """
        try:
            result = docker_client.client.images.prune(filters={"dangling": False})
            return {
                "images_deleted": len(result.get("ImagesDeleted") or []),
                "space_freed_mb": round(
                    result.get("SpaceReclaimed", 0) / 1024 / 1024, 2
                ),
            }
        except Exception as e:
            raise RuntimeError(f"Failed to cleanup images: {e}")

    @staticmethod
    def cleanup_volumes() -> Dict[str, int]:
        """Remove unused volumes.

        Returns:
            Dictionary with cleanup statistics.
        """
        try:
            volume_repo = VolumeRepository()
            result = volume_repo.prune_volumes()
            return {
                "volumes_deleted": result["volumes_deleted"],
                "space_freed_mb": result["space_reclaimed_mb"],
            }
        except Exception as e:
            raise RuntimeError(f"Failed to cleanup volumes: {e}")

    @staticmethod
    def cleanup_build_cache() -> Dict[str, int]:
        """Remove build cache.

        Returns:
            Dictionary with cleanup statistics.
        """
        try:
            result = docker_client.client.api.prune_builds()
            return {
                "space_freed_mb": round(
                    result.get("SpaceReclaimed", 0) / 1024 / 1024, 2
                ),
            }
        except Exception as e:
            raise RuntimeError(f"Failed to cleanup build cache: {e}")

    @staticmethod
    def cleanup_all() -> Dict[str, int]:
        """Run all cleanup operations.

        Returns:
            Dictionary with total cleanup statistics.

        Example:
            >>> result = CleanupController.cleanup_all()
            >>> print(result)
        """
        containers = CleanupController.cleanup_containers()
        images = CleanupController.cleanup_images()
        volumes = CleanupController.cleanup_volumes()
        build = CleanupController.cleanup_build_cache()

        return {
            "containers_deleted": containers["containers_deleted"],
            "images_deleted": images["images_deleted"],
            "volumes_deleted": volumes["volumes_deleted"],
            "total_freed_mb": (
                containers["space_freed_mb"]
                + images["space_freed_mb"]
                + volumes["space_freed_mb"]
                + build["space_freed_mb"]
            ),
        }

