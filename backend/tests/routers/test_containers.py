"""Unit tests for containers router."""

from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    """Create test client."""
    return TestClient(app)


@patch("app.routers.containers.repository")
def test_list_containers(mock_repository, client, sample_container_data):
    """Test list containers endpoint."""
    mock_repository.list_containers.return_value = [sample_container_data]

    response = client.get("/api/v1/containers?all=true")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "test-container"


@patch("app.routers.containers.repository")
def test_get_container(mock_repository, client, sample_container_data):
    """Test get container details endpoint."""
    mock_repository.get_container.return_value = sample_container_data

    response = client.get("/api/v1/containers/test-container")

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "test-container"


@patch("app.routers.containers.repository")
def test_get_container_not_found(mock_repository, client):
    """Test get container returns 404 when not found."""
    mock_repository.get_container.side_effect = ValueError("Not found")

    response = client.get("/api/v1/containers/invalid")

    assert response.status_code == 404


@patch("app.routers.containers.repository")
def test_start_container(mock_repository, client):
    """Test start container endpoint."""
    mock_repository.start_container.return_value = {
        "status": "success",
        "message": "Container started",
    }

    response = client.post("/api/v1/containers/test/start")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"


@patch("app.routers.containers.repository")
def test_stop_container(mock_repository, client):
    """Test stop container endpoint."""
    mock_repository.stop_container.return_value = {
        "status": "success",
        "message": "Container stopped",
    }

    response = client.post("/api/v1/containers/test/stop")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"


@patch("app.routers.containers.repository")
def test_restart_container(mock_repository, client):
    """Test restart container endpoint."""
    mock_repository.restart_container.return_value = {
        "status": "success",
        "message": "Container restarted",
    }

    response = client.post("/api/v1/containers/test/restart")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"


@patch("app.routers.containers.repository")
def test_get_logs(mock_repository, client):
    """Test get logs endpoint."""
    mock_repository.get_logs.return_value = ["Log 1", "Log 2"]

    response = client.get("/api/v1/containers/test/logs?tail=10")

    assert response.status_code == 200
    data = response.json()
    assert data["container"] == "test"
    assert len(data["lines"]) == 2


@patch("app.routers.containers.repository")
def test_get_logs_validation_error(mock_repository, client):
    """Test get logs with invalid tail parameter."""
    response = client.get("/api/v1/containers/test/logs?tail=2000")

    assert response.status_code == 422
    data = response.json()
    assert "detail" in data


@patch("app.routers.containers.repository")
def test_get_stats(mock_repository, client):
    """Test get stats endpoint."""
    mock_repository.get_stats.return_value = {
        "cpu_percent": 2.5,
        "memory_usage_mb": 100.0,
        "memory_limit_mb": 2048.0,
        "memory_percent": 4.88,
        "network_rx_mb": 10.0,
        "network_tx_mb": 5.0,
    }

    response = client.get("/api/v1/containers/test/stats")

    assert response.status_code == 200
    data = response.json()
    assert data["cpu_percent"] == 2.5
    assert data["memory_usage_mb"] == 100.0

