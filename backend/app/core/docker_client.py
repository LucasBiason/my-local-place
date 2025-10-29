"""Docker client singleton for managing Docker Engine connections.

This module provides a singleton pattern implementation for Docker client
connections, ensuring a single point of access to the Docker Engine throughout
the application lifecycle.
"""

import docker
from docker.client import DockerClient
from docker.errors import DockerException


class DockerClientManager:
    """Manages Docker client connection using singleton pattern.

    This class ensures only one Docker client instance exists throughout
    the application, providing efficient connection management and
    connection health checking.

    Attributes:
        _instance: Singleton instance of the class.
        _client: Docker client instance.

    Example:
        >>> manager = DockerClientManager()
        >>> client = manager.client
        >>> if manager.is_connected():
        ...     containers = client.containers.list()
    """

    _instance = None
    _client: DockerClient = None

    def __new__(cls) -> "DockerClientManager":
        """Create or return existing singleton instance.

        Returns:
            DockerClientManager: The singleton instance.
        """
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self) -> None:
        """Initialize Docker client connection.

        Connects to Docker Engine using environment variables (DOCKER_HOST).
        Validates connection by pinging the Docker daemon.

        Raises:
            RuntimeError: If connection to Docker daemon fails.
        """
        if self._client is None:
            try:
                self._client = docker.from_env()
                self._client.ping()
            except DockerException as e:
                raise RuntimeError(f"Failed to connect to Docker: {e}")

    @property
    def client(self) -> DockerClient:
        """Get Docker client instance.

        Returns:
            DockerClient: The active Docker client.
        """
        return self._client

    def is_connected(self) -> bool:
        """Check if Docker daemon is accessible.

        Returns:
            bool: True if Docker daemon responds to ping, False otherwise.
        """
        try:
            self._client.ping()
            return True
        except Exception:
            return False


# Global singleton instance
docker_client = DockerClientManager()
