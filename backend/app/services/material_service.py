import uuid
import hashlib
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import or_

from backend.app.models.material import Material
from backend.app.models.material_history import MaterialHistory
from backend.app.schemas.material import MaterialCreate, MaterialUpdate
from backend.app.schemas.material_history import (
    MaterialHistoryResponse,
    MaterialPassportResponse,
)


class MaterialService:
    @staticmethod
    def get_material(db: Session, material_id: int) -> Optional[Material]:
        return db.query(Material).filter(Material.id == material_id).first()

    @staticmethod
    def get_materials(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        manufacturer: Optional[str] = None,
        material_type: Optional[str] = None,
        status: Optional[str] = None,
        category: Optional[str] = None,
        location: Optional[str] = None,
    ) -> List[Material]:
        query = db.query(Material)
        if manufacturer:
            query = query.filter(Material.manufacturer.ilike(f"%{manufacturer}%"))
        if material_type:
            query = query.filter(Material.material_type.ilike(f"%{material_type}%"))
        if status:
            query = query.filter(Material.status == status)
        if category:
            query = query.filter(Material.category == category)
        if location:
            query = query.filter(Material.location.ilike(f"%{location}%"))
        return query.offset(skip).limit(limit).all()

    @staticmethod
    def create_material(
        db: Session, material_in: MaterialCreate, current_user_id: int
    ) -> Material:
        db_material = Material(**material_in.model_dump())
        db.add(db_material)
        db.commit()
        db.refresh(db_material)

        # Audit History Log
        history = MaterialHistory(
            material_id=db_material.id,
            change_type="CREATED",
            changed_by_user_id=current_user_id,
            details=f"Material '{db_material.material_name}' created.",
        )
        db.add(history)
        db.commit()

        return db_material

    @staticmethod
    def update_material(
        db: Session,
        db_material: Material,
        material_in: MaterialUpdate,
        current_user_id: int,
    ) -> Material:
        update_data = material_in.model_dump(exclude_unset=True)
        changes = []
        for field, value in update_data.items():
            old_val = getattr(db_material, field, None)
            if old_val != value:
                changes.append(f"{field}: {old_val} -> {value}")
            setattr(db_material, field, value)

        db.add(db_material)
        db.commit()
        db.refresh(db_material)

        if changes:
            history = MaterialHistory(
                material_id=db_material.id,
                change_type="UPDATED",
                changed_by_user_id=current_user_id,
                details=f"Fields updated: {', '.join(changes)}",
            )
            db.add(history)
            db.commit()

        return db_material

    @staticmethod
    def delete_material(db: Session, db_material: Material) -> None:
        db.delete(db_material)
        db.commit()

    @staticmethod
    def search_materials(
        db: Session,
        material_name: Optional[str] = None,
        manufacturer: Optional[str] = None,
        category: Optional[str] = None,
        status: Optional[str] = None,
        tags: Optional[str] = None,
    ) -> List[Material]:
        query = db.query(Material)
        if material_name:
            query = query.filter(Material.material_name.ilike(f"%{material_name}%"))
        if manufacturer:
            query = query.filter(Material.manufacturer.ilike(f"%{manufacturer}%"))
        if category:
            query = query.filter(Material.category.ilike(f"%{category}%"))
        if status:
            query = query.filter(Material.status.ilike(f"%{status}%"))
        if tags:
            query = query.filter(Material.tags.ilike(f"%{tags}%"))
        return query.all()

    @staticmethod
    def get_material_history(
        db: Session, material_id: int
    ) -> List[MaterialHistory]:
        return (
            db.query(MaterialHistory)
            .filter(MaterialHistory.material_id == material_id)
            .order_by(MaterialHistory.timestamp.desc())
            .all()
        )

    @staticmethod
    def get_material_passport(
        db: Session, material_id: int
    ) -> Optional[MaterialPassportResponse]:
        material = MaterialService.get_material(db, material_id)
        if not material:
            return None

        passport_seed = f"PASSPORT-{material.id}-{material.material_name}-{material.created_at}"
        passport_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, passport_seed))
        hash_digest = hashlib.sha256(passport_seed.encode()).hexdigest()

        return MaterialPassportResponse(
            passport_id=passport_uuid,
            material_id=material.id,
            material_name=material.material_name,
            material_type=material.material_type,
            manufacturer=material.manufacturer or "Unknown",
            health_score=material.health_score,
            carbon_score=material.carbon_score,
            is_recyclable=material.is_recyclable or False,
            status=material.status or "Active",
            created_at=material.created_at,
            blockchain_hash=f"0x{hash_digest[:40]}",
            provenance_details={
                "category": material.category or "General",
                "density": material.density,
                "location": material.location or "Default Facility",
                "tags": material.tags or "",
                "verification_standard": "ISO-14040/14044-LCA",
            },
        )
