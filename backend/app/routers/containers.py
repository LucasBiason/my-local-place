"""Containers router - API endpoints for container management.

This module defines REST API endpoints for Docker container operations
including listing, starting, stopping, and monitoring containers.
"""

from typing import List

from app.controllers import ContainerController
from app.repositories import DockerRepository
from app.schemas import (
    ContainerAction,
    ContainerInfo,
    ContainerLogs,
    ContainerStats,
)
from fastapi import APIRouter, Query

router = APIRouter(prefix="/api/v1/containers", tags=["Containers"])

# Repository instance (singleton pattern via module-level)
repository = DockerRepository()


@router.get("", response_model=List[ContainerInfo])
async def list_containers(
    all: bool = Query(True, description="Include stopped containers")
) -> List[ContainerInfo]:
    """List all Docker containers.

    Returns a list of all containers, optionally filtered to running only.

    Args:
        all: Include stopped containers. Defaults to True.

    Returns:
        List of container information.

    Example:
        GET /api/v1/containers?all=true
        GET /api/v1/containers?all=false
    """
    return ContainerController.list_all(repository, all=all)


@router.get("/{name}", response_model=ContainerInfo)
async def get_container(name: str) -> ContainerInfo:
    """Get detailed information about a specific container.

    Args:
        name: Container name or ID.

    Returns:
        Container information with full details.

    Raises:
        404: Container not found.
        500: Failed to retrieve container.

    Example:
        GET /api/v1/containers/postgres
    """
    return ContainerController.get_details(repository, name)


@router.post("/{name}/start", response_model=ContainerAction)
async def start_container(name: str) -> ContainerAction:
    """Start a stopped container.

    Args:
        name: Container name or ID to start.

    Returns:
        Action result with status message.

    Raises:
        404: Container not found.
        500: Failed to start container.

    Example:
        POST /api/v1/containers/postgres/start
    """
    return ContainerController.start(repository, name)


@router.post("/{name}/stop", response_model=ContainerAction)
async def stop_container(name: str) -> ContainerAction:
    """Stop a running container.

    Args:
        name: Container name or ID to stop.

    Returns:
        Action result with status message.

    Raises:
        404: Container not found.
        500: Failed to stop container.

    Example:
        POST /api/v1/containers/postgres/stop
    """
    return ContainerController.stop(repository, name)


@router.post("/{name}/restart", response_model=ContainerAction)
async def restart_container(name: str) -> ContainerAction:
    """Restart a container.

    Args:
        name: Container name or ID to restart.

    Returns:
        Action result with status message.

    Raises:
        404: Container not found.
        500: Failed to restart container.

    Example:
        POST /api/v1/containers/postgres/restart
    """
    return ContainerController.restart(repository, name)


@router.get("/{name}/logs", response_model=ContainerLogs)
async def get_logs(
    name: str,
    tail: int = Query(100, ge=1, le=1000, description="Number of log lines"),
) -> ContainerLogs:
    """Get container logs with timestamps.

    Args:
        name: Container name or ID.
        tail: Number of log lines to retrieve (1-1000). Defaults to 100.

    Returns:
        Container logs with timestamps.

    Raises:
        404: Container not found.
        422: Invalid tail parameter.
        500: Failed to retrieve logs.

    Example:
        GET /api/v1/containers/postgres/logs?tail=50
    """
    return ContainerController.get_logs(repository, name, tail=tail)


@router.get("/{name}/stats", response_model=ContainerStats)
async def get_stats(name: str) -> ContainerStats:
    """Get container resource usage statistics.

    Retrieves real-time CPU, memory, and network metrics.

    Args:
        name: Container name or ID.

    Returns:
        Container resource statistics.

    Raises:
        404: Container not found.
        500: Failed to retrieve stats (container may be stopped).

    Example:
        GET /api/v1/containers/postgres/stats
    """
    return ContainerController.get_stats(repository, name)
