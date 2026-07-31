"""LLM response parsing utilities for MatterMind.

This module provides helpers to normalize raw model output and parse
structured content from text responses.
"""

from __future__ import annotations

import json
import re
from typing import Any, Dict, Optional


class ResponseParsingError(ValueError):
    """Raised when response parsing cannot succeed."""


class ResponseParser:
    """Parse raw LLM responses into normalized text or structured data."""

    JSON_BLOCK_REGEX = re.compile(r"\{.*\}", re.DOTALL)

    @staticmethod
    def normalize_text(text: str) -> str:
        """Clean and normalize raw text returned by the LLM."""
        if text is None:
            return ""

        normalized = text.strip()
        normalized = re.sub(r"\s+", " ", normalized)
        return normalized

    @classmethod
    def extract_json(cls, text: str) -> Dict[str, Any]:
        """Extract the first JSON object from a text response."""
        if not text:
            raise ResponseParsingError("No text available to parse JSON.")

        match = cls.JSON_BLOCK_REGEX.search(text)
        if match is None:
            raise ResponseParsingError("No JSON block found in the LLM response.")

        raw_json = match.group(0)
        try:
            return json.loads(raw_json)
        except json.JSONDecodeError as exc:
            raise ResponseParsingError(
                f"Failed to decode JSON from response: {exc.msg}"
            ) from exc

    @staticmethod
    def parse_key_values(text: str) -> Dict[str, str]:
        """Parse simple key/value pairs from a text response."""
        if not text:
            return {}

        result: Dict[str, str] = {}
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        for line in lines:
            if ":" not in line:
                continue
            key, value = line.split(":", 1)
            result[key.strip().lower()] = value.strip()
        return result

    @classmethod
    def parse_response(
        cls,
        text: str,
        prefer_json: bool = True,
    ) -> Dict[str, Any]:
        """Attempt to parse a response into structured data.

        If prefer_json is enabled, the parser first tries to extract a JSON
        object. If JSON extraction fails, it falls back to a simple key/value
        parser.
        """
        if prefer_json:
            try:
                return cls.extract_json(text)
            except ResponseParsingError:
                pass

        parsed = cls.parse_key_values(text)
        if not parsed:
            raise ResponseParsingError(
                "Response could not be parsed as JSON or key/value text."
            )
        return parsed

    @classmethod
    def parse_prediction_explanation(
        cls,
        text: str,
    ) -> str:
        """Return a normalized explanation string for prediction output."""
        return cls.normalize_text(text)

    @classmethod
    def parse_recommendation_text(
        cls,
        text: str,
    ) -> str:
        """Return a normalized recommendation summary text."""
        return cls.normalize_text(text)
