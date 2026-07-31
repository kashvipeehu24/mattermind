# MatterMind AI Package

## Overview

`ai/` contains the MatterMind AI module only. This package is responsible for:

- OCR and document extraction
- material document understanding
- explainable AI message generation
- recommendation generation
- report generation
- prompt template management

The AI package is designed as a reusable Python library that backend developers can call from FastAPI without adding routes or service endpoints here.

## Structure

- `llm/` — reusable prompt templates and prompt builder utilities
- `prompts/` — prompt documentation and prompt configuration files
- `ocr/` — OCR and document parsing engines
- `explainability/` — natural language explanations for ML predictions
- `report_generation/` — report creation and summary generation
- `services/` — orchestration logic for AI workflows
- `utils/` — shared utilities, parsing helpers, and schema helpers
- `tests/` — unit tests for AI components

## Public API

The package exports functions through `ai/__init__.py`:

- `extract_document()`
- `extract_material_information()`
- `explain_prediction()`
- `generate_recommendation()`
- `generate_report()`
- `generate_summary()`

## Integration

Backend developers can integrate with the AI module via imports, for example:

```python
from ai import extract_document, explain_prediction, generate_report
```

Because this package exposes only functions, the backend can remain decoupled and call AI services without depending on implementation details.

## Responsibility

This package does not contain:

- FastAPI routes
- backend API code
- frontend code
- blockchain code
- ML model training logic

The `ai/` package only prepares structured document extraction, explanations, recommendations, and report content.

## Notes

- Keep each module small and single-purpose
- Use type hints and docstrings throughout
- Avoid duplicate logic
- Keep package boundaries clean for later production integration
