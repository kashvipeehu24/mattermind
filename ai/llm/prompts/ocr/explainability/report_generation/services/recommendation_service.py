"""Recommendation service for MatterMind AI report workflows.

This module generates structured recommendation text for repair, maintenance,
reuse, recycling, risk, and safety guidance based on model predictions.
"""

from __future__ import annotations

from typing import Dict, List, Optional, Sequence


RECOMMENDATION_SECTIONS = (
    "repair_recommendation",
    "maintenance_recommendation",
    "reuse_recommendation",
    "recycling_recommendation",
    "risk_summary",
    "safety_warning",
)


class RecommendationServiceError(RuntimeError):
    """Raised when recommendation generation fails."""


class RecommendationService:
    """Generate structured recommendations for MatterMind reports."""

    def build_recommendation_text(
        self,
        predictions: Dict[str, float],
        material_context: Sequence[str] | None = None,
    ) -> str:
        """Build a single concatenated recommendation text block."""
        sections = self.build_recommendation_sections(predictions, material_context)
        return "\n\n".join(
            f"{self._format_section_title(key)}\n{value}"
            for key, value in sections.items()
            if value
        )

    def build_recommendation_sections(
        self,
        predictions: Dict[str, float],
        material_context: Sequence[str] | None = None,
    ) -> Dict[str, str]:
        """Generate structured recommendation sections from prediction values."""
        if predictions is None:
            raise RecommendationServiceError("Predictions are required for recommendation generation.")

        context = ", ".join(material_context) if material_context else ""
        sections: Dict[str, str] = {
            "repair_recommendation": self._build_repair_recommendation(predictions, context),
            "maintenance_recommendation": self._build_maintenance_recommendation(predictions, context),
            "reuse_recommendation": self._build_reuse_recommendation(predictions, context),
            "recycling_recommendation": self._build_recycling_recommendation(predictions, context),
            "risk_summary": self._build_risk_summary(predictions),
            "safety_warning": self._build_safety_warning(predictions),
        }
        return sections

    def _build_repair_recommendation(self, predictions: Dict[str, float], context: str) -> str:
        repair_text = ""
        health_score = self._get_prediction(predictions, "health score")
        failure_probability = self._get_prediction(predictions, "failure probability")

        if health_score is not None and health_score < 60:
            repair_text = (
                "Inspect the material promptly and address any damage or corrosion. "
                "Repair critical defects before returning the material to service."
            )
        elif failure_probability is not None and failure_probability > 0.3:
            repair_text = (
                "Focus repair efforts on high-risk areas to reduce the likelihood of failure. "
                "Document any replacement parts or structural reinforcements needed."
            )
        else:
            repair_text = "No immediate repair is required, but continue monitoring material condition."

        if context and health_score is not None and health_score < 85:
            repair_text += " Use the provided material context when planning repairs."

        return repair_text

    def _build_maintenance_recommendation(self, predictions: Dict[str, float], context: str) -> str:
        health_score = self._get_prediction(predictions, "health score")
        remaining_life = self._get_prediction(predictions, "remaining life")

        if health_score is not None and health_score < 70:
            base = "Schedule preventive maintenance immediately and inspect components for wear."
        else:
            base = "Maintain the material according to normal inspection intervals."

        if remaining_life is not None and remaining_life < 12:
            base += " Prioritize maintenance within the next 12 months."

        if context and health_score is not None and health_score < 80:
            base += " Record current condition details for future trend analysis."

        return base

    def _build_reuse_recommendation(self, predictions: Dict[str, float], context: str) -> str:
        health_score = self._get_prediction(predictions, "health score")
        carbon_score = self._get_prediction(predictions, "carbon score")

        if health_score is not None and health_score >= 70 and carbon_score is not None and carbon_score <= 50:
            return (
                "Consider reusing this material in applications with compatible load requirements. "
                "Reuse is preferred over new procurement where safety and performance allow."
            )

        if health_score is not None and health_score >= 70:
            return (
                "The material may be suitable for reuse in non-critical applications after inspection."
            )

        return "Reuse is not recommended unless the material is fully refurbished and recertified."

    def _build_recycling_recommendation(self, predictions: Dict[str, float], context: str) -> str:
        carbon_score = self._get_prediction(predictions, "carbon score")
        failure_probability = self._get_prediction(predictions, "failure probability")

        if carbon_score is not None and carbon_score > 50:
            return (
                "A recycling path should be evaluated to reduce carbon impact and recover valuable materials."
            )
        if failure_probability is not None and failure_probability > 0.4:
            return (
                "Because the material has a high failure risk, recycling or safe disposal should be considered."
            )
        return "Recycling is a good sustainability option when the material is removed from service."

    def _build_risk_summary(self, predictions: Dict[str, float]) -> str:
        health_score = self._get_prediction(predictions, "health score")
        failure_probability = self._get_prediction(predictions, "failure probability")

        if health_score is not None and health_score < 50:
            return "The material is high risk; avoid continued use until remediation is complete."
        if failure_probability is not None and failure_probability > 0.3:
            return "The material presents moderate to high failure risk and requires active risk mitigation."
        return "The material is currently in acceptable condition with standard risk controls."

    def _build_safety_warning(self, predictions: Dict[str, float]) -> str:
        failure_probability = self._get_prediction(predictions, "failure probability")

        if failure_probability is None:
            return "Follow standard safety guidelines during handling and inspection."
        if failure_probability > 0.5:
            return "Do not operate the material without a formal safety review and corrective actions."
        if failure_probability > 0.25:
            return "Increase inspection frequency and ensure personnel follow safety procedures."
        return "Continue with normal safety monitoring and maintenance practices."

    def _format_section_title(self, section_key: str) -> str:
        return section_key.replace("_", " ").capitalize()

    @staticmethod
    def _get_prediction(predictions: Dict[str, float], key: str) -> Optional[float]:
        return predictions.get(key) or predictions.get(key.lower())
