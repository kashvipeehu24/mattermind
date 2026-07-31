"""Report templates for MatterMind AI report generation.

This module defines reusable templates for report sections and provides
helpers to format structured report content consistently.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Optional


REPORT_TEMPLATE = (
    "Material Summary:\n{material_summary}\n\n"
    "Condition Summary:\n{condition_summary}\n\n"
    "Sustainability Summary:\n{sustainability_summary}\n\n"
    "Risk Analysis:\n{risk_analysis}\n\n"
    "Recommendations:\n{recommendations}\n\n"
    "Executive Summary:\n{executive_summary}\n"
)


@dataclass(frozen=True)
class ReportTemplate:
    material_summary: str
    condition_summary: str
    sustainability_summary: str
    risk_analysis: str
    recommendations: str
    executive_summary: str

    def render(self) -> str:
        return REPORT_TEMPLATE.format(
            material_summary=self.material_summary,
            condition_summary=self.condition_summary,
            sustainability_summary=self.sustainability_summary,
            risk_analysis=self.risk_analysis,
            recommendations=self.recommendations,
            executive_summary=self.executive_summary,
        )


def render_report_template(report_data: Dict[str, str]) -> str:
    """Render the report template from a dictionary of report values."""
    return REPORT_TEMPLATE.format(
        material_summary=report_data.get("material_summary", ""),
        condition_summary=report_data.get("condition_summary", ""),
        sustainability_summary=report_data.get("sustainability_summary", ""),
        risk_analysis=report_data.get("risk_analysis", ""),
        recommendations=report_data.get("recommendations", ""),
        executive_summary=report_data.get("executive_summary", ""),
    )


def render_report_template_from_generator(
    report: ReportTemplate | None = None,
    report_data: Optional[Dict[str, str]] = None,
) -> str:
    """Render the appropriate report template from either a dataclass or dict."""
    if report is not None:
        return report.render()
    if report_data is not None:
        return render_report_template(report_data)
    raise ValueError("Either report or report_data must be provided.")
