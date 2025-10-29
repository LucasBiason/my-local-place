"""Unit tests for health schema."""

from app.schemas.health import HealthResponse


def test_health_response_valid():
    """Test HealthResponse with valid data."""
    data = {
        "status": "healthy",
        "docker_connected": True,
        "timestamp": "2025-10-29T20:00:00.000000",
        "version": "2.0.0",
    }

    response = HealthResponse(**data)

    assert response.status == "healthy"
    assert response.docker_connected is True
    assert response.version == "2.0.0"


def test_health_response_docker_disconnected():
    """Test HealthResponse when Docker is disconnected."""
    data = {
        "status": "healthy",
        "docker_connected": False,
    }

    response = HealthResponse(**data)

    assert response.docker_connected is False
    assert response.version == "2.0.0"


def test_health_response_default_timestamp():
    """Test HealthResponse generates default timestamp."""
    data = {"status": "healthy", "docker_connected": True}

    response = HealthResponse(**data)

    assert response.timestamp is not None
    assert isinstance(response.timestamp, str)

