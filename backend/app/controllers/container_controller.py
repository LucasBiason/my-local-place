"""Container controller - business logic."""

from typing import List
from fastapi import HTTPException, status

from app.repositories import DockerRepository
from app.schemas import ContainerInfo, ContainerAction, ContainerStats, ContainerLogs


class ContainerController:
    """Handles container-related business logic."""
    
    @staticmethod
    def list_all(repository: DockerRepository, all: bool = True) -> List[ContainerInfo]:
        """List all containers."""
        try:
            containers = repository.list_containers(all=all)
            return [ContainerInfo(**c) for c in containers]
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to list containers: {str(e)}"
            )
    
    @staticmethod
    def get_details(repository: DockerRepository, name: str) -> ContainerInfo:
        """Get container details."""
        try:
            container = repository.get_container(name)
            return ContainerInfo(**container)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(e)
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to get container: {str(e)}"
            )
    
    @staticmethod
    def start(repository: DockerRepository, name: str) -> ContainerAction:
        """Start a container."""
        try:
            result = repository.start_container(name)
            return ContainerAction(**result)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(e)
            )
        except RuntimeError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(e)
            )
    
    @staticmethod
    def stop(repository: DockerRepository, name: str) -> ContainerAction:
        """Stop a container."""
        try:
            result = repository.stop_container(name)
            return ContainerAction(**result)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(e)
            )
        except RuntimeError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(e)
            )
    
    @staticmethod
    def restart(repository: DockerRepository, name: str) -> ContainerAction:
        """Restart a container."""
        try:
            result = repository.restart_container(name)
            return ContainerAction(**result)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(e)
            )
        except RuntimeError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(e)
            )
    
    @staticmethod
    def get_logs(repository: DockerRepository, name: str, tail: int = 100) -> ContainerLogs:
        """Get container logs."""
        try:
            logs = repository.get_logs(name, tail=tail)
            return ContainerLogs(
                container=name,
                lines=logs,
                tail=len(logs)
            )
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(e)
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to get logs: {str(e)}"
            )
    
    @staticmethod
    def get_stats(repository: DockerRepository, name: str) -> ContainerStats:
        """Get container resource stats."""
        try:
            stats = repository.get_stats(name)
            return ContainerStats(**stats)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(e)
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to get stats: {str(e)}"
            )

