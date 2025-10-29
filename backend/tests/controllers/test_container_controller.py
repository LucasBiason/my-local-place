"""Unit tests for ContainerController."""

from unittest.mock import MagicMock

import pytest
from fastapi import HTTPException

from app.controllers.container_controller import ContainerController
from app.schemas import ContainerAction, ContainerInfo, ContainerLogs, ContainerStats


def test_list_all_success(mock_docker_repository, sample_container_data):
    """Test list_all returns container list."""
    mock_docker_repository.list_containers.return_value = [
        sample_container_data
    ]

    result = ContainerController.list_all(mock_docker_repository, all=True)

    assert len(result) == 1
    assert isinstance(result[0], ContainerInfo)
    assert result[0].name == "test-container"
    mock_docker_repository.list_containers.assert_called_once_with(all=True)


def test_list_all_error(mock_docker_repository):
    """Test list_all handles errors."""
    mock_docker_repository.list_containers.side_effect = Exception(
        "Docker error"
    )

    with pytest.raises(HTTPException) as exc:
        ContainerController.list_all(mock_docker_repository)

    assert exc.value.status_code == 500
    assert "Failed to list containers" in exc.value.detail


def test_get_details_success(mock_docker_repository, sample_container_data):
    """Test get_details returns container info."""
    mock_docker_repository.get_container.return_value = (
        sample_container_data
    )

    result = ContainerController.get_details(
        mock_docker_repository, "test"
    )

    assert isinstance(result, ContainerInfo)
    assert result.name == "test-container"


def test_get_details_not_found(mock_docker_repository):
    """Test get_details handles not found error."""
    mock_docker_repository.get_container.side_effect = ValueError(
        "Not found"
    )

    with pytest.raises(HTTPException) as exc:
        ContainerController.get_details(mock_docker_repository, "test")

    assert exc.value.status_code == 404


def test_get_details_generic_error(mock_docker_repository):
    """Test get_details handles generic errors."""
    mock_docker_repository.get_container.side_effect = Exception(
        "Generic error"
    )

    with pytest.raises(HTTPException) as exc:
        ContainerController.get_details(mock_docker_repository, "test")

    assert exc.value.status_code == 500
    assert "Failed to get container" in exc.value.detail


def test_start_success(mock_docker_repository):
    """Test start returns success action."""
    mock_docker_repository.start_container.return_value = {
        "status": "success",
        "message": "Container started",
    }

    result = ContainerController.start(mock_docker_repository, "test")

    assert isinstance(result, ContainerAction)
    assert result.status == "success"


def test_start_not_found(mock_docker_repository):
    """Test start handles not found error."""
    mock_docker_repository.start_container.side_effect = ValueError(
        "Not found"
    )

    with pytest.raises(HTTPException) as exc:
        ContainerController.start(mock_docker_repository, "test")

    assert exc.value.status_code == 404


def test_start_runtime_error(mock_docker_repository):
    """Test start handles runtime errors."""
    mock_docker_repository.start_container.side_effect = RuntimeError(
        "Failed"
    )

    with pytest.raises(HTTPException) as exc:
        ContainerController.start(mock_docker_repository, "test")

    assert exc.value.status_code == 500


def test_stop_success(mock_docker_repository):
    """Test stop returns success action."""
    mock_docker_repository.stop_container.return_value = {
        "status": "success",
        "message": "Container stopped",
    }

    result = ContainerController.stop(mock_docker_repository, "test")

    assert isinstance(result, ContainerAction)
    assert result.status == "success"


def test_stop_not_found(mock_docker_repository):
    """Test stop handles not found error."""
    mock_docker_repository.stop_container.side_effect = ValueError(
        "Not found"
    )

    with pytest.raises(HTTPException) as exc:
        ContainerController.stop(mock_docker_repository, "test")

    assert exc.value.status_code == 404


def test_stop_runtime_error(mock_docker_repository):
    """Test stop handles runtime errors."""
    mock_docker_repository.stop_container.side_effect = RuntimeError(
        "Failed"
    )

    with pytest.raises(HTTPException) as exc:
        ContainerController.stop(mock_docker_repository, "test")

    assert exc.value.status_code == 500


def test_restart_success(mock_docker_repository):
    """Test restart returns success action."""
    mock_docker_repository.restart_container.return_value = {
        "status": "success",
        "message": "Container restarted",
    }

    result = ContainerController.restart(mock_docker_repository, "test")

    assert isinstance(result, ContainerAction)
    assert result.status == "success"


def test_restart_not_found(mock_docker_repository):
    """Test restart handles not found error."""
    mock_docker_repository.restart_container.side_effect = ValueError(
        "Not found"
    )

    with pytest.raises(HTTPException) as exc:
        ContainerController.restart(mock_docker_repository, "test")

    assert exc.value.status_code == 404


def test_restart_runtime_error(mock_docker_repository):
    """Test restart handles runtime errors."""
    mock_docker_repository.restart_container.side_effect = RuntimeError(
        "Failed"
    )

    with pytest.raises(HTTPException) as exc:
        ContainerController.restart(mock_docker_repository, "test")

    assert exc.value.status_code == 500


def test_get_logs_success(mock_docker_repository):
    """Test get_logs returns container logs."""
    mock_docker_repository.get_logs.return_value = [
        "Log line 1",
        "Log line 2",
    ]

    result = ContainerController.get_logs(
        mock_docker_repository, "test", tail=10
    )

    assert isinstance(result, ContainerLogs)
    assert result.container == "test"
    assert len(result.lines) == 2
    assert result.tail == 2


def test_get_logs_not_found(mock_docker_repository):
    """Test get_logs handles not found error."""
    mock_docker_repository.get_logs.side_effect = ValueError("Not found")

    with pytest.raises(HTTPException) as exc:
        ContainerController.get_logs(mock_docker_repository, "test")

    assert exc.value.status_code == 404


def test_get_logs_error(mock_docker_repository):
    """Test get_logs handles errors."""
    mock_docker_repository.get_logs.side_effect = Exception("Failed")

    with pytest.raises(HTTPException) as exc:
        ContainerController.get_logs(mock_docker_repository, "test")

    assert exc.value.status_code == 500


def test_get_stats_success(mock_docker_repository):
    """Test get_stats returns container statistics."""
    mock_docker_repository.get_stats.return_value = {
        "cpu_percent": 2.5,
        "memory_usage_mb": 100.0,
        "memory_limit_mb": 2048.0,
        "memory_percent": 4.88,
        "network_rx_mb": 10.0,
        "network_tx_mb": 5.0,
    }

    result = ContainerController.get_stats(mock_docker_repository, "test")

    assert isinstance(result, ContainerStats)
    assert result.cpu_percent == 2.5
    assert result.memory_usage_mb == 100.0


def test_get_stats_not_found(mock_docker_repository):
    """Test get_stats handles not found error."""
    mock_docker_repository.get_stats.side_effect = ValueError("Not found")

    with pytest.raises(HTTPException) as exc:
        ContainerController.get_stats(mock_docker_repository, "test")

    assert exc.value.status_code == 404


def test_get_stats_generic_error(mock_docker_repository):
    """Test get_stats handles generic errors."""
    mock_docker_repository.get_stats.side_effect = Exception(
        "Generic error"
    )

    with pytest.raises(HTTPException) as exc:
        ContainerController.get_stats(mock_docker_repository, "test")

    assert exc.value.status_code == 500
    assert "Failed to get stats" in exc.value.detail
