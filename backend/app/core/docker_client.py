"""Docker client singleton."""

import docker
from docker.errors import DockerException


class DockerClientManager:
    """Manages Docker client connection."""
    
    _instance = None
    _client = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        """Initialize Docker client."""
        if self._client is None:
            try:
                self._client = docker.from_env()
                self._client.ping()
            except DockerException as e:
                raise RuntimeError(f"Failed to connect to Docker: {e}")
    
    @property
    def client(self):
        """Get Docker client instance."""
        return self._client
    
    def is_connected(self) -> bool:
        """Check if Docker is accessible."""
        try:
            self._client.ping()
            return True
        except Exception:
            return False


# Global instance
docker_client = DockerClientManager()

