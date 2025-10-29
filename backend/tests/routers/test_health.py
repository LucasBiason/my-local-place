"""Unit tests for health router."""

from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    """Create test client."""
    return TestClient(app)


@patch("app.core.docker_client.docker_client.is_connected")
def test_health_check_root(mock_is_connected, client):
    """Test health check endpoint at root."""
    mock_is_connected.return_value = True

    response = client.get("/")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["docker_connected"] is True
    assert "timestamp" in data
    assert data["version"] == "2.0.0"


@patch("app.core.docker_client.docker_client.is_connected")
def test_health_check_endpoint(mock_is_connected, client):
    """Test health check endpoint at /health."""
    mock_is_connected.return_value = True

    response = client.get("/health")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["docker_connected"] is True


@patch("app.core.docker_client.docker_client.is_connected")
def test_health_check_docker_disconnected(mock_is_connected, client):
    """Test health check when Docker is not connected."""
    mock_is_connected.return_value = False

    response = client.get("/health")

    assert response.status_code == 200
    data = response.json()
    assert data["docker_connected"] is False

