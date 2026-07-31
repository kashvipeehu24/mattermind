"""Constants for MatterMind AI schema utilities.

This module contains shared values for validation, logging, and schema processing.
"""

from __future__ import annotations

DEFAULT_PREDICTION_RANGES: dict[str, tuple[float, float]] = {
    "health score": (0.0, 100.0),
    "remaining life": (0.0, 1000.0),
    "failure probability": (0.0, 1.0),
    "carbon score": (0.0, 100.0),
}

RECOMMENDATION_SECTIONS: tuple[str, ...] = (
    "repair_recommendation",
    "maintenance_recommendation",
    "reuse_recommendation",
    "recycling_recommendation",
    "risk_summary",
    "safety_warning",
)

REPORT_SECTIONS: tuple[str, ...] = (
    "material_summary",
    "condition_summary",
    "sustainability_summary",
    "risk_analysis",
    "recommendations",
    "executive_summary",
)

SUMMARY_SECTIONS: tuple[str, ...] = (
    "material_summary",
    "condition_summary",
    "sustainability_summary",
    "risk_overview",
)
