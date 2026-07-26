from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException, status

from backend.app.models.manufacturer import Manufacturer
from backend.app.schemas.manufacturer import ManufacturerCreate, ManufacturerUpdate


class ManufacturerService:
    @staticmethod
    def get_manufacturer(db: Session, manufacturer_id: int) -> Optional[Manufacturer]:
        return (
            db.query(Manufacturer)
            .filter(Manufacturer.id == manufacturer_id)
            .first()
        )

    @staticmethod
    def get_manufacturer_by_name(db: Session, name: str) -> Optional[Manufacturer]:
        return (
            db.query(Manufacturer)
            .filter(Manufacturer.name.ilike(name.strip()))
            .first()
        )

    @staticmethod
    def get_manufacturers(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        country: Optional[str] = None,
        is_active: Optional[bool] = None,
        search: Optional[str] = None,
    ) -> List[Manufacturer]:
        query = db.query(Manufacturer)
        if country:
            query = query.filter(Manufacturer.country.ilike(f"%{country}%"))
        if is_active is not None:
            query = query.filter(Manufacturer.is_active == is_active)
        if search:
            search_pattern = f"%{search}%"
            query = query.filter(
                or_(
                    Manufacturer.name.ilike(search_pattern),
                    Manufacturer.code.ilike(search_pattern),
                    Manufacturer.country.ilike(search_pattern),
                )
            )
        return query.offset(skip).limit(limit).all()

    @staticmethod
    def create_manufacturer(
        db: Session, manufacturer_in: ManufacturerCreate
    ) -> Manufacturer:
        existing = ManufacturerService.get_manufacturer_by_name(
            db, manufacturer_in.name
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Manufacturer with this name already exists",
            )
        db_manufacturer = Manufacturer(**manufacturer_in.model_dump())
        db.add(db_manufacturer)
        db.commit()
        db.refresh(db_manufacturer)
        return db_manufacturer

    @staticmethod
    def update_manufacturer(
        db: Session, db_mfg: Manufacturer, manufacturer_in: ManufacturerUpdate
    ) -> Manufacturer:
        update_data = manufacturer_in.model_dump(exclude_unset=True)
        if "name" in update_data and update_data["name"]:
            new_name = update_data["name"].strip()
            if new_name.lower() != db_mfg.name.lower():
                existing = ManufacturerService.get_manufacturer_by_name(db, new_name)
                if existing:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Manufacturer name already taken",
                    )
        for field, value in update_data.items():
            setattr(db_mfg, field, value)
        db.add(db_mfg)
        db.commit()
        db.refresh(db_mfg)
        return db_mfg

    @staticmethod
    def delete_manufacturer(db: Session, db_mfg: Manufacturer) -> None:
        db.delete(db_mfg)
        db.commit()
