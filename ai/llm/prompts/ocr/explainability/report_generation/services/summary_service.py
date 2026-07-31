"""Summary service for MatterMind AI report workflows.

This module creates concise summary text for material, condition, sustainability,
and risk using document context and prediction values.
"""

from __future__ import annotations

from typing import Dict, List, Optional


class SummaryServiceError(RuntimeError):
    """Raised when summary generation fails."""


class SummaryService:
    """Builds summary sections for MatterMind reports."""

    def build_material_summary(
        self,
        document_context: List[str],
        additional_notes: Optional[str] = None,
    ) -> str:
        """Build the material summary section from document context."""
        if not document_context:
            raise SummaryServiceError("Document context is required for material summary.")

        summary = " ".join(document_context).strip()
        if additional_notes:
            summary = f"{summary} {additional_notes.strip()}"
        return summary

    def build_condition_summary(self, predictions: Dict[str, float]) -> str:
        """Build the condition summary from model predictions."""
        if not predictions:
            raise SummaryServiceError("Predictions are required for condition summary.")

        health_score = predictions.get("health score")
        remaining_life = predictions.get("remaining life")
        failure_probability = predictions.get("failure probability")

        lines: List[str] = []
        if health_score is not None:
            lines.append(f"Health Score: {health_score}")
        if remaining_life is not None:
            lines.append(f"Remaining Life: {remaining_life} months")
        if failure_probability is not None:
            lines.append(f"Failure Probability: {failure_probability}")

        return " ".join(lines).strip()

    def build_sustainability_summary(self, predictions: Dict[str, float]) -> str:
        """Build the sustainability summary from prediction values."""
        carbon_score = predictions.get("carbon score")

        if carbon_score is None:
            return "Sustainability indicators are unavailable." 

        if carbon_score <= 25:
            return "The carbon footprint is low compared to comparable materials."
        if carbon_score <= 50:
            return "The carbon footprint is moderate; consider reuse and recycling to improve sustainability."
        return "The carbon footprint is high; prioritize sustainable reuse or recycling options."

    def build_risk_overview(self, predictions: Dict[str, float]) -> str:
        """Build the risk overview section from predictions."""
        failure_probability = predictions.get("failure probability")

        if failure_probability is None:
            return "Risk information is not available."
        if failure_probability <= 0.1:
            return "Risk is low; continue monitoring under standard inspection practices."
        if failure_probability <= 0.3:
            return "Risk is moderate; implement preventive measures and regular inspections."
        return "Risk is high; immediate corrective action is recommended."

    def build_summary_payload(
        self,
        document_context: List[str],
        predictions: Dict[str, float],
        additional_notes: Optional[str] = None,
    ) -> Dict[str, str]:
        """Create a summary payload containing all summary sections."""
        return {
            "material_summary": self.build_material_summary(document_context, additional_notes),
            "condition_summary": self.build_condition_summary(predictions),
            "sustainability_summary": self.build_sustainability_summary(predictions),
            "risk_overview": self.build_risk_overview(predictions),
        }
