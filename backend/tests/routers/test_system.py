"""Unit tests for system router."""

from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    """Create test client."""
    return TestClient(app)


@patch("app.controllers.system_controller.psutil")
def test_get_system_metrics(mock_psutil, client):
    """Test get system metrics endpoint."""
    mock_psutil.cpu_percent.return_value = 25.5

    mock_memory = MagicMock()
    mock_memory.total = 32 * 1024**3
    mock_memory.used = 18 * 1024**3
    mock_memory.percent = 56.25
    mock_psutil.virtual_memory.return_value = mock_memory

    mock_disk = MagicMock()
    mock_disk.total = 1000 * 1024**3
    mock_disk.used = 600 * 1024**3
    mock_disk.percent = 60.0
    mock_psutil.disk_usage.return_value = mock_disk

    response = client.get("/api/v1/system/metrics")

    assert response.status_code == 200
    data = response.json()
    assert data["cpu_percent"] == 25.5
    assert data["memory"]["total_gb"] == 32.0
    assert data["disk"]["percent"] == 60.0

