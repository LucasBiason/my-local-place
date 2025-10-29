"""Unit tests for container schemas."""

import pytest
from pydantic import ValidationError

from app.schemas.container import (
    ContainerAction,
    ContainerInfo,
    ContainerLogs,
    ContainerStats,
)


def test_container_info_valid():
    """Test ContainerInfo with valid data."""
    data = {
        "id": "abc123",
        "name": "test",
        "status": "running",
        "state": "running",
        "image": "test:latest",
        "ports": ["8000:8000/tcp"],
        "created": "2025-10-29T10:00:00Z",
        "running": True,
    }

    info = ContainerInfo(**data)

    assert info.name == "test"
    assert info.status == "running"
    assert info.running is True


def test_container_info_minimal():
    """Test ContainerInfo with minimal data."""
    data = {
        "id": "abc",
        "name": "test",
        "status": "exited",
        "state": "exited",
        "image": "test",
        "created": "2025-10-29T10:00:00Z",
        "running": False,
    }

    info = ContainerInfo(**data)

    assert info.ports == []
    assert info.running is False


def test_container_action_valid():
    """Test ContainerAction with valid data."""
    data = {"status": "success", "message": "Container started"}

    action = ContainerAction(**data)

    assert action.status == "success"
    assert "started" in action.message


def test_container_stats_valid():
    """Test ContainerStats with valid data."""
    data = {
        "cpu_percent": 2.5,
        "memory_usage_mb": 100.0,
        "memory_limit_mb": 2048.0,
        "memory_percent": 4.88,
        "network_rx_mb": 10.0,
        "network_tx_mb": 5.0,
    }

    stats = ContainerStats(**data)

    assert stats.cpu_percent == 2.5
    assert stats.memory_usage_mb == 100.0
    assert stats.network_rx_mb == 10.0


def test_container_logs_valid():
    """Test ContainerLogs with valid data."""
    data = {
        "container": "test",
        "lines": ["Log 1", "Log 2", "Log 3"],
        "tail": 3,
    }

    logs = ContainerLogs(**data)

    assert logs.container == "test"
    assert len(logs.lines) == 3
    assert logs.tail == 3


def test_container_logs_empty():
    """Test ContainerLogs with no logs."""
    data = {"container": "test", "lines": [], "tail": 0}

    logs = ContainerLogs(**data)

    assert logs.lines == []
    assert logs.tail == 0

