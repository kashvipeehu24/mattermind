from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.models.material import Material
from backend.app.schemas.material import MaterialCreate

router = APIRouter(
    prefix="/materials",
    tags=["Materials"]
)


@router.post("/")
def create_material(
    material: MaterialCreate,
    db: Session = Depends(get_db)
):
    new_material = Material(
        material_name=material.material_name,
        material_type=material.material_type,
        manufacturer=material.manufacturer,
        density=material.density,
    )

    db.add(new_material)
    db.commit()
    db.refresh(new_material)

    return new_material