"""Explanation service for MatterMind AI report workflows.

This module wraps the explainability components to produce professional
explanations from prediction values and render them into structured sections.
"""

from __future__ import annotations

from typing import Dict, Optional

from ai.llm.prompts.ocr.explainability.explainer import Explainer, ExplanationError
from ai.llm.prompts.ocr.explainability.formatter import (
    ExplanationFormatter,
    ExplanationFormatterError,
)


class ExplanationServiceError(RuntimeError):
    """Raised when explanation generation or formatting fails."""


class ExplanationService:
    """Serves explainable AI output for MatterMind report generation."""

    def __init__(
        self,
        explainer: Explainer | None = None,
        formatter: ExplanationFormatter | None = None,
    ) -> None:
        self.explainer = explainer or Explainer()
        self.formatter = formatter or ExplanationFormatter()

    def generate_explanation(
        self,
        predictions: Dict[str, float],
        material_name: Optional[str] = None,
        material_grade: Optional[str] = None,
        condition: Optional[str] = None,
    ) -> str:
        """Generate a normalized explanation for model predictions."""
        if not predictions:
            raise ExplanationServiceError("Predictions are required to generate an explanation.")

        try:
            explanation_text = self.explainer.explain_prediction(
                predictions=predictions,
                material_name=material_name,
                material_grade=material_grade,
                condition=condition,
            )
        except ExplanationError as exc:
            raise ExplanationServiceError("Failed to generate explanation text.") from exc

        try:
            return self.formatter.normalize_text(explanation_text)
        except ExplanationFormatterError as exc:
            raise ExplanationServiceError("Failed to normalize explanation text.") from exc

    def generate_explanation_sections(
        self,
        predictions: Dict[str, float],
        material_name: Optional[str] = None,
        material_grade: Optional[str] = None,
        condition: Optional[str] = None,
    ) -> Dict[str, str]:
        """Generate explanation text and split it into labeled sections."""
        explanation_text = self.generate_explanation(
            predictions=predictions,
            material_name=material_name,
            material_grade=material_grade,
            condition=condition,
        )

        try:
            return self.formatter.split_into_sections(explanation_text)
        except ExplanationFormatterError as exc:
            raise ExplanationServiceError("Failed to split explanation into sections.") from exc

    def generate_explanation_payload(
        self,
        predictions: Dict[str, float],
        material_name: Optional[str] = None,
        material_grade: Optional[str] = None,
        condition: Optional[str] = None,
    ) -> Dict[str, object]:
        """Return explanation text and structured sections in a payload."""
        explanation_text = self.generate_explanation(
            predictions=predictions,
            material_name=material_name,
            material_grade=material_grade,
            condition=condition,
        )
        sections = self.generate_explanation_sections(
            predictions=predictions,
            material_name=material_name,
            material_grade=material_grade,
            condition=condition,
        )
        return {
            "explanation_text": explanation_text,
            "explanation_sections": sections,
        }
