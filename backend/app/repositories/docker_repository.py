"""Docker repository - Data access layer for Docker Engine operations.

This module implements the Repository Pattern for Docker operations,
similar to how ORMs (Object-Relational Mappers) provide abstraction
over database operations. It encapsulates all Docker SDK interactions.

The repository acts as a data access layer between the business logic
(controllers) and the Docker Engine, providing a clean interface for
container management operations.
"""

from typing import Any, Dict, List

from app.core import docker_client
from docker.errors import APIError, NotFound


class DockerRepository:
    """Repository for Docker Engine operations.

    Provides data access layer for Docker containers, implementing
    the Repository Pattern. Handles all Docker SDK interactions and
    error management.

    Attributes:
        client: Docker client instance from singleton manager.

    Example:
        >>> repo = DockerRepository()
        >>> containers = repo.list_containers(all=True)
        >>> stats = repo.get_stats("my-container")
    """

    def __init__(self) -> None:
        """Initialize repository with Docker client.

        Obtains Docker client from singleton manager.
        """
        self.client = docker_client.client

    def list_containers(self, all: bool = True) -> List[Dict[str, Any]]:
        """List all Docker containers.

        Args:
            all: Include stopped containers. Defaults to True.

        Returns:
            List of container information dictionaries containing:
                - id (str): Container short ID
                - name (str): Container name
                - status (str): Current status
                - state (str): Detailed state
                - image (str): Image name or ID
                - ports (List[str]): Port mappings
                - created (str): Creation timestamp
                - running (bool): True if container is running

        Example:
            >>> repo = DockerRepository()
            >>> containers = repo.list_containers(all=False)
            >>> running_names = [c['name'] for c in containers if c['running']]
        """
        containers = self.client.containers.list(all=all)

        return [
            {
                "id": c.short_id,
                "name": c.name,
                "status": c.status,
                "state": c.attrs["State"]["Status"],
                "image": (
                    c.image.tags[0] if c.image.tags else c.image.short_id
                ),
                "ports": self._format_ports(c.ports),
                "created": c.attrs["Created"],
                "running": c.status == "running",
            }
            for c in containers
        ]

    def get_container(self, name: str) -> Dict[str, Any]:
        """Get detailed information about a specific container.

        Args:
            name: Container name or ID.

        Returns:
            Dictionary with container details including state, image,
            ports, labels, and runtime information.

        Raises:
            ValueError: If container not found.

        Example:
            >>> repo = DockerRepository()
            >>> info = repo.get_container("postgres")
            >>> print(info['status'])
        """
        try:
            container = self.client.containers.get(name)

            return {
                "id": container.short_id,
                "name": container.name,
                "status": container.status,
                "state": container.attrs["State"],
                "image": (
                    container.image.tags[0]
                    if container.image.tags
                    else "unknown"
                ),
                "ports": self._format_ports(container.ports),
                "created": container.attrs["Created"],
                "labels": container.labels,
                "running": container.status == "running",
            }
        except NotFound:
            raise ValueError(f"Container {name} not found")

    def start_container(self, name: str) -> Dict[str, str]:
        """Start a stopped Docker container.

        Args:
            name: Container name or ID to start.

        Returns:
            Dictionary with status and message.

        Raises:
            ValueError: If container not found.
            RuntimeError: If Docker API operation fails.

        Example:
            >>> repo = DockerRepository()
            >>> result = repo.start_container("postgres")
            >>> print(result['message'])
        """
        try:
            container = self.client.containers.get(name)
            container.start()
            return {
                "status": "success",
                "message": f"Container {name} started",
            }
        except NotFound:
            raise ValueError(f"Container {name} not found")
        except APIError as e:
            raise RuntimeError(f"Failed to start container: {e}")

    def stop_container(self, name: str, timeout: int = 10) -> Dict[str, str]:
        """Stop a running Docker container.

        Args:
            name: Container name or ID to stop.
            timeout: Seconds to wait before killing. Defaults to 10.

        Returns:
            Dictionary with status and message.

        Raises:
            ValueError: If container not found.
            RuntimeError: If Docker API operation fails.

        Example:
            >>> repo = DockerRepository()
            >>> result = repo.stop_container("postgres", timeout=5)
        """
        try:
            container = self.client.containers.get(name)
            container.stop(timeout=timeout)
            return {
                "status": "success",
                "message": f"Container {name} stopped",
            }
        except NotFound:
            raise ValueError(f"Container {name} not found")
        except APIError as e:
            raise RuntimeError(f"Failed to stop container: {e}")

    def restart_container(
        self, name: str, timeout: int = 10
    ) -> Dict[str, str]:
        """Restart a Docker container.

        Args:
            name: Container name or ID to restart.
            timeout: Seconds to wait before killing. Defaults to 10.

        Returns:
            Dictionary with status and message.

        Raises:
            ValueError: If container not found.
            RuntimeError: If Docker API operation fails.

        Example:
            >>> repo = DockerRepository()
            >>> result = repo.restart_container("postgres")
        """
        try:
            container = self.client.containers.get(name)
            container.restart(timeout=timeout)
            return {
                "status": "success",
                "message": f"Container {name} restarted",
            }
        except NotFound:
            raise ValueError(f"Container {name} not found")
        except APIError as e:
            raise RuntimeError(f"Failed to restart container: {e}")

    def get_logs(self, name: str, tail: int = 100) -> List[str]:
        """Get container logs with timestamps.

        Args:
            name: Container name or ID.
            tail: Number of log lines to retrieve. Defaults to 100.

        Returns:
            List of log lines with timestamps.

        Raises:
            ValueError: If container not found.

        Example:
            >>> repo = DockerRepository()
            >>> logs = repo.get_logs("postgres", tail=50)
            >>> for line in logs:
            ...     print(line)
        """
        try:
            container = self.client.containers.get(name)
            logs = container.logs(
                tail=tail, timestamps=True, stream=False
            ).decode("utf-8", errors="ignore")

            return [line for line in logs.split("\n") if line.strip()]
        except NotFound:
            raise ValueError(f"Container {name} not found")

    def get_stats(self, name: str) -> Dict[str, Any]:
        """Get container resource usage statistics.

        Retrieves real-time CPU, memory, and network statistics for
        a running container.

        Args:
            name: Container name or ID.

        Returns:
            Dictionary containing:
                - cpu_percent (float): CPU usage percentage
                - memory_usage_mb (float): Memory used in MB
                - memory_limit_mb (float): Memory limit in MB
                - memory_percent (float): Memory usage percentage
                - network_rx_mb (float): Network received in MB
                - network_tx_mb (float): Network transmitted in MB

        Raises:
            ValueError: If container not found.

        Example:
            >>> repo = DockerRepository()
            >>> stats = repo.get_stats("postgres")
            >>> print(f"CPU: {stats['cpu_percent']}%")
        """
        try:
            container = self.client.containers.get(name)
            stats = container.stats(stream=False)

            # Calculate CPU percentage
            cpu_delta = (
                stats["cpu_stats"]["cpu_usage"]["total_usage"]
                - stats["precpu_stats"]["cpu_usage"]["total_usage"]
            )
            system_delta = (
                stats["cpu_stats"]["system_cpu_usage"]
                - stats["precpu_stats"]["system_cpu_usage"]
            )
            cpu_percent = (
                (cpu_delta / system_delta) * 100.0 if system_delta > 0 else 0.0
            )

            # Memory statistics
            mem_usage = stats["memory_stats"].get("usage", 0)
            mem_limit = stats["memory_stats"].get("limit", 1)
            mem_percent = (mem_usage / mem_limit) * 100.0

            # Network statistics
            networks = stats.get("networks", {})
            rx_bytes = sum(n.get("rx_bytes", 0) for n in networks.values())
            tx_bytes = sum(n.get("tx_bytes", 0) for n in networks.values())

            return {
                "cpu_percent": round(cpu_percent, 2),
                "memory_usage_mb": round(mem_usage / 1024 / 1024, 2),
                "memory_limit_mb": round(mem_limit / 1024 / 1024, 2),
                "memory_percent": round(mem_percent, 2),
                "network_rx_mb": round(rx_bytes / 1024 / 1024, 2),
                "network_tx_mb": round(tx_bytes / 1024 / 1024, 2),
            }
        except NotFound:
            raise ValueError(f"Container {name} not found")

    def rebuild_container(self, name: str) -> Dict[str, str]:
        """Rebuild and restart a container using docker-compose.

        Stops the container, rebuilds it using docker-compose build,
        and restarts it. This requires docker-compose to be available
        and the container to be part of a docker-compose project.

        Args:
            name: Container name or ID to rebuild.

        Returns:
            Dictionary with status and message.

        Raises:
            ValueError: If container not found.
            RuntimeError: If rebuild operation fails.

        Example:
            >>> repo = DockerRepository()
            >>> result = repo.rebuild_container("mylocalplace-api")
        """
        import subprocess
        from pathlib import Path

        try:
            container = self.client.containers.get(name)

            # Get container labels to find compose project
            labels = container.labels
            project_name = labels.get("com.docker.compose.project", "")
            service_name = labels.get("com.docker.compose.service", "")

            if not project_name or not service_name:
                raise RuntimeError(
                    f"Container {name} is not part of a docker-compose "
                    "project. Cannot rebuild without compose context."
                )

            # Find docker-compose.yml (try common locations)
            compose_file = None
            base_path = (
                "/home/lucas-biason/Projetos/Infraestrutura/"
                "my-local-place/docker-compose.yml"
            )
            possible_paths = [
                Path(base_path),
                Path.cwd() / "docker-compose.yml",
                Path.home() / "my-local-place" / "docker-compose.yml",
            ]

            for path in possible_paths:
                if path.exists():
                    compose_file = path
                    break

            if not compose_file:
                raise RuntimeError(
                    "docker-compose.yml not found. Cannot rebuild container."
                )

            # Stop container first
            if container.status == "running":
                container.stop(timeout=10)

            # Rebuild using docker-compose
            compose_dir = compose_file.parent
            result = subprocess.run(
                [
                    "docker-compose",
                    "-f",
                    str(compose_file),
                    "build",
                    "--no-cache",
                    service_name,
                ],
                cwd=str(compose_dir),
                capture_output=True,
                text=True,
                timeout=600,  # 10 minutes timeout
            )

            if result.returncode != 0:
                raise RuntimeError(
                    f"Failed to rebuild container: {result.stderr}"
                )

            # Restart using docker-compose
            result = subprocess.run(
                [
                    "docker-compose",
                    "-f",
                    str(compose_file),
                    "up",
                    "-d",
                    service_name,
                ],
                cwd=str(compose_dir),
                capture_output=True,
                text=True,
                timeout=120,  # 2 minutes timeout
            )

            if result.returncode != 0:
                raise RuntimeError(
                    f"Failed to restart container: {result.stderr}"
                )

            return {
                "status": "success",
                "message": (
                    f"Container {name} rebuilt and restarted successfully"
                ),
            }
        except NotFound:
            raise ValueError(f"Container {name} not found")
        except subprocess.TimeoutExpired:
            raise RuntimeError(
                f"Rebuild operation timed out for container {name}"
            )
        except Exception as e:
            raise RuntimeError(f"Failed to rebuild container: {str(e)}")

    @staticmethod
    def _format_ports(ports: Dict) -> List[str]:
        """Format port mappings for display.

        Converts Docker's port mapping format to human-readable strings.

        Args:
            ports: Port mapping dictionary from Docker SDK.

        Returns:
            List of formatted port strings (e.g., ["8000:80/tcp"]).

        Example:
            >>> ports = {"80/tcp": [{"HostPort": "8000"}]}
            >>> formatted = DockerRepository._format_ports(ports)
            >>> print(formatted)  # ["8000:80/tcp"]
        """
        if not ports:
            return []

        formatted = []
        for container_port, host_bindings in ports.items():
            if host_bindings:
                for binding in host_bindings:
                    host_port = binding.get("HostPort", "")
                    if host_port:
                        formatted.append(f"{host_port}:{container_port}")

        return formatted
