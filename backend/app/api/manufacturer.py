from typing import List, Optional, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query, Response
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.schemas.manufacturer import (
    ManufacturerCreate,
    ManufacturerUpdate,
    ManufacturerResponse,
)
from backend.app.services.manufacturer_service import ManufacturerService
from backend.app.api.deps import get_current_active_user, get_current_admin_user
from backend.app.models.user import User

router = APIRouter(
    prefix="/manufacturers",
    tags=["Manufacturers"],
    dependencies=[Depends(get_current_active_user)],
)


@router.get("/", response_model=List[ManufacturerResponse])
def read_manufacturers(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    country: Optional[str] = None,
    is_active: Optional[bool] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
) -> Any:
    return ManufacturerService.get_manufacturers(
        db, skip=skip, limit=limit, country=country, is_active=is_active, search=search
    )


@router.post(
    "/", response_model=ManufacturerResponse, status_code=status.HTTP_201_CREATED
)
def create_manufacturer(
    manufacturer_in: ManufacturerCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
) -> Any:
    return ManufacturerService.create_manufacturer(db, manufacturer_in)


@router.get("/{manufacturer_id}", response_model=ManufacturerResponse)
def read_manufacturer(manufacturer_id: int, db: Session = Depends(get_db)) -> Any:
    mfg = ManufacturerService.get_manufacturer(db, manufacturer_id)
    if not mfg:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Manufacturer not found"
        )
    return mfg


@router.put("/{manufacturer_id}", response_model=ManufacturerResponse)
def update_manufacturer(
    manufacturer_id: int,
    manufacturer_in: ManufacturerUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
) -> Any:
    db_mfg = ManufacturerService.get_manufacturer(db, manufacturer_id)
    if not db_mfg:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Manufacturer not found"
        )
    return ManufacturerService.update_manufacturer(db, db_mfg, manufacturer_in)


@router.delete("/{manufacturer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_manufacturer(
    manufacturer_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user),
):
    db_mfg = ManufacturerService.get_manufacturer(db, manufacturer_id)
    if not db_mfg:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Manufacturer not found"
        )
    ManufacturerService.delete_manufacturer(db, db_mfg)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
