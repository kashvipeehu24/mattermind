"""Image OCR utilities for MatterMind.

This module provides a simple wrapper for extracting text from image files using
Tesseract OCR. It is intended for use in the OCR/document understanding
pipeline.
"""

from __future__ import annotations

from pathlib import Path
from typing import Optional


class ImageOCRReaderError(RuntimeError):
    """Raised when image OCR extraction fails."""


class ImageOCRReader:
    """Reads text from image files using Tesseract OCR."""

    def __init__(self, file_path: Path | str) -> None:
        self.file_path = Path(file_path)
        self._validate_file()

    def _validate_file(self) -> None:
        if not self.file_path.exists():
            raise FileNotFoundError(f"Image file not found: {self.file_path}")

        if self.file_path.suffix.lower() not in {".png", ".jpg", ".jpeg", ".tiff", ".tif", ".bmp"}:
            raise ValueError(
                f"Unsupported image file extension: {self.file_path.suffix}. "
                "Expected one of .png, .jpg, .jpeg, .tiff, .tif, .bmp"
            )

    def extract_text(self) -> str:
        """Extract text from the image file using OCR and return normalized text."""
        pil_image = self._load_image()
        text = self._run_tesseract(pil_image)
        return self._normalize_text(text)

    def _load_image(self) -> object:
        try:
            from PIL import Image
        except ImportError as exc:
            raise ImageOCRReaderError(
                "Pillow is required for image OCR. Install pillow to continue."
            ) from exc

        try:
            return Image.open(self.file_path)
        except Exception as exc:
            raise ImageOCRReaderError(
                f"Failed to open image file: {self.file_path}"
            ) from exc

    def _run_tesseract(self, image: object) -> str:
        try:
            import pytesseract
        except ImportError as exc:
            raise ImageOCRReaderError(
                "pytesseract is required for image OCR. Install pytesseract and configure Tesseract."
            ) from exc

        try:
            return pytesseract.image_to_string(image)
        except Exception as exc:
            raise ImageOCRReaderError("Tesseract OCR failed during image processing.") from exc

    @staticmethod
    def _normalize_text(text: Optional[str]) -> str:
        if text is None:
            return ""
        return "\n".join(line.strip() for line in text.splitlines() if line.strip())


def extract_image_text(file_path: Path | str) -> str:
    """Extract OCR text from an image file path."""
    return ImageOCRReader(file_path).extract_text()
