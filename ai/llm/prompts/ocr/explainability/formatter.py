"""Explanation formatting utilities for MatterMind AI.

This module provides helpers for structuring explainable AI output and converting
raw text into labeled explanation sections.
"""

from __future__ import annotations

import re
from typing import Dict, List


class ExplanationFormatterError(RuntimeError):
    """Raised when explanation formatting cannot be completed."""


class ExplanationFormatter:
    """Format explainability output into structured sections."""

    SECTION_HEADER_REGEX = re.compile(r"^(?P<header>[A-Za-z ]+):", re.MULTILINE)

    @staticmethod
    def normalize_text(text: str) -> str:
        """Normalize raw explanation text by collapsing whitespace and trimming."""
        if text is None:
            return ""
        normalized = re.sub(r"\s+", " ", text).strip()
        return normalized

    @classmethod
    def split_into_sections(cls, text: str) -> Dict[str, str]:
        """Split explanation text into labeled sections."""
        normalized = cls.normalize_text(text)
        if not normalized:
            return {}

        sections: Dict[str, str] = {}
        current_header: str | None = None
        current_body_lines: List[str] = []

        for line in normalized.split(". "):
            match = cls.SECTION_HEADER_REGEX.match(line)
            if match:
                if current_header is not None:
                    sections[current_header] = ". ".join(current_body_lines).strip()
                current_header = match.group("header").strip()
                body = line[match.end() :].strip()
                current_body_lines = [body] if body else []
            else:
                current_body_lines.append(line)

        if current_header is not None:
            sections[current_header] = ". ".join(current_body_lines).strip()

        return sections

    @staticmethod
    def join_sections(sections: Dict[str, str]) -> str:
        """Join labeled sections back into a formatted explanation string."""
        return "\n\n".join(
            f"{header}: {body}" for header, body in sections.items() if body
        )
