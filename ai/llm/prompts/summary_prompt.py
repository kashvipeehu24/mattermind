"""Prompt templates for MatterMind summary generation.

This module builds prompts for generating material and condition summaries,
condensed executive summaries, and sustainability-focused overviews.
"""

from __future__ import annotations

from typing import Dict, Sequence

SUMMARY_PROMPT_TEMPLATE = (
    "You are an expert materials analyst tasked with summarizing key material "
    "information. Review the provided context and prediction data, then return "
    "a concise summary for executives and operations teams.\n\n"
    "Material Context:\n{material_context}\n\n"
    "Predictions:\n{predictions}\n\n"
    "Summary Requirements:\n"
    "- Material Summary\n"
    "- Condition Summary\n"
    "- Sustainability Summary\n"
    "- Risk Overview\n\n"
    "Write the response as clearly labeled sections."
)


def build_summary_prompt(
    predictions: Dict[str, float],
    material_context: Sequence[str] | None = None,
    summary_focus: str | None = None,
) -> str:
    """Build a prompt for generating a concise AI summary."""
    material_context = material_context or []
    material_context_text = "\n".join(material_context) if material_context else "No additional context provided."
    prediction_lines = "\n".join(f"- {key}: {value}" for key, value in predictions.items())

    base_prompt = SUMMARY_PROMPT_TEMPLATE.format(
        material_context=material_context_text,
        predictions=prediction_lines,
    )

    if summary_focus:
        return (
            f"{base_prompt}\n\n"
            f"Focus the summary on the following aspect: {summary_focus}\n"
        )
    return base_prompt


def build_material_summary_prompt(
    material_details: Sequence[str],
    predictions: Dict[str, float],
) -> str:
    """Build a summary prompt specifically for material and condition details."""
    return build_summary_prompt(
        predictions=predictions,
        material_context=["Material Details:"] + list(material_details),
    )


def get_summary_sections() -> tuple[str, ...]:
    """Return the expected summary sections used by the prompt."""
    return (
        "Material Summary",
        "Condition Summary",
        "Sustainability Summary",
        "Risk Overview",
    )
