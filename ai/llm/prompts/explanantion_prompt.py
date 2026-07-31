"""Prompt templates for MatterMind explainability output.

This module builds prompts that turn numeric model predictions into
professional English explanations and next-step guidance.
"""

from __future__ import annotations

from typing import Dict, Sequence

EXPLANATION_PROMPT_TEMPLATE = (
    "You are an expert materials engineer and sustainability analyst. "
    "Translate the following prediction results into concise, professional English. "
    "Include a condition summary, a short rationale, and a practical recommendation.\n\n"
    "Prediction values:\n{predictions}\n\n"
    "Provide the explanation as a short paragraph. "
    "Do not invent new predictions. Use the numeric values exactly as given."
)


def build_explanation_prompt(predictions: Dict[str, float]) -> str:
    """Build a prompt that asks an LLM to explain ML prediction results."""
    prediction_lines = "\n".join(
        f"- {key}: {value}" for key, value in predictions.items()
    )
    return EXPLANATION_PROMPT_TEMPLATE.format(predictions=prediction_lines)


def build_explanation_prompt_with_context(
    predictions: Dict[str, float],
    material_name: str | None = None,
    material_grade: str | None = None,
    condition: str | None = None,
) -> str:
    """Build an explanation prompt with additional material context."""
    context_fragments: Sequence[str] = []
    if material_name:
        context_fragments.append(f"Material Name: {material_name}")
    if material_grade:
        context_fragments.append(f"Material Grade: {material_grade}")
    if condition:
        context_fragments.append(f"Current Condition: {condition}")

    context_text = "\n".join(context_fragments)
    base_prompt = build_explanation_prompt(predictions)

    if context_text:
        return (
            f"{base_prompt}\n\n"
            "Use the following material context when writing the explanation:\n"
            f"{context_text}"
        )
    return base_prompt
