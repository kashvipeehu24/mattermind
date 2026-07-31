"""Recommendation unit tests for MatterMind AI."""

from __future__ import annotations

from ai.llm.prompts.ocr.explainability.report_generation.services.recommendation_service import (
    RecommendationService,
)


def test_recommendation_sections_for_high_health_score() -> None:
    predictions = {
        "health score": 90,
        "failure probability": 0.05,
        "carbon score": 20,
    }
    service = RecommendationService()
    sections = service.build_recommendation_sections(predictions)

    assert sections["repair_recommendation"]
    assert sections["maintenance_recommendation"]
    assert sections["reuse_recommendation"]
    assert sections["recycling_recommendation"]
    assert sections["risk_summary"]
    assert sections["safety_warning"]


def test_recommendation_text_contains_key_sections() -> None:
    predictions = {
        "health score": 45,
        "failure probability": 0.6,
        "carbon score": 75,
    }
    service = RecommendationService()
    text = service.build_recommendation_text(predictions)

    assert "Repair recommendation" in text or "Repair Recommendation" in text
    assert "Maintenance recommendation" in text or "Maintenance Recommendation" in text
    assert "Reuse recommendation" in text or "Reuse Recommendation" in text
    assert "Recycling recommendation" in text or "Recycling Recommendation" in text
    assert "Risk summary" in text or "Risk Summary" in text
    assert "Safety warning" in text or "Safety Warning" in text


def test_recommendation_warning_for_high_failure_probability() -> None:
    predictions = {
        "failure probability": 0.9,
    }
    service = RecommendationService()
    sections = service.build_recommendation_sections(predictions)

    assert "high failure risk" in sections["risk_summary"].lower() or "high" in sections["risk_summary"].lower()
    assert "do not operate" in sections["safety_warning"].lower() or "increase inspection" in sections["safety_warning"].lower()
