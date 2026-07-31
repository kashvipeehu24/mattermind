"""Material schema definitions for MatterMind AI.

This module defines typed schemas for material attributes and document payloads.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Optional


@dataclass(frozen=True)
class MaterialSchema:
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

    @classmethod
    def from_dict(cls, payload: Dict[str, Optional[str]]) -> "MaterialSchema":
        return cls(
            material_name=cls._normalize(payload.get("material_name")),
            composition=cls._normalize(payload.get("composition")),
            manufacturer=cls._normalize(payload.get("manufacturer")),
            density=cls._normalize(payload.get("density")),
            production_date=cls._normalize(payload.get("production_date")),
            strength=cls._normalize(payload.get("strength")),
            certification=cls._normalize(payload.get("certification")),
            material_grade=cls._normalize(payload.get("material_grade")),
            condition=cls._normalize(payload.get("condition")),
            raw_text=cls._normalize(payload.get("raw_text")),
            source=cls._normalize(payload.get("source")),
        )

    @staticmethod
    def _normalize(value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        normalized_value = value.strip()
        return normalized_value or None


@dataclass(frozen=True)
class MaterialExtractionPayload:
    """Payload used for document extraction results."""

    extracted_fields: MaterialSchema
    document_text: Optional[str] = None
    prompt_text: Optional[str] = None

    def as_dict(self) -> Dict[str, Optional[str]]:
        payload = self.extracted_fields.as_dict()
        payload["document_text"] = self.document_text
        payload["prompt_text"] = self.prompt_text
        return payload
