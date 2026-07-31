"""Explainability unit tests for MatterMind AI."""

from __future__ import annotations

from ai.llm.prompts.ocr.explainability.explainer import Explainer
from ai.llm.prompts.ocr.explainability.formatter import ExplanationFormatter


def test_explainer_generates_text_for_predictions() -> None:
    predictions = {
        "Health Score": 82,
        "Remaining Life": 14,
        "Failure Probability": 0.15,
        "Carbon Score": 48,
    }

    explainer = Explainer()
    explanation = explainer.explain_prediction(
        predictions=predictions,
        material_name="High-strength steel",
        material_grade="A36",
        condition="Good",
    )

    assert "High-strength steel" in explanation
    assert "good condition" in explanation.lower()
    assert "preventive maintenance" in explanation.lower()


def test_explanation_formatter_splits_sections() -> None:
    text = (
        "Material: Test Material. Grade: A36. Condition: Good. "
        "This material is currently in good condition with normal wear. "
        "A detailed inspection is recommended, and preventive maintenance should be scheduled as soon as possible."
    )

    formatter = ExplanationFormatter()
    sections = formatter.split_into_sections(text)

    assert isinstance(sections, dict)
    assert sections


def test_explanation_normalization_removes_extra_whitespace() -> None:
    text = "  This   is  a   test explanation.  "
    formatter = ExplanationFormatter()
    normalized = formatter.normalize_text(text)

    assert normalized == "This is a test explanation."
