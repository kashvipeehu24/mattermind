"""OCR extraction orchestrator for MatterMind.

This module coordinates document text extraction, prompt-based parsing, and
preparation of structured material data for the AI service layer.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, Optional

from ai.llm.prompts.extraction_prompt import build_extraction_prompt
from ai.llm.prompts.ocr.document_parser import DocumentParser, extract_document_text
from ai.llm.response_parser import ResponseParser


class OCREngineError(RuntimeError):
    """Raised when OCR extraction or parsing fails."""


class OCREngine:
    """High-level extraction engine for OCR document understanding."""

    def __init__(self, parser: DocumentParser | None = None) -> None:
        self.parser = parser or DocumentParser()

    def extract_document(self, file_path: Path | str) -> str:
        """Extract raw text from a supported document file."""
        return extract_document_text(file_path)

    def extract_structured_information(
        self,
        file_path: Path | str,
        document_type: str = "material document",
        fields: Optional[list[str]] = None,
    ) -> Dict[str, Any]:
        """Extract structured material information from a document file."""
        try:
            raw_text = self.extract_document(file_path)
        except Exception as exc:
            raise OCREngineError("Failed to extract raw document text.") from exc

        prompt_text = build_extraction_prompt(
            document_text=raw_text,
            document_type=document_type,
            fields=fields,
        )

        return {
            "document_text": raw_text,
            "prompt_text": prompt_text,
            "fields": fields or [],
        }

    def parse_extraction_response(self, response_text: str) -> Dict[str, Any]:
        """Parse a text response from an LLM extraction prompt."""
        try:
            return ResponseParser.parse_response(response_text, prefer_json=True)
        except Exception as exc:
            raise OCREngineError("Failed to parse OCR extraction response.") from exc

    def extract_and_parse(
        self,
        file_path: Path | str,
        document_type: str = "material document",
        fields: Optional[list[str]] = None,
    ) -> Dict[str, Any]:
        """Extract document text and build a structured prompt for later parsing."""
        extracted = self.extract_structured_information(
            file_path=file_path,
            document_type=document_type,
            fields=fields,
        )
        return extracted


def build_ocr_extraction_payload(
    file_path: Path | str,
    document_type: str = "material document",
    fields: Optional[list[str]] = None,
) -> Dict[str, Any]:
    """Create an OCR extraction payload with raw text and prompt instructions."""
    engine = OCREngine()
    return engine.extract_structured_information(
        file_path=file_path,
        document_type=document_type,
        fields=fields,
    )


def parse_ocr_response(response_text: str) -> Dict[str, Any]:
    """Parse LLM OCR extraction responses into structured material data."""
    return OCREngine().parse_extraction_response(response_text)
