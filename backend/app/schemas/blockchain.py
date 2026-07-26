from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any
from datetime import datetime


class BlockchainRegisterRequest(BaseModel):
    material_id: int
    metadata: Optional[Dict[str, Any]] = None


class BlockchainRegisterResponse(BaseModel):
    tx_hash: str
    material_id: int
    blockchain_id: str
    timestamp: datetime
    status: str

    model_config = ConfigDict(from_attributes=True)


class BlockchainPassportResponse(BaseModel):
    material_id: int
    passport_hash: str
    blockchain_tx_hash: str
    block_number: int
    verified: bool
    owner_address: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BlockchainVerifyResponse(BaseModel):
    material_id: int
    is_authentic: bool
    verification_hash: str
    message: str

    model_config = ConfigDict(from_attributes=True)
