"""OCR-related unit tests for MatterMind AI."""

from __future__ import annotations

from pathlib import Path

from ai.llm.prompts.ocr.document_parser import DocumentParser, extract_document_text
from ai.llm.prompts.ocr.pdf_reader import PDFReader
from ai.llm.prompts.ocr.image_reader import ImageOCRReader


def test_document_parser_unsupported_file(tmp_path: Path) -> None:
    file_path = tmp_path / "test.txt"
    file_path.write_text("Not supported", encoding="utf-8")
    parser = DocumentParser()

    try:
        parser.extract_text(file_path)
        assert False, "Expected FileNotFoundError or RuntimeError"
    except Exception as exc:
        assert isinstance(exc, (FileNotFoundError, RuntimeError))


def test_pdf_reader_unsupported_extension(tmp_path: Path) -> None:
    file_path = tmp_path / "document.docx"
    file_path.write_text("fake content", encoding="utf-8")

    try:
        PDFReader(file_path)
        assert False, "Expected ValueError for unsupported file extension"
    except ValueError as exc:
        assert ".docx" in str(exc)


def test_image_ocr_reader_unsupported_extension(tmp_path: Path) -> None:
    file_path = tmp_path / "image.gif"
    file_path.write_text("fake image", encoding="utf-8")

    try:
        ImageOCRReader(file_path)
        assert False, "Expected ValueError for unsupported image extension"
    except ValueError as exc:
        assert ".gif" in str(exc)


def test_extract_document_text_missing_file(tmp_path: Path) -> None:
    file_path = tmp_path / "missing.pdf"

    try:
        extract_document_text(file_path)
        assert False, "Expected FileNotFoundError for missing file"
    except FileNotFoundError:
        pass
