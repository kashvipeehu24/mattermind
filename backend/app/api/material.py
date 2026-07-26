from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, Response
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.schemas.material import (
    MaterialCreate,
    MaterialUpdate,
    MaterialResponse,
)
from backend.app.schemas.material_history import (
    MaterialHistoryResponse,
    MaterialPassportResponse,
)
from backend.app.services.material_service import MaterialService
from backend.app.api.deps import get_current_active_user, get_current_admin_user
from backend.app.models.user import User

router = APIRouter(
    prefix="/materials",
    tags=["Materials"],
    dependencies=[Depends(get_current_active_user)],
)


@router.post("/", response_model=MaterialResponse, status_code=status.HTTP_201_CREATED)
def create_material(
    material_in: MaterialCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return MaterialService.create_material(db, material_in, current_user.id)


@router.get("/", response_model=List[MaterialResponse])
def read_materials(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    manufacturer: Optional[str] = None,
    material_type: Optional[str] = None,
    status: Optional[str] = None,
    category: Optional[str] = None,
    location: Optional[str] = None,
    db: Session = Depends(get_db),
):
    return MaterialService.get_materials(
        db,
        skip=skip,
        limit=limit,
        manufacturer=manufacturer,
        material_type=material_type,
        status=status,
        category=category,
        location=location,
    )


@router.get("/search", response_model=List[MaterialResponse])
def search_materials(
    material_name: Optional[str] = None,
    manufacturer: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    tags: Optional[str] = None,
    db: Session = Depends(get_db),
):
    return MaterialService.search_materials(
        db,
        material_name=material_name,
        manufacturer=manufacturer,
        category=category,
        status=status,
        tags=tags,
    )


@router.get("/{material_id}", response_model=MaterialResponse)
def read_material(material_id: int, db: Session = Depends(get_db)):
    material = MaterialService.get_material(db, material_id)
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Material not found"
        )
    return material


@router.get("/{material_id}/history", response_model=List[MaterialHistoryResponse])
def read_material_history(material_id: int, db: Session = Depends(get_db)):
    material = MaterialService.get_material(db, material_id)
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Material not found"
        )
    return MaterialService.get_material_history(db, material_id)


@router.get("/{material_id}/passport", response_model=MaterialPassportResponse)
def read_material_passport(material_id: int, db: Session = Depends(get_db)):
    passport = MaterialService.get_material_passport(db, material_id)
    if not passport:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Material not found"
        )
    return passport


@router.put("/{material_id}", response_model=MaterialResponse)
def update_material(
    material_id: int,
    material_in: MaterialUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    db_material = MaterialService.get_material(db, material_id)
    if not db_material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Material not found"
        )
    return MaterialService.update_material(
        db, db_material, material_in, current_user.id
    )


@router.delete("/{material_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_material(
    material_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    db_material = MaterialService.get_material(db, material_id)
    if not db_material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Material not found"
        )
    MaterialService.delete_material(db, db_material)
    return Response(status_code=status.HTTP_204_NO_CONTENT)