"""Unit tests for DockerRepository."""

from unittest.mock import MagicMock

import pytest

from app.repositories.docker_repository import DockerRepository


@pytest.fixture
def repository():
    """Create repository with mocked client."""
    repo = DockerRepository()
    repo.client = MagicMock()
    return repo


@pytest.fixture
def mock_container():
    """Create mock container."""
    container = MagicMock()
    container.short_id = "abc123"
    container.name = "test-container"
    container.status = "running"
    container.attrs = {
        "State": {"Status": "running"},
        "Created": "2025-10-29T10:00:00Z",
    }
    container.image.tags = ["test:latest"]
    container.ports = {"80/tcp": [{"HostPort": "8000"}]}
    container.labels = {}
    return container


def test_list_containers(repository, mock_container):
    """Test list_containers returns formatted data."""
    repository.client.containers.list.return_value = [mock_container]

    result = repository.list_containers(all=True)

    assert len(result) == 1
    assert result[0]["name"] == "test-container"
    assert result[0]["status"] == "running"
    assert result[0]["running"] is True
    repository.client.containers.list.assert_called_once_with(all=True)


def test_get_container(repository, mock_container):
    """Test get_container returns container details."""
    repository.client.containers.get.return_value = mock_container

    result = repository.get_container("test-container")

    assert result["name"] == "test-container"
    assert result["status"] == "running"
    repository.client.containers.get.assert_called_once_with(
        "test-container"
    )


def test_start_container(repository, mock_container):
    """Test start_container starts container successfully."""
    repository.client.containers.get.return_value = mock_container

    result = repository.start_container("test")

    assert result["status"] == "success"
    assert "started" in result["message"]
    mock_container.start.assert_called_once()


def test_stop_container(repository, mock_container):
    """Test stop_container stops container successfully."""
    repository.client.containers.get.return_value = mock_container

    result = repository.stop_container("test", timeout=5)

    assert result["status"] == "success"
    assert "stopped" in result["message"]
    mock_container.stop.assert_called_once_with(timeout=5)


def test_restart_container(repository, mock_container):
    """Test restart_container restarts successfully."""
    repository.client.containers.get.return_value = mock_container

    result = repository.restart_container("test")

    assert result["status"] == "success"
    assert "restarted" in result["message"]
    mock_container.restart.assert_called_once_with(timeout=10)


def test_get_logs(repository, mock_container):
    """Test get_logs returns formatted log lines."""
    repository.client.containers.get.return_value = mock_container
    mock_container.logs.return_value = b"Line 1\nLine 2\nLine 3\n"

    result = repository.get_logs("test", tail=10)

    assert len(result) == 3
    assert "Line 1" in result
    mock_container.logs.assert_called_once()


def test_get_stats(repository, mock_container):
    """Test get_stats returns formatted statistics."""
    repository.client.containers.get.return_value = mock_container
    mock_container.stats.return_value = {
        "cpu_stats": {
            "cpu_usage": {"total_usage": 1000000},
            "system_cpu_usage": 10000000,
        },
        "precpu_stats": {
            "cpu_usage": {"total_usage": 500000},
            "system_cpu_usage": 5000000,
        },
        "memory_stats": {"usage": 100000000, "limit": 1000000000},
        "networks": {
            "eth0": {"rx_bytes": 1000000, "tx_bytes": 500000}
        },
    }

    result = repository.get_stats("test")

    assert "cpu_percent" in result
    assert "memory_usage_mb" in result
    assert "network_rx_mb" in result
    assert isinstance(result["cpu_percent"], float)


def test_format_ports_empty():
    """Test _format_ports with empty ports."""
    result = DockerRepository._format_ports({})
    assert result == []


def test_format_ports_with_bindings():
    """Test _format_ports with port bindings."""
    ports = {"80/tcp": [{"HostPort": "8000"}], "443/tcp": None}

    result = DockerRepository._format_ports(ports)

    assert "8000:80/tcp" in result
    assert len(result) == 1


def test_format_ports_no_host_port():
    """Test _format_ports with missing HostPort."""
    ports = {"80/tcp": [{"OtherKey": "value"}]}

    result = DockerRepository._format_ports(ports)

    assert result == []
