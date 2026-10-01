from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.services.blockchain_service import BlockchainService

router = APIRouter(
    prefix="/blockchain",
    tags=["Blockchain"]
)


@router.post("/record/{material_id}")
def create_blockchain_record(
    material_id: int,
    transaction_type: str,
    db: Session = Depends(get_db),
):
    service = BlockchainService(db)
    return service.create_record(
        material_id=material_id,
        transaction_type=transaction_type,
    )


@router.get("/history/{material_id}")
def get_blockchain_history(
    material_id: int,
    db: Session = Depends(get_db),
):
    service = BlockchainService(db)
    return service.get_history(material_id)