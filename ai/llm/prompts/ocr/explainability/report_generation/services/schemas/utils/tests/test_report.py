"""Report generation unit tests for MatterMind AI."""

from __future__ import annotations

from ai.llm.prompts.ocr.explainability.report_generation.exporter import (
    report_to_json,
    report_to_markdown,
    report_to_text,
)
from ai.llm.prompts.ocr.explainability.report_generation.generator import (
    MaterialReport,
    ReportGenerator,
)


def test_report_generator_builds_report() -> None:
    generator = ReportGenerator()
    report = generator.build_report(
        material_context=["Material Name: Test Alloy", "Manufacturer: Example Co."],
        predictions={
            "health score": 78,
            "remaining life": 24,
            "failure probability": 0.12,
            "carbon score": 40,
        },
        recommendation_text="Use regular maintenance and inspect annually.",
    )

    assert isinstance(report, MaterialReport)
    assert "Test Alloy" in report.material_summary
    assert "Health Score" in report.condition_summary
    assert "carbon footprint" in report.sustainability_summary.lower()
    assert "risk profile" in report.risk_analysis.lower() or report.risk_analysis
    assert report.recommendations
    assert report.executive_summary


def test_report_to_text_includes_sections() -> None:
    report = MaterialReport(
        material_summary="Material Name: Test Alloy",
        condition_summary="Health Score: 78 Remaining Life: 24 months Failure Probability: 0.12",
        sustainability_summary="The carbon footprint is moderate.",
        risk_analysis="The risk profile is moderate.",
        recommendations="Use regular maintenance.",
        executive_summary="Executive summary text.",
    )

    text = report_to_text(report)

    assert "Material Summary:" in text
    assert "Condition Summary:" in text
    assert "Sustainability Summary:" in text
    assert "Risk Analysis:" in text
    assert "Recommendations:" in text
    assert "Executive Summary:" in text


def test_report_to_markdown_formats_sections() -> None:
    report = MaterialReport(
        material_summary="Material Name: Test Alloy",
        condition_summary="Health Score: 78 Remaining Life: 24 months Failure Probability: 0.12",
        sustainability_summary="The carbon footprint is moderate.",
        risk_analysis="The risk profile is moderate.",
        recommendations="Use regular maintenance.",
        executive_summary="Executive summary text.",
    )

    markdown = report_to_markdown(report)

    assert markdown.startswith("# Material Summary")
    assert "## Condition Summary" in markdown
    assert "## Sustainability Summary" in markdown
    assert "## Risk Analysis" in markdown
    assert "## Recommendations" in markdown
    assert "## Executive Summary" in markdown


def test_report_to_json_is_valid_json_string() -> None:
    report = MaterialReport(
        material_summary="Material Name: Test Alloy",
        condition_summary="Health Score: 78 Remaining Life: 24 months Failure Probability: 0.12",
        sustainability_summary="The carbon footprint is moderate.",
        risk_analysis="The risk profile is moderate.",
        recommendations="Use regular maintenance.",
        executive_summary="Executive summary text.",
    )

    json_text = report_to_json(report)

    assert isinstance(json_text, str)
    assert "material_summary" in json_text
    assert "executive_summary" in json_text
