"""Explainability helper for MatterMind AI.

This module converts prediction results into professional, human-readable
explanations and recommendation guidance.
"""

from __future__ import annotations

from typing import Dict, Optional


class ExplanationError(RuntimeError):
    """Raised when explanation generation fails."""


class Explainer:
    """Generate professional English explanations from prediction values."""

    def explain_prediction(
        self,
        predictions: Dict[str, float],
        material_name: Optional[str] = None,
        material_grade: Optional[str] = None,
        condition: Optional[str] = None,
    ) -> str:
        """Convert model predictions into a human-readable explanation."""
        if not predictions:
            raise ExplanationError("No prediction values were provided for explanation.")

        header_lines: list[str] = []
        if material_name:
            header_lines.append(f"Material: {material_name}")
        if material_grade:
            header_lines.append(f"Grade: {material_grade}")
        if condition:
            header_lines.append(f"Condition: {condition}")

        prediction_sentences = self._format_prediction_sentences(predictions)
        recommendation = self._build_recommendation(predictions=predictions)

        payload = []
        if header_lines:
            payload.append(". ".join(header_lines) + ".")
        payload.append(prediction_sentences)
        payload.append(recommendation)

        return "\n\n".join(payload)

    def _format_prediction_sentences(self, predictions: Dict[str, float]) -> str:
        lines = []
        for key, value in predictions.items():
            if key.lower() == "health score":
                lines.append(self._describe_health_score(value))
            elif key.lower() == "remaining life":
                lines.append(self._describe_remaining_life(value))
            elif key.lower() == "failure probability":
                lines.append(self._describe_failure_probability(value))
            elif key.lower() == "carbon score":
                lines.append(self._describe_carbon_score(value))
            else:
                lines.append(f"{key}: {value}.")
        return " ".join(lines)

    def _describe_health_score(self, value: float) -> str:
        if value >= 85:
            return "This material is currently in excellent condition with strong performance margins."
        if value >= 70:
            return "This material is currently in good condition with normal wear."
        if value >= 50:
            return "This material shows moderate degradation and should be monitored closely."
        return "This material is in poor condition and requires immediate attention."

    def _describe_remaining_life(self, value: float) -> str:
        return f"The estimated remaining service life is {value:.1f} months."

    def _describe_failure_probability(self, value: float) -> str:
        if value <= 0.1:
            return "The risk of failure is low under normal operating conditions."
        if value <= 0.3:
            return "The risk of failure is moderate and proactive maintenance is recommended."
        return "The risk of failure is high and immediate corrective action is advised."

    def _describe_carbon_score(self, value: float) -> str:
        if value <= 25:
            return "The carbon impact is low compared to industry norms."
        if value <= 50:
            return "The carbon impact is moderate, and efficiency improvements should be explored."
        return "The carbon impact is elevated; prioritize low-carbon alternatives and reuse."

    def _build_recommendation(self, predictions: Dict[str, float]) -> str:
        normalized = {key.lower(): value for key, value in predictions.items()}
        if normalized.get("health score", 0) < 60:
            return (
                "A detailed inspection is recommended, and preventive maintenance "
                "should be scheduled as soon as possible."
            )
        return (
            "Continue regular inspections and consider preventive maintenance "
            "within the next 12 months."
        )
