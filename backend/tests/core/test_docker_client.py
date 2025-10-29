"""Unit tests for Docker client singleton."""

from unittest.mock import MagicMock, patch

import pytest
from docker.errors import DockerException

from app.core.docker_client import DockerClientManager


@patch("app.core.docker_client.docker.from_env")
def test_docker_client_singleton(mock_from_env):
    """Test Docker client is singleton."""
    mock_client = MagicMock()
    mock_client.ping.return_value = True
    mock_from_env.return_value = mock_client

    manager1 = DockerClientManager()
    manager2 = DockerClientManager()

    assert manager1 is manager2
    assert manager1.client is manager2.client


def test_docker_client_initialization():
    """Test Docker client is initialized (mocked in conftest)."""
    from app.core.docker_client import docker_client

    assert docker_client is not None
    assert hasattr(docker_client, "client")


def test_docker_client_connection_in_tests():
    """Test Docker client works with mocks in tests."""
    from app.core.docker_client import docker_client

    # In test environment, this should not raise
    result = docker_client.is_connected()
    assert isinstance(result, bool)


@patch("app.core.docker_client.docker.from_env")
def test_is_connected_success(mock_from_env):
    """Test is_connected returns True when Docker responds."""
    mock_client = MagicMock()
    mock_client.ping.return_value = True
    mock_from_env.return_value = mock_client

    manager = DockerClientManager()
    assert manager.is_connected() is True


def test_client_property():
    """Test client property returns Docker client."""
    from app.core.docker_client import docker_client

    assert docker_client.client is not None

