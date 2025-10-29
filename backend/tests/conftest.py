"""Pytest configuration and shared fixtures."""

import sys
from unittest.mock import MagicMock, patch

import pytest

# Create proper mock exceptions
class NotFound(Exception):
    """Mock Docker NotFound exception."""
    pass


class APIError(Exception):
    """Mock Docker APIError exception."""
    pass


class DockerException(Exception):
    """Mock Docker base exception."""
    pass


# Mock Docker SDK before any app imports
mock_docker = MagicMock()
mock_docker_client = MagicMock()
mock_docker_client.ping.return_value = True
mock_docker.from_env.return_value = mock_docker_client

# Create mock errors module
mock_errors = MagicMock()
mock_errors.NotFound = NotFound
mock_errors.APIError = APIError
mock_errors.DockerException = DockerException

sys.modules["docker"] = mock_docker
sys.modules["docker.errors"] = mock_errors
sys.modules["docker.client"] = MagicMock()

# Now safe to import app modules
from app.repositories.docker_repository import DockerRepository  # noqa: E402


@pytest.fixture
def mock_docker_client():
    """Create a mock Docker client."""
    client = MagicMock()
    client.ping.return_value = True
    return client


@pytest.fixture
def mock_container():
    """Create a mock Docker container."""
    container = MagicMock()
    container.short_id = "abc123def456"
    container.name = "test-container"
    container.status = "running"
    container.attrs = {
        "State": {
            "Status": "running",
            "Running": True,
            "Paused": False,
        },
        "Created": "2025-10-29T10:00:00Z",
    }
    container.image.tags = ["test:latest"]
    container.ports = {}
    container.labels = {}
    return container


@pytest.fixture
def mock_docker_repository():
    """Create a fully mocked DockerRepository."""
    repository = MagicMock(spec=DockerRepository)
    return repository


@pytest.fixture
def sample_container_data():
    """Sample container data for testing."""
    return {
        "id": "abc123",
        "name": "test-container",
        "status": "running",
        "state": "running",
        "image": "test:latest",
        "ports": ["8000:8000/tcp"],
        "created": "2025-10-29T10:00:00Z",
        "running": True,
    }
