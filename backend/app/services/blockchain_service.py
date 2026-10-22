import hashlib
import time
from typing import List, Optional

from sqlalchemy.orm import Session

from backend.app.models.blockchain_record import BlockchainRecord
from backend.app.models.material import Material
from backend.app.services.web3_adapter import web3_adapter


class BlockchainService:
    def __init__(self, db: Optional[Session] = None):
        self.db = db

    def create_record(self, material_id: int, transaction_type: str) -> BlockchainRecord:
        """
        Creates a blockchain record. If the smart contract is available and reachable,
        it executes an actual on-chain transaction signed server-side, storing the real
        transaction hash. If unavailable, it stores a local cryptographic hash while
        explicitly flagging the record as unavailable/off-chain.
        """
        if not self.db:
            raise ValueError("Database session required to create blockchain record")

        previous = (
            self.db.query(BlockchainRecord)
            .order_by(BlockchainRecord.id.desc())
            .first()
        )

        previous_hash = previous.block_hash if previous else "GENESIS"
        on_chain_status = "unavailable"
        block_hash = None
        block_number = None

        if web3_adapter.is_available():
            mat_name = f"Material #{material_id}"
            mat_cat = "General"
            mat_mfg = "MatterMind Verified"

            try:
                from sqlalchemy import text
                row = self.db.execute(
                    text("SELECT material_name, material_type, manufacturer FROM materials WHERE id = :id"),
                    {"id": material_id}
                ).fetchone()
                if row:
                    if row[0]:
                        mat_name = str(row[0])
                    if row[1]:
                        mat_cat = str(row[1])
                    if row[2]:
                        mat_mfg = str(row[2])
            except Exception:
                pass

            mat_str_id = str(material_id)

            if transaction_type.lower() in ("created", "register", "registered"):
                mfg_date = int(time.time())
                uri = f"mattermind://material/{material_id}"

                tx_res = web3_adapter.register_material(
                    material_id=mat_str_id,
                    name=mat_name,
                    category=mat_cat,
                    manufacturer=mat_mfg,
                    manufacture_date=mfg_date,
                    metadata_uri=uri,
                )
            else:
                tx_res = web3_adapter.add_lifecycle_event(
                    material_id=mat_str_id,
                    event_type=transaction_type.upper(),
                    description=f"Transaction: {transaction_type} for Material #{material_id}",
                )

            if tx_res.get("status") == "confirmed" and tx_res.get("tx_hash"):
                block_hash = tx_res["tx_hash"]
                on_chain_status = "confirmed"
                block_number = tx_res.get("block_number")
            elif tx_res.get("status") == "already_registered":
                # Already on-chain, append a lifecycle record
                l_res = web3_adapter.add_lifecycle_event(
                    material_id=mat_str_id,
                    event_type=transaction_type.upper(),
                    description=f"Transaction: {transaction_type} for Material #{material_id}",
                )
                if l_res.get("status") == "confirmed" and l_res.get("tx_hash"):
                    block_hash = l_res["tx_hash"]
                    on_chain_status = "confirmed"
                    block_number = l_res.get("block_number")
                else:
                    on_chain_status = "failed"
            else:
                on_chain_status = "failed"

        # Fallback when on-chain is unavailable or transaction failed
        if not block_hash:
            # Ensure unique block_hash by including microsecond salt if needed
            base_str = f"{material_id}{transaction_type}{previous_hash}"
            block_hash = hashlib.sha256(base_str.encode()).hexdigest()
            # If hash already exists, add unique timestamp salt
            existing = self.db.query(BlockchainRecord).filter(BlockchainRecord.block_hash == block_hash).first()
            if existing:
                block_hash = hashlib.sha256(f"{base_str}-{time.time_ns()}".encode()).hexdigest()

        record = BlockchainRecord(
            material_id=material_id,
            transaction_type=transaction_type,
            previous_hash=previous_hash,
            block_hash=block_hash,
        )

        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)

        # Attach transient metadata for API callers
        setattr(record, "on_chain_status", on_chain_status)
        setattr(record, "is_on_chain", on_chain_status == "confirmed")
        setattr(record, "block_number", block_number)
        setattr(record, "contract_address", web3_adapter.contract_address if web3_adapter.is_available() else None)

        return record

    def get_history(self, material_id: int) -> List[BlockchainRecord]:
        """
        Retrieves blockchain records for a given material. Distinguishes confirmed on-chain
        transactions from unavailable / local hash fallback records.
        """
        if not self.db:
            return []

        records = (
            self.db.query(BlockchainRecord)
            .filter(BlockchainRecord.material_id == material_id)
            .order_by(BlockchainRecord.id.asc())
            .all()
        )

        is_contract_active = web3_adapter.is_available()
        contract_addr = web3_adapter.contract_address if is_contract_active else None

        for rec in records:
            # An actual transaction hash starts with "0x" and has 66 characters
            if rec.block_hash and rec.block_hash.startswith("0x") and len(rec.block_hash) == 66:
                setattr(rec, "on_chain_status", "confirmed" if is_contract_active else "pending")
                setattr(rec, "is_on_chain", True)
            else:
                # Local hash only; clearly flag as unavailable on-chain
                setattr(rec, "on_chain_status", "unavailable")
                setattr(rec, "is_on_chain", False)

            setattr(rec, "contract_address", contract_addr)

        return records

    @staticmethod
    def remove_material(material_id: int) -> None:
        """
        Records a DELETED lifecycle event on the smart contract when a material is removed.
        """
        if web3_adapter.is_available():
            try:
                web3_adapter.add_lifecycle_event(
                    material_id=str(material_id),
                    event_type="DELETED",
                    description=f"Material #{material_id} removed from registry",
                )
            except Exception:
                pass