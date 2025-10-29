"""Containers router."""

from typing import List
from fastapi import APIRouter, Query

from app.repositories import DockerRepository
from app.controllers import ContainerController
from app.schemas import ContainerInfo, ContainerAction, ContainerStats, ContainerLogs

router = APIRouter(prefix="/api/v1/containers", tags=["Containers"])

# Global repository instance
repository = DockerRepository()


@router.get("", response_model=List[ContainerInfo])
async def list_containers(
    all: bool = Query(True, description="Include stopped containers")
):
    """List all containers."""
    return ContainerController.list_all(repository, all=all)


@router.get("/{name}", response_model=ContainerInfo)
async def get_container(name: str):
    """Get container details."""
    return ContainerController.get_details(repository, name)


@router.post("/{name}/start", response_model=ContainerAction)
async def start_container(name: str):
    """Start a container."""
    return ContainerController.start(repository, name)


@router.post("/{name}/stop", response_model=ContainerAction)
async def stop_container(name: str):
    """Stop a container."""
    return ContainerController.stop(repository, name)


@router.post("/{name}/restart", response_model=ContainerAction)
async def restart_container(name: str):
    """Restart a container."""
    return ContainerController.restart(repository, name)


@router.get("/{name}/logs", response_model=ContainerLogs)
async def get_logs(
    name: str,
    tail: int = Query(100, ge=1, le=1000, description="Number of log lines")
):
    """Get container logs."""
    return ContainerController.get_logs(repository, name, tail=tail)


@router.get("/{name}/stats", response_model=ContainerStats)
async def get_stats(name: str):
    """Get container resource statistics."""
    return ContainerController.get_stats(repository, name)

