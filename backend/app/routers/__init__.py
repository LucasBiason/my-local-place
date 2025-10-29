"""API routers."""

from .alerts import router as alerts_router
from .cleanup import router as cleanup_router
from .containers import router as containers_router
from .health import router as health_router
from .system import router as system_router
from .volumes import router as volumes_router

__all__ = [
    "health_router",
    "containers_router",
    "system_router",
    "alerts_router",
    "volumes_router",
    "cleanup_router",
]
