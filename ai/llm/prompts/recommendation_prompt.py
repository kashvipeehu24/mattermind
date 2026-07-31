"""Prompt templates for MatterMind recommendation generation.

This module builds prompts for the AI recommendation engine, asking the
model to provide repair, maintenance, reuse, recycling, risk, and safety
recommendations.
"""

from __future__ import annotations

from typing import Dict, Sequence

RECOMMENDATION_PROMPT_TEMPLATE = (
    "You are an expert materials engineer and sustainability advisor. "
    "Review the given material condition and prediction summary, then "
    "produce concise and actionable recommendations.\n\n"
    "Material Context:\n{material_context}\n\n"
    "Predictions:\n{predictions}\n\n"
    "Deliver the result as a numbered list with the following sections:"
    " Repair Recommendation, Maintenance Recommendation, Reuse Recommendation, "
    "Recycling Recommendation, Risk Summary, Safety Warning."
)


def build_recommendation_prompt(
    predictions: Dict[str, float],
    material_context: Sequence[str] | None = None,
) -> str:
    """Build a prompt that asks an LLM to generate material recommendations."""
    material_context = material_context or []
    material_context_text = "\n".join(material_context) if material_context else "No additional context provided."
    prediction_lines = "\n".join(f"- {key}: {value}" for key, value in predictions.items())

    return RECOMMENDATION_PROMPT_TEMPLATE.format(
        material_context=material_context_text,
        predictions=prediction_lines,
    )


def build_recommendation_prompt_from_report(
    summary_text: str,
    predictions: Dict[str, float],
) -> str:
    """Build a recommendation prompt using a summary and prediction values."""
    return build_recommendation_prompt(
        predictions=predictions,
        material_context=["Report Summary:", summary_text.strip()],
    )


def get_recommendation_sections() -> tuple[str, ...]:
    """Return the ordered recommendation sections used by the prompt."""
    return (
        "Repair Recommendation",
        "Maintenance Recommendation",
        "Reuse Recommendation",
        "Recycling Recommendation",
        "Risk Summary",
        "Safety Warning",
    )
