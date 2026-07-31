"""Prompt templates for MatterMind document extraction.

This module generates prompts for the OCR/document understanding stage,
asking the model to extract structured material information.
"""

from __future__ import annotations

from typing import Iterable, Sequence

DEFAULT_EXTRACTION_FIELDS: tuple[str, ...] = (
    "Material Name",
    "Composition",
    "Manufacturer",
    "Density",
    "Production Date",
    "Strength",
    "Certification",
    "Material Grade",
    "Condition",
)

EXTRACTION_PROMPT_TEMPLATE = (
    "Extract the requested material data from the document text below. "
    "Return the result as valid JSON with the exact keys provided. "
    "If a field is not present, set its value to null.\n\n"
    "Document Type: {document_type}\n"
    "Requested Fields: {field_list}\n\n"
    "Document Text:\n{document_text}\n\n"
    "JSON Output:"
)


def build_extraction_prompt(
    document_text: str,
    document_type: str = "material document",
    fields: Sequence[str] | None = None,
) -> str:
    """Build a prompt that asks an LLM to extract structured material information."""
    field_list = ", ".join(fields or DEFAULT_EXTRACTION_FIELDS)
    return EXTRACTION_PROMPT_TEMPLATE.format(
        document_type=document_type,
        field_list=field_list,
        document_text=document_text.strip(),
    )


def build_ocr_extraction_prompt(document_text: str) -> str:
    """Build a prompt that asks an LLM to extract information from OCR text."""
    return build_extraction_prompt(
        document_text=document_text,
        document_type="OCR text from material certificate or report",
    )


def get_default_extraction_fields() -> tuple[str, ...]:
    """Return the default fields used for material extraction prompts."""
    return DEFAULT_EXTRACTION_FIELDS
