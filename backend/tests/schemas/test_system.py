"""Unit tests for system schemas."""

from app.schemas.system import DiskInfo, MemoryInfo, SystemMetrics


def test_memory_info_valid():
    """Test MemoryInfo with valid data."""
    data = {"total_gb": 32.0, "used_gb": 18.5, "percent": 57.8}

    memory = MemoryInfo(**data)

    assert memory.total_gb == 32.0
    assert memory.used_gb == 18.5
    assert memory.percent == 57.8


def test_disk_info_valid():
    """Test DiskInfo with valid data."""
    data = {"total_gb": 1000.0, "used_gb": 600.0, "percent": 60.0}

    disk = DiskInfo(**data)

    assert disk.total_gb == 1000.0
    assert disk.used_gb == 600.0
    assert disk.percent == 60.0


def test_system_metrics_valid():
    """Test SystemMetrics with valid data."""
    data = {
        "cpu_percent": 25.5,
        "memory": {"total_gb": 32.0, "used_gb": 18.5, "percent": 57.8},
        "disk": {"total_gb": 1000.0, "used_gb": 600.0, "percent": 60.0},
    }

    metrics = SystemMetrics(**data)

    assert metrics.cpu_percent == 25.5
    assert metrics.memory.total_gb == 32.0
    assert metrics.disk.percent == 60.0


def test_system_metrics_nested_models():
    """Test SystemMetrics with nested models."""
    memory = MemoryInfo(total_gb=16.0, used_gb=8.0, percent=50.0)
    disk = DiskInfo(total_gb=500.0, used_gb=250.0, percent=50.0)

    metrics = SystemMetrics(cpu_percent=15.0, memory=memory, disk=disk)

    assert isinstance(metrics.memory, MemoryInfo)
    assert isinstance(metrics.disk, DiskInfo)
    assert metrics.memory.used_gb == 8.0

