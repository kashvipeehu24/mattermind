"""Report exporting utilities for MatterMind AI.

This module provides helpers for serializing and exporting structured
report data in text, markdown, and JSON formats.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Dict

from .generator import MaterialReport
from .templates import render_report_template


class ReportExportError(RuntimeError):
    """Raised when exporting a report fails."""


def report_to_dict(report: MaterialReport) -> Dict[str, str]:
    """Convert a MaterialReport to a serializable dictionary."""
    return report.as_dict()


def report_to_text(report: MaterialReport) -> str:
    """Render a MaterialReport as plain text using the report template."""
    return render_report_template(report.as_dict())


def report_to_markdown(report: MaterialReport) -> str:
    """Render a MaterialReport as markdown text."""
    data = report.as_dict()
    markdown_lines = [
        f"# Material Summary\n{data['material_summary']}",
        f"## Condition Summary\n{data['condition_summary']}",
        f"## Sustainability Summary\n{data['sustainability_summary']}",
        f"## Risk Analysis\n{data['risk_analysis']}",
        f"## Recommendations\n{data['recommendations']}",
        f"## Executive Summary\n{data['executive_summary']}",
    ]
    return "\n\n".join(markdown_lines).strip()


def report_to_json(report: MaterialReport, indent: int = 2) -> str:
    """Serialize a MaterialReport to a JSON string."""
    try:
        return json.dumps(report.as_dict(), indent=indent)
    except TypeError as exc:
        raise ReportExportError("Failed to serialize report to JSON.") from exc


def save_report_text(report: MaterialReport, path: Path | str) -> Path:
    """Save the report as plain text to the provided file path."""
    rendered_text = report_to_text(report)
    file_path = Path(path)
    file_path.write_text(rendered_text, encoding="utf-8")
    return file_path


def save_report_markdown(report: MaterialReport, path: Path | str) -> Path:
    """Save the report as markdown to the provided file path."""
    rendered_markdown = report_to_markdown(report)
    file_path = Path(path)
    file_path.write_text(rendered_markdown, encoding="utf-8")
    return file_path


def save_report_json(report: MaterialReport, path: Path | str, indent: int = 2) -> Path:
    """Save the report as JSON to the provided file path."""
    rendered_json = report_to_json(report, indent=indent)
    file_path = Path(path)
    file_path.write_text(rendered_json, encoding="utf-8")
    return file_path
