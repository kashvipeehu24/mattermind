"""Utility helpers for MatterMind AI schema processing.

This module provides reusable helpers for normalizing data,
validating payloads, and converting between dictionary structures.
"""

from __future__ import annotations

from typing import Any, Dict, Iterable, Optional


def normalize_string(value: Optional[str]) -> Optional[str]:
    """Normalize a string by stripping whitespace and empty values."""
    if value is None:
        return None
    normalized = value.strip()
    return normalized or None


def normalize_prediction_dict(values: Dict[str, Any]) -> Dict[str, float]:
    """Normalize numeric prediction values, preserving valid float entries."""
    normalized: Dict[str, float] = {}
    for key, value in values.items():
        if value is None:
            continue
        try:
            normalized[key.lower()] = float(value)
        except (TypeError, ValueError):
            continue
    return normalized


def normalize_text_payload(payload: Dict[str, Any]) -> Dict[str, Optional[str]]:
    """Normalize a dictionary of text fields by stripping and coercing."""
    normalized: Dict[str, Optional[str]] = {}
    for key, value in payload.items():
        if isinstance(value, str):
            normalized[key] = normalize_string(value)
        else:
            normalized[key] = None
    return normalized


def ensure_required_fields(payload: Dict[str, Any], required_fields: Iterable[str]) -> None:
    """Raise a ValueError if required fields are missing or empty."""
    missing = [field for field in required_fields if not payload.get(field)]
    if missing:
        raise ValueError(f"Missing required fields: {', '.join(missing)}")
