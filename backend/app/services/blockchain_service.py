import hashlib

from sqlalchemy.orm import Session

from backend.app.models.blockchain_record import BlockchainRecord


class BlockchainService:
    def __init__(self, db: Session):
        self.db = db

    def create_record(self, material_id: int, transaction_type: str):
        previous = (
            self.db.query(BlockchainRecord)
            .order_by(BlockchainRecord.id.desc())
            .first()
        )

        previous_hash = previous.block_hash if previous else "GENESIS"

        block_hash = hashlib.sha256(
            f"{material_id}{transaction_type}{previous_hash}".encode()
        ).hexdigest()

        record = BlockchainRecord(
            material_id=material_id,
            transaction_type=transaction_type,
            previous_hash=previous_hash,
            block_hash=block_hash,
        )

        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)

        return record

    def get_history(self, material_id: int):
        return (
            self.db.query(BlockchainRecord)
            .filter(BlockchainRecord.material_id == material_id)
            .all()
        )