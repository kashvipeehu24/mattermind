"""PDF reader utilities for MatterMind OCR and document extraction.

This module provides a small wrapper to extract text from PDF files.
It is intended to be used by the OCR/document understanding pipeline to
prepare text for prompt-based extraction.
"""

from __future__ import annotations

from pathlib import Path
from typing import Iterator


class PDFReaderError(RuntimeError):
    """Raised when PDF text extraction fails."""


class PDFReader:
    """Reads text from a PDF document."""

    def __init__(self, file_path: Path | str) -> None:
        self.file_path = Path(file_path)
        self._validate_file()

    def _validate_file(self) -> None:
        if not self.file_path.exists():
            raise FileNotFoundError(f"PDF file not found: {self.file_path}")

        if self.file_path.suffix.lower() != ".pdf":
            raise ValueError(f"Unsupported file extension: {self.file_path.suffix}. Expected .pdf")

    def extract_text(self) -> str:
        """Extract text from the full PDF and return it as a single string."""
        reader = self._load_pdf_reader()
        text_parts: list[str] = []

        for page_text in self.iter_pages(reader):
            if page_text:
                text_parts.append(page_text)

        return "\n\n".join(text_parts).strip()

    def iter_pages(self, reader: object) -> Iterator[str]:
        """Yield text for each page in the PDF document."""
        pages = getattr(reader, "pages", None)
        if pages is None:
            raise PDFReaderError("Loaded PDF reader does not expose pages.")

        for page in pages:
            page_text = self._extract_page_text(page)
            yield page_text or ""

    def _load_pdf_reader(self) -> object:
        try:
            import pypdf

            return pypdf.PdfReader(str(self.file_path))
        except ImportError:
            try:
                import PyPDF2

                return PyPDF2.PdfReader(str(self.file_path))
            except ImportError as exc:
                raise PDFReaderError(
                    "No supported PDF reader library is installed. "
                    "Install pypdf or PyPDF2 to enable PDF extraction."
                ) from exc
        except Exception as exc:
            raise PDFReaderError(
                f"Unable to load PDF document: {self.file_path}"
            ) from exc

    @staticmethod
    def _extract_page_text(page: object) -> str | None:
        if hasattr(page, "extract_text"):
            return page.extract_text()

        if hasattr(page, "extractText"):
            return page.extractText()

        raise PDFReaderError("PDF page object does not support text extraction.")


def extract_pdf_text(file_path: Path | str) -> str:
    """Extract text from a PDF file path using the PDFReader helper."""
    return PDFReader(file_path).extract_text()
