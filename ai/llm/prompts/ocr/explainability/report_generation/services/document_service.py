"""Document service for MatterMind report generation.

This module converts OCR and extraction payloads into normalized material
context that can be consumed by reporting, explanation, and recommendation
services.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Optional


DEFAULT_DOCUMENT_FIELDS = (
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


class DocumentServiceError(RuntimeError):
    """Raised when document context creation fails."""


@dataclass(frozen=True)
class MaterialDocumentContext:
    """Normalized document context for MatterMind material reports."""

    material_name: Optional[str] = None
    composition: Optional[str] = None
    manufacturer: Optional[str] = None
    density: Optional[str] = None
    production_date: Optional[str] = None
    strength: Optional[str] = None
    certification: Optional[str] = None
    material_grade: Optional[str] = None
    condition: Optional[str] = None
    raw_text: Optional[str] = None
    source: Optional[str] = None

    def as_dict(self) -> Dict[str, Optional[str]]:
        """Return the document context as a serializable dictionary."""
        return {
            "material_name": self.material_name,
            "composition": self.composition,
            "manufacturer": self.manufacturer,
            "density": self.density,
            "production_date": self.production_date,
            "strength": self.strength,
            "certification": self.certification,
            "material_grade": self.material_grade,
            "condition": self.condition,
            "raw_text": self.raw_text,
            "source": self.source,
        }

    def to_context_lines(self) -> List[str]:
        """Convert context values into non-empty summary lines."""
        lines: List[str] = []
        if self.material_name:
            lines.append(f"Material Name: {self.material_name}")
        if self.composition:
            lines.append(f"Composition: {self.composition}")
        if self.manufacturer:
            lines.append(f"Manufacturer: {self.manufacturer}")
        if self.density:
            lines.append(f"Density: {self.density}")
        if self.production_date:
            lines.append(f"Production Date: {self.production_date}")
        if self.strength:
            lines.append(f"Strength: {self.strength}")
        if self.certification:
            lines.append(f"Certification: {self.certification}")
        if self.material_grade:
            lines.append(f"Material Grade: {self.material_grade}")
        if self.condition:
            lines.append(f"Condition: {self.condition}")
        return lines


class DocumentService:
    """Service for building structured document context from extraction results."""

    def build_context(
        self,
        extraction_payload: Dict[str, Optional[str]],
        source: Optional[str] = None,
    ) -> MaterialDocumentContext:
        """Build normalized material document context from OCR extraction data."""
        if extraction_payload is None:
            raise DocumentServiceError("Extraction payload must not be None.")

        normalized_data = {field: self._normalize_value(extraction_payload.get(field)) for field in DEFAULT_DOCUMENT_FIELDS}
        raw_text = self._normalize_value(extraction_payload.get("document_text"))

        return MaterialDocumentContext(
            material_name=normalized_data["material_name"],
            composition=normalized_data["composition"],
            manufacturer=normalized_data["manufacturer"],
            density=normalized_data["density"],
            production_date=normalized_data["production_date"],
            strength=normalized_data["strength"],
            certification=normalized_data["certification"],
            material_grade=normalized_data["material_grade"],
            condition=normalized_data["condition"],
            raw_text=raw_text,
            source=source,
        )

    def build_summary_context(self, context: MaterialDocumentContext) -> List[str]:
        """Return ordered summary context lines for report generation."""
        lines = context.to_context_lines()
        if not lines and context.raw_text:
            lines = [context.raw_text[:1000].strip()]
        return lines

    @staticmethod
    def _normalize_value(value: Optional[str]) -> Optional[str]:
        """Normalize a string value, stripping whitespace and converting empty strings to None."""
        if value is None:
            return None
        normalized = value.strip()
        return normalized or None
