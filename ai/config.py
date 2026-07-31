"""Configuration constants for the MatterMind AI package.

This module centralizes AI settings, supported document types, prompt
locations, and environment-driven defaults.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from enum import Enum
from pathlib import Path
from typing import ClassVar, Iterable

AI_ROOT = Path(__file__).resolve().parent
PROMPT_DIR = AI_ROOT / "prompts"

DEFAULT_OCR_ENGINE = os.getenv("MATTERMIND_AI_OCR_ENGINE", "tesseract")
DEFAULT_LLM_PROVIDER = os.getenv("MATTERMIND_AI_LLM_PROVIDER", "openai")
DEFAULT_LLM_MODEL = os.getenv("MATTERMIND_AI_LLM_MODEL", "gpt-4o-mini")
DEFAULT_SUMMARY_LENGTH = int(os.getenv("MATTERMIND_AI_SUMMARY_LENGTH", "250"))
DEFAULT_RECOMMENDATION_FORMAT = os.getenv(
    "MATTERMIND_AI_RECOMMENDATION_FORMAT", "bullet"
)

SUPPORTED_DOCUMENT_EXTENSIONS = frozenset(
    {".pdf", ".docx", ".png", ".jpg", ".jpeg", ".tiff", ".tif"}
)
SUPPORTED_OCR_EXTENSIONS = frozenset({".pdf", ".png", ".jpg", ".jpeg", ".tiff", ".tif"})

MATERIAL_ATTRIBUTES = (
    "material_name",
    "composition",
    "manufacturer",
    "density",
    "production_date",
    "strength",
    "certification",
    "material_grade",
    "condition",
)


class PromptKey(str, Enum):
    """Named prompt keys for the AI prompt template library."""

    DOCUMENT_EXTRACTION = "document_extraction"
    MATERIAL_UNDERSTANDING = "material_understanding"
    EXPLAIN_PREDICTION = "explain_prediction"
    GENERATE_RECOMMENDATION = "generate_recommendation"
    GENERATE_REPORT = "generate_report"
    SUMMARY = "summary"


class DocumentCategory(str, Enum):
    """Document categories supported by the OCR and extraction pipeline."""

    PDF = "pdf"
    MATERIAL_CERTIFICATE = "material_certificate"
    INSPECTION_REPORT = "inspection_report"
    LAB_REPORT = "lab_report"


@dataclass(frozen=True)
class AIConfig:
    """Runtime configuration for the MatterMind AI package."""

    ocr_engine: str = DEFAULT_OCR_ENGINE
    llm_provider: str = DEFAULT_LLM_PROVIDER
    llm_model: str = DEFAULT_LLM_MODEL
    summary_length: int = DEFAULT_SUMMARY_LENGTH
    recommendation_format: str = DEFAULT_RECOMMENDATION_FORMAT
    supported_document_extensions: frozenset[str] = SUPPORTED_DOCUMENT_EXTENSIONS
    supported_ocr_extensions: frozenset[str] = SUPPORTED_OCR_EXTENSIONS
    prompt_directory: Path = PROMPT_DIR

    PACKAGE_NAME: ClassVar[str] = "mattermind.ai"
    VERSION: ClassVar[str] = "0.1.0"

    @classmethod
    def from_env(cls) -> "AIConfig":
        """Create configuration from environment variables."""
        return cls(
            ocr_engine=os.getenv("MATTERMIND_AI_OCR_ENGINE", cls.ocr_engine),
            llm_provider=os.getenv("MATTERMIND_AI_LLM_PROVIDER", cls.llm_provider),
            llm_model=os.getenv("MATTERMIND_AI_LLM_MODEL", cls.llm_model),
            summary_length=int(os.getenv("MATTERMIND_AI_SUMMARY_LENGTH", cls.summary_length)),
            recommendation_format=os.getenv(
                "MATTERMIND_AI_RECOMMENDATION_FORMAT", cls.recommendation_format
            ),
        )

    def is_supported_document(self, extension: str) -> bool:
        """Check if a document extension is supported by the AI pipeline."""
        return extension.lower() in self.supported_document_extensions

    def is_supported_ocr(self, extension: str) -> bool:
        """Check if a document extension is supported by OCR."""
        return extension.lower() in self.supported_ocr_extensions


def normalize_extension(path: str) -> str:
    """Normalize a file path to a lowercase extension."""
    return Path(path).suffix.lower()


def get_prompt_path(prompt_key: PromptKey) -> Path:
    """Return the file path for a named prompt template."""
    return PROMPT_DIR / f"{prompt_key.value}.txt"


def supported_extensions() -> Iterable[str]:
    """Return supported document extensions for the AI package."""
    return sorted(SUPPORTED_DOCUMENT_EXTENSIONS)
