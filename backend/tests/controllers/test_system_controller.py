"""Unit tests for SystemController."""

from unittest.mock import MagicMock, patch

import pytest
from fastapi import HTTPException

from app.controllers.system_controller import SystemController
from app.schemas import SystemMetrics


@patch("app.controllers.system_controller.psutil")
def test_get_metrics_success(mock_psutil):
    """Test get_metrics returns system metrics."""
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

    result = SystemController.get_metrics()

    assert isinstance(result, SystemMetrics)
    assert result.cpu_percent == 25.5
    assert result.memory.total_gb == 32.0
    assert result.disk.percent == 60.0
    mock_psutil.cpu_percent.assert_called_once_with(interval=1)


@patch("app.controllers.system_controller.psutil")
def test_get_metrics_error(mock_psutil):
    """Test get_metrics handles errors."""
    mock_psutil.cpu_percent.side_effect = Exception("System error")

    with pytest.raises(HTTPException) as exc:
        SystemController.get_metrics()

    assert exc.value.status_code == 500
    assert "Failed to get system metrics" in exc.value.detail

