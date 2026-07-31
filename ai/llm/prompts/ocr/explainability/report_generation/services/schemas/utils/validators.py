"""Validation utilities for MatterMind AI schema processing.

This module provides reusable validators for payload shape, field presence,
and prediction value ranges.
"""

from __future__ import annotations

from typing import Any, Dict, Iterable, Optional


class ValidationError(ValueError):
    """Raised when validation of AI payloads fails."""


def assert_required_fields(payload: Dict[str, Any], required_fields: Iterable[str]) -> None:
    """Assert that all required fields are present and non-empty in a payload."""
    missing = [field for field in required_fields if not payload.get(field)]
    if missing:
        raise ValidationError(f"Required fields are missing or empty: {', '.join(missing)}")


def validate_prediction_ranges(predictions: Dict[str, Any], ranges: Optional[Dict[str, tuple[float, float]]] = None) -> None:
    """Validate that prediction values fall within expected numeric ranges."""
    if ranges is None:
        ranges = {
            "health score": (0.0, 100.0),
            "remaining life": (0.0, 1000.0),
            "failure probability": (0.0, 1.0),
            "carbon score": (0.0, 100.0),
        }

    for key, value in predictions.items():
        normalized_key = key.lower()
        if normalized_key not in ranges:
            continue
        try:
            numeric_value = float(value)
        except (TypeError, ValueError) as exc:
            raise ValidationError(f"Prediction value for '{key}' must be numeric.") from exc

        min_value, max_value = ranges[normalized_key]
        if not (min_value <= numeric_value <= max_value):
            raise ValidationError(
                f"Prediction '{key}' must be between {min_value} and {max_value}, got {numeric_value}."
            )


def validate_text_fields(payload: Dict[str, Any], text_fields: Iterable[str]) -> None:
    """Validate that specified text fields are strings and not empty."""
    for field in text_fields:
        value = payload.get(field)
        if value is None:
            raise ValidationError(f"Text field '{field}' is required.")
        if not isinstance(value, str) or not value.strip():
            raise ValidationError(f"Text field '{field}' must be a non-empty string.")


def validate_prediction_payload(payload: Dict[str, Any]) -> None:
    """Validate a prediction payload for required keys and value ranges."""
    validate_prediction_ranges(payload)
