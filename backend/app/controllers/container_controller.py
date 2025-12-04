"""Container controller - Business logic layer for container operations.

This module handles all business logic related to Docker container management,
acting as an intermediary between the routers (presentation layer) and the
repository (data access layer).

The controller is responsible for:
- Input validation and processing
- Business rule enforcement
- Error handling and HTTP exception mapping
- Response formatting
"""

from typing import List

from app.repositories import DockerRepository
from app.schemas import (
    ContainerAction,
    ContainerInfo,
    ContainerLogs,
    ContainerStats,
)
from fastapi import HTTPException, status


class ContainerController:
    """Handles container-related business logic.

    Implements business rules and orchestrates repository operations
    for Docker container management. All methods are static as they
    operate solely on injected dependencies.

    Example:
        >>> repo = DockerRepository()
        >>> containers = ContainerController.list_all(repo)
        >>> stats = ContainerController.get_stats(repo, "postgres")
    """

    @staticmethod
    def list_all(
        repository: DockerRepository, all: bool = True
    ) -> List[ContainerInfo]:
        """List all Docker containers.

        Args:
            repository: Docker repository instance.
            all: Include stopped containers. Defaults to True.

        Returns:
            List of ContainerInfo models.

        Raises:
            HTTPException: 500 if operation fails.

        Example:
            >>> repo = DockerRepository()
            >>> containers = ContainerController.list_all(repo, all=False)
            >>> for c in containers:
            ...     print(f"{c.name}: {c.status}")
        """
        try:
            containers = repository.list_containers(all=all)
            return [ContainerInfo(**c) for c in containers]
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to list containers: {str(e)}",
            )

    @staticmethod
    def get_details(repository: DockerRepository, name: str) -> ContainerInfo:
        """Get detailed information about a specific container.

        Args:
            repository: Docker repository instance.
            name: Container name or ID.

        Returns:
            ContainerInfo model with full details.

        Raises:
            HTTPException: 404 if container not found, 500 for other errors.

        Example:
            >>> repo = DockerRepository()
            >>> info = ContainerController.get_details(repo, "postgres")
            >>> print(info.state)
        """
        try:
            container = repository.get_container(name)
            return ContainerInfo(**container)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=str(e)
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to get container: {str(e)}",
            )

    @staticmethod
    def start(repository: DockerRepository, name: str) -> ContainerAction:
        """Start a stopped container.

        Args:
            repository: Docker repository instance.
            name: Container name or ID to start.

        Returns:
            ContainerAction model with operation result.

        Raises:
            HTTPException: 404 if not found, 500 if operation fails.

        Example:
            >>> repo = DockerRepository()
            >>> result = ContainerController.start(repo, "postgres")
            >>> print(result.message)
        """
        try:
            result = repository.start_container(name)
            return ContainerAction(**result)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=str(e)
            )
        except RuntimeError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(e),
            )

    @staticmethod
    def stop(repository: DockerRepository, name: str) -> ContainerAction:
        """Stop a running container.

        Args:
            repository: Docker repository instance.
            name: Container name or ID to stop.

        Returns:
            ContainerAction model with operation result.

        Raises:
            HTTPException: 404 if not found, 500 if operation fails.

        Example:
            >>> repo = DockerRepository()
            >>> result = ContainerController.stop(repo, "postgres")
            >>> print(result.status)
        """
        try:
            result = repository.stop_container(name)
            return ContainerAction(**result)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=str(e)
            )
        except RuntimeError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(e),
            )

    @staticmethod
    def restart(repository: DockerRepository, name: str) -> ContainerAction:
        """Restart a container.

        Args:
            repository: Docker repository instance.
            name: Container name or ID to restart.

        Returns:
            ContainerAction model with operation result.

        Raises:
            HTTPException: 404 if not found, 500 if operation fails.

        Example:
            >>> repo = DockerRepository()
            >>> result = ContainerController.restart(repo, "postgres")
        """
        try:
            result = repository.restart_container(name)
            return ContainerAction(**result)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=str(e)
            )
        except RuntimeError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(e),
            )

    @staticmethod
    def get_logs(
        repository: DockerRepository, name: str, tail: int = 100
    ) -> ContainerLogs:
        """Get container logs.

        Args:
            repository: Docker repository instance.
            name: Container name or ID.
            tail: Number of log lines to retrieve. Defaults to 100.

        Returns:
            ContainerLogs model with log lines.

        Raises:
            HTTPException: 404 if not found, 500 if operation fails.

        Example:
            >>> repo = DockerRepository()
            >>> logs = ContainerController.get_logs(repo, "postgres", tail=50)
            >>> print(f"Retrieved {logs.tail} lines")
        """
        try:
            logs = repository.get_logs(name, tail=tail)
            return ContainerLogs(container=name, lines=logs, tail=len(logs))
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=str(e)
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to get logs: {str(e)}",
            )

    @staticmethod
    def get_stats(repository: DockerRepository, name: str) -> ContainerStats:
        """Get container resource statistics.

        Args:
            repository: Docker repository instance.
            name: Container name or ID.

        Returns:
            ContainerStats model with CPU, memory, and network metrics.

        Raises:
            HTTPException: 404 if not found, 500 if operation fails.

        Example:
            >>> repo = DockerRepository()
            >>> stats = ContainerController.get_stats(repo, "postgres")
            >>> print(f"CPU: {stats.cpu_percent}%")
        """
        try:
            stats = repository.get_stats(name)
            return ContainerStats(**stats)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=str(e)
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to get stats: {str(e)}",
            )

    @staticmethod
    def rebuild(repository: DockerRepository, name: str) -> ContainerAction:
        """Rebuild and restart a container.

        Rebuilds the container using docker-compose build and restarts it.

        Args:
            repository: Docker repository instance.
            name: Container name or ID to rebuild.

        Returns:
            ContainerAction model with operation result.

        Raises:
            HTTPException: 404 if not found, 500 if operation fails.

        Example:
            >>> repo = DockerRepository()
            >>> result = ContainerController.rebuild(repo, "mylocalplace-api")
        """
        try:
            result = repository.rebuild_container(name)
            return ContainerAction(**result)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=str(e)
            )
        except RuntimeError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(e),
            )
