"""Report service for MatterMind AI report workflows.

This module orchestrates report generation by combining document context,
predictions, explanations, and recommendations into a final report payload.
"""

from __future__ import annotations

from pathlib import Path
from typing import Dict, List, Optional

from ai.llm.prompts.ocr.explainability.report_generation.exporter import (
    report_to_json,
    report_to_markdown,
    report_to_text,
    save_report_json,
    save_report_markdown,
    save_report_text,
)
from ai.llm.prompts.ocr.explainability.report_generation.generator import (
    MaterialReport,
    ReportGenerator,
)


class ReportServiceError(RuntimeError):
    """Raised when report service orchestration fails."""


class ReportService:
    """Orchestrates full report generation and export for MatterMind."""

    def __init__(self, generator: ReportGenerator | None = None) -> None:
        self.generator = generator or ReportGenerator()

    def build_report(
        self,
        material_context: List[str],
        predictions: Dict[str, float],
        recommendation_text: str,
        executive_summary: Optional[str] = None,
    ) -> MaterialReport:
        """Create a structured MaterialReport from analysis inputs."""
        try:
            return self.generator.build_report(
                material_context=material_context,
                predictions=predictions,
                recommendation_text=recommendation_text,
                executive_summary=executive_summary,
            )
        except Exception as exc:
            raise ReportServiceError("Failed to build the material report.") from exc

    def render_text_report(self, report: MaterialReport) -> str:
        """Render a MaterialReport as plain text."""
        return report_to_text(report)

    def render_markdown_report(self, report: MaterialReport) -> str:
        """Render a MaterialReport as markdown."""
        return report_to_markdown(report)

    def serialize_report(self, report: MaterialReport) -> str:
        """Serialize a MaterialReport as JSON."""
        return report_to_json(report)

    def save_text_report(self, report: MaterialReport, path: Path | str) -> Path:
        """Save the report as plain text to disk."""
        return save_report_text(report, path)

    def save_markdown_report(self, report: MaterialReport, path: Path | str) -> Path:
        """Save the report as markdown to disk."""
        return save_report_markdown(report, path)

    def save_json_report(
        self,
        report: MaterialReport,
        path: Path | str,
        indent: int = 2,
    ) -> Path:
        """Save the report as JSON to disk."""
        return save_report_json(report, path, indent=indent)
