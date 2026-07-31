"""Prompt templates for MatterMind report generation.

This module builds prompts for generating material and condition summaries,
executive summaries, risk analyses, and sustainability reports.
"""

from __future__ import annotations

from typing import Dict, Sequence

REPORT_PROMPT_TEMPLATE = (
    "You are an expert analyst creating a professional material condition report. "
    "Use the provided context and prediction summary to generate a structured report.\n\n"
    "Material Context:\n{material_context}\n\n"
    "Predictions:\n{predictions}\n\n"
    "Report Sections:\n"
    "- Material Summary\n"
    "- Condition Summary\n"
    "- Sustainability Summary\n"
    "- Risk Analysis\n"
    "- Recommendations\n"
    "- Executive Summary\n\n"
    "Produce each section as a clearly labeled block.
"
)


def build_report_prompt(
    predictions: Dict[str, float],
    material_context: Sequence[str] | None = None,
    report_instructions: str | None = None,
) -> str:
    """Build a prompt that asks an LLM to generate a complete material report."""
    material_context = material_context or []
    material_context_text = "\n".join(material_context) if material_context else "No additional context provided."
    prediction_lines = "\n".join(f"- {key}: {value}" for key, value in predictions.items())

    instructions_text = "\n\nAdditional instructions:\n" + report_instructions.strip() if report_instructions else ""

    return REPORT_PROMPT_TEMPLATE.format(
        material_context=material_context_text,
        predictions=prediction_lines,
    ) + instructions_text


def build_executive_summary_prompt(
    report_text: str,
    material_name: str | None = None,
) -> str:
    """Build a prompt to generate an executive summary from a report."""
    material_note = f"Material Name: {material_name}\n" if material_name else ""
    return (
        "You are a senior analyst summarizing a material report for executives. "
        "Write a concise executive summary that highlights key findings, risks, and action items.\n\n"
        f"{material_note}"
        "Report Text:\n"
        f"{report_text.strip()}\n\n"
        "Executive Summary:"
    )


def get_report_sections() -> tuple[str, ...]:
    """Return the expected report sections that the report prompt requests."""
    return (
        "Material Summary",
        "Condition Summary",
        "Sustainability Summary",
        "Risk Analysis",
        "Recommendations",
        "Executive Summary",
    )
