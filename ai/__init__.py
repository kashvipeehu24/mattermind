"""MatterMind AI package entrypoint.

The package exposes the AI module functions that backend code will call.
This module keeps the package surface small and uses lazy imports so
future submodules can be added without requiring all components at import time.
"""

from __future__ import annotations

from importlib import import_module
from typing import Any

__all__ = [
    "PACKAGE_NAME",
    "VERSION",
    "extract_document",
    "extract_material_information",
    "explain_prediction",
    "generate_recommendation",
    "generate_report",
    "generate_summary",
]

PACKAGE_NAME = "mattermind.ai"
VERSION = "0.1.0"

_LAZY_MODULE_MAP = {
    "extract_document": "ai.ocr.engine",
    "extract_material_information": "ai.document_understanding",
    "explain_prediction": "ai.explainability",
    "generate_recommendation": "ai.recommendations",
    "generate_report": "ai.report_generation",
    "generate_summary": "ai.report_generation",
}


def _load(name: str) -> Any:
    module_name = _LAZY_MODULE_MAP.get(name)
    if module_name is None:
        raise AttributeError(f"module {__name__!r} has no attribute {name!r}")

    module = import_module(module_name)
    try:
        return getattr(module, name)
    except AttributeError as exc:
        raise AttributeError(
            f"module {module_name!r} does not export {name!r}"
        ) from exc


def __getattr__(name: str) -> Any:
    if name in __all__:
        return _load(name)
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")


def __dir__() -> list[str]:
    return sorted(__all__ + list(globals().keys()))
