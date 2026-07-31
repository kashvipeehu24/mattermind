"""Report generation helpers for MatterMind explainability workflows.

This module centralizes report assembly and formatting logic that converts
prediction results, material context, and recommendations into a structured
report representation.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Optional


@dataclass(frozen=True)
class ReportSection:
    title: str
    content: str


@dataclass(frozen=True)
class MaterialReport:
    material_summary: str
    condition_summary: str
    sustainability_summary: str
    risk_analysis: str
    recommendations: str
    executive_summary: str

    def as_dict(self) -> Dict[str, str]:
        return {
            "material_summary": self.material_summary,
            "condition_summary": self.condition_summary,
            "sustainability_summary": self.sustainability_summary,
            "risk_analysis": self.risk_analysis,
            "recommendations": self.recommendations,
            "executive_summary": self.executive_summary,
        }


class ReportGenerationError(RuntimeError):
    """Raised when report generation fails."""


class ReportGenerator:
    """Builds structured reports from analysis and prediction data."""

    def build_report(
        self,
        material_context: List[str],
        predictions: Dict[str, float],
        recommendation_text: str,
        executive_summary: Optional[str] = None,
    ) -> MaterialReport:
        """Create a MaterialReport from provided content pieces."""
        if not material_context:
            raise ReportGenerationError("Material context is required to build a report.")

        material_summary = self._build_material_summary(material_context)
        condition_summary = self._build_condition_summary(predictions)
        sustainability_summary = self._build_sustainability_summary(predictions)
        risk_analysis = self._build_risk_analysis(predictions)
        recommendations = recommendation_text.strip()
        executive_summary = executive_summary or self._build_executive_summary(
            material_summary,
            condition_summary,
            sustainability_summary,
            risk_analysis,
            recommendations,
        )

        return MaterialReport(
            material_summary=material_summary,
            condition_summary=condition_summary,
            sustainability_summary=sustainability_summary,
            risk_analysis=risk_analysis,
            recommendations=recommendations,
            executive_summary=executive_summary,
        )

    def _build_material_summary(self, material_context: List[str]) -> str:
        return " ".join(material_context).strip()

    def _build_condition_summary(self, predictions: Dict[str, float]) -> str:
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

    def _build_sustainability_summary(self, predictions: Dict[str, float]) -> str:
        carbon_score = predictions.get("carbon score")
        if carbon_score is None:
            return "No sustainability indicators are available."

        if carbon_score <= 25:
            return "The material has a low carbon footprint relative to industry benchmarks."
        if carbon_score <= 50:
            return "The material has a moderate carbon footprint; opportunities exist to improve reuse and recycling."
        return "The material has a high carbon footprint and should be prioritized for sustainable reuse or recycling."

    def _build_risk_analysis(self, predictions: Dict[str, float]) -> str:
        failure_probability = predictions.get("failure probability")

        if failure_probability is None:
            return "Risk data is unavailable."

        if failure_probability <= 0.1:
            return "The risk profile is low and the material can continue in service with regular checks."
        if failure_probability <= 0.3:
            return "The risk profile is moderate; implement preventive maintenance and inspect critical components."
        return "The risk profile is high; immediate corrective action is recommended."

    def _build_executive_summary(
        self,
        material_summary: str,
        condition_summary: str,
        sustainability_summary: str,
        risk_analysis: str,
        recommendations: str,
    ) -> str:
        return (
            "Executive Summary:\n"
            f"{material_summary} "
            f"{condition_summary} "
            f"{sustainability_summary} "
            f"{risk_analysis} "
            f"Recommendations: {recommendations}"
        ).strip()
