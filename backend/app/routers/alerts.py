"""Alerts router - API endpoints for resource alerts."""

from fastapi import APIRouter

from app.controllers.alert_controller import AlertController
from app.schemas.alert import AlertsResponse

router = APIRouter(prefix="/api/v1/alerts", tags=["Alerts"])


@router.get("", response_model=AlertsResponse)
async def get_alerts() -> AlertsResponse:
    """Get all active resource alerts.

    Returns:
        Active alerts categorized by severity.

    Example:
        GET /api/v1/alerts
    """
    alerts = AlertController.check_all()

    critical = sum(1 for a in alerts if a["level"] == "critical")
    warning = sum(1 for a in alerts if a["level"] == "warning")
    info = sum(1 for a in alerts if a["level"] == "info")

    return AlertsResponse(
        alerts=alerts,
        critical_count=critical,
        warning_count=warning,
        info_count=info,
    )

