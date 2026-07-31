"""Document parser for MatterMind OCR workflows.

This module routes supported document types to the appropriate reader and
provides utility helpers for working with extracted text.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Iterator

from ai.llm.prompts.ocr.image_reader import extract_image_text
from ai.llm.prompts.ocr.pdf_reader import extract_pdf_text

SUPPORTED_IMAGE_EXTENSIONS = {
    ".png",
    ".jpg",
    ".jpeg",
    ".tiff",
    ".tif",
    ".bmp",
}
SUPPORTED_DOCUMENT_EXTENSIONS = SUPPORTED_IMAGE_EXTENSIONS | {".pdf"}


class DocumentParserError(RuntimeError):
    """Raised when document parsing fails."""


@dataclass(frozen=True)
class DocumentParser:
    """Orchestrates text extraction from supported document files."""

    max_chunk_words: int = 1500
    chunk_overlap: int = 200

    def extract_text(self, file_path: Path | str) -> str:
        """Extract text from a supported document file."""
        file_path = Path(file_path)
        self._validate_file(file_path)

        suffix = file_path.suffix.lower()
        if suffix == ".pdf":
            return extract_pdf_text(file_path)

        if suffix in SUPPORTED_IMAGE_EXTENSIONS:
            return extract_image_text(file_path)

        raise DocumentParserError(
            f"Unsupported document extension: {suffix}. "
            f"Supported extensions: {sorted(SUPPORTED_DOCUMENT_EXTENSIONS)}"
        )

    def extract_text_chunks(self, text: str) -> list[str]:
        """Split extracted text into overlapping chunks for prompt processing."""
        return list(self.iter_text_chunks(text))

    def iter_text_chunks(self, text: str) -> Iterator[str]:
        """Yield overlapping chunks of the extracted text."""
        if not text:
            return

        words = text.split()
        chunk_size = max(1, self.max_chunk_words)
        overlap = max(0, min(self.chunk_overlap, chunk_size - 1))
        step = chunk_size - overlap

        for start in range(0, len(words), step):
            chunk_words = words[start : start + chunk_size]
            yield " ".join(chunk_words)

    def infer_document_type(self, file_path: Path | str) -> str:
        """Infer the document type from the file extension."""
        suffix = Path(file_path).suffix.lower()
        if suffix == ".pdf":
            return "pdf"
        if suffix in SUPPORTED_IMAGE_EXTENSIONS:
            return "image"
        return "unknown"

    @staticmethod
    def _validate_file(file_path: Path) -> None:
        if not file_path.exists():
            raise FileNotFoundError(f"Document file not found: {file_path}")

        if file_path.suffix.lower() not in SUPPORTED_DOCUMENT_EXTENSIONS:
            raise DocumentParserError(
                f"Unsupported document extension: {file_path.suffix}. "
                f"Supported extensions: {sorted(SUPPORTED_DOCUMENT_EXTENSIONS)}"
            )


def extract_document_text(file_path: Path | str) -> str:
    """Extract document text from a supported file path."""
    parser = DocumentParser()
    return parser.extract_text(file_path)


def extract_document_text_chunks(file_path: Path | str) -> list[str]:
    """Extract document text and return it as overlapping chunks."""
    parser = DocumentParser()
    text = parser.extract_text(file_path)
    return parser.extract_text_chunks(text)
