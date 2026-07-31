"""Prediction schema definitions for MatterMind AI.

This module provides typed schemas for model prediction outputs and
conversion helpers for downstream explainability and reporting.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Optional


@dataclass(frozen=True)
class PredictionSchema:
    health_score: Optional[float] = None
    remaining_life: Optional[float] = None
    failure_probability: Optional[float] = None
    carbon_score: Optional[float] = None
    other: Dict[str, float] = None

    def __post_init__(self) -> None:
        object.__setattr__(self, "other", self.other or {})

    def as_dict(self) -> Dict[str, Optional[float]]:
        payload: Dict[str, Optional[float]] = {
            "health score": self.health_score,
            "remaining life": self.remaining_life,
            "failure probability": self.failure_probability,
            "carbon score": self.carbon_score,
        }
        payload.update(self.other)
        return payload

    @classmethod
    def from_dict(cls, values: Dict[str, Optional[float]]) -> "PredictionSchema":
        normalized = {key.lower(): value for key, value in values.items() if value is not None}
        return cls(
            health_score=normalized.get("health score"),
            remaining_life=normalized.get("remaining life"),
            failure_probability=normalized.get("failure probability"),
            carbon_score=normalized.get("carbon score"),
            other={
                key: value
                for key, value in normalized.items()
                if key not in {"health score", "remaining life", "failure probability", "carbon score"}
            },
        )

    def get(self, key: str, default: Optional[float] = None) -> Optional[float]:
        """Return a prediction value by normalized key."""
        normalized_key = key.lower()
        if normalized_key == "health score":
            return self.health_score if self.health_score is not None else default
        if normalized_key == "remaining life":
            return self.remaining_life if self.remaining_life is not None else default
        if normalized_key == "failure probability":
            return self.failure_probability if self.failure_probability is not None else default
        if normalized_key == "carbon score":
            return self.carbon_score if self.carbon_score is not None else default
        return self.other.get(normalized_key, default)
