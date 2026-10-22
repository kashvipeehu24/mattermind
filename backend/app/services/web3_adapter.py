import json
import logging
import os
import time
from typing import Any, Dict, List, Optional

logger = logging.getLogger("mattermind.blockchain")

try:
    from web3 import Web3
    WEB3_AVAILABLE = True
except ImportError:
    WEB3_AVAILABLE = False
    Web3 = None

from backend.app.core.config import settings


class Web3BlockchainAdapter:
    """
    Adapter for smart contract interactions with MaterialPassport.sol on Ethereum/Hardhat network.
    Maintains server-side signing and distinguishes confirmed, pending, failed, and unavailable states.
    """

    def __init__(self):
        self._w3: Optional[Any] = None
        self._contract: Optional[Any] = None
        self._contract_address: Optional[str] = None
        self._abi: Optional[List[Dict[str, Any]]] = None
        self._account: Optional[Any] = None
        self._initialize()

    def _resolve_project_path(self, relative_path: str) -> str:
        base_dir = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "../../../")
        )
        return os.path.normpath(os.path.join(base_dir, relative_path))

    def _load_abi(self) -> Optional[List[Dict[str, Any]]]:
        possible_paths = [
            self._resolve_project_path("blockchain/artifacts/contracts/MaterialPassport.sol/MaterialPassport.json"),
            os.path.abspath("blockchain/artifacts/contracts/MaterialPassport.sol/MaterialPassport.json"),
        ]
        for p in possible_paths:
            if os.path.exists(p):
                try:
                    with open(p, "r", encoding="utf-8") as f:
                        data = json.load(f)
                        return data.get("abi")
                except Exception as e:
                    logger.warning(f"Failed to read contract artifact at {p}: {e}")
        return None

    def _load_contract_address(self) -> Optional[str]:
        if settings.BLOCKCHAIN_CONTRACT_ADDRESS:
            return settings.BLOCKCHAIN_CONTRACT_ADDRESS

        deployment_path = self._resolve_project_path("blockchain/deployed_contract.json")
        if os.path.exists(deployment_path):
            try:
                with open(deployment_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    return data.get("address")
            except Exception as e:
                logger.warning(f"Failed to read deployed_contract.json: {e}")
        return None

    def _initialize(self):
        if not WEB3_AVAILABLE:
            logger.warning("web3 package is not installed; blockchain adapter offline.")
            return

        try:
            self._w3 = Web3(Web3.HTTPProvider(settings.BLOCKCHAIN_RPC_URL, request_kwargs={"timeout": 5}))
            self._abi = self._load_abi()
            self._contract_address = self._load_contract_address()

            if self._w3 and settings.BLOCKCHAIN_PRIVATE_KEY:
                try:
                    self._account = self._w3.eth.account.from_key(settings.BLOCKCHAIN_PRIVATE_KEY)
                except Exception as e:
                    logger.warning(f"Could not load server signer account: {e}")

            if self._w3 and self._contract_address and self._abi:
                checksummed = self._w3.to_checksum_address(self._contract_address)
                self._contract = self._w3.eth.contract(address=checksummed, abi=self._abi)
                logger.info(f"Initialized Web3 adapter with contract at {checksummed}")
        except Exception as e:
            logger.warning(f"Failed to initialize Web3 adapter: {e}")

    @property
    def contract_address(self) -> Optional[str]:
        return self._contract_address

    def is_available(self) -> bool:
        """Checks whether the RPC node is reachable and the contract is deployed."""
        if not WEB3_AVAILABLE or self._w3 is None:
            return False

        try:
            if not self._w3.is_connected():
                return False

            if not self._contract or not self._contract_address:
                # Retry loading if deployed recently
                self._contract_address = self._load_contract_address()
                if self._contract_address and self._abi:
                    checksummed = self._w3.to_checksum_address(self._contract_address)
                    self._contract = self._w3.eth.contract(address=checksummed, abi=self._abi)
                else:
                    return False

            code = self._w3.eth.get_code(self._contract.address)
            return len(code) > 0 and code != b"\x00"
        except Exception as e:
            logger.debug(f"Web3 availability check failed: {e}")
            return False

    def register_material(
        self,
        material_id: str,
        name: str,
        category: str,
        manufacturer: str,
        manufacture_date: int,
        metadata_uri: str,
        owner: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Registers a new material passport on-chain using server-side signer."""
        if not self.is_available():
            return {"status": "unavailable", "tx_hash": None, "error": "Blockchain node or contract unavailable"}

        try:
            # Check if material is already registered on-chain
            if self.verify_material(material_id):
                return {
                    "status": "already_registered",
                    "tx_hash": None,
                    "message": f"Material {material_id} already registered on-chain",
                }

            signer_address = self._account.address if self._account else None
            if not signer_address:
                return {"status": "failed", "tx_hash": None, "error": "Server signer not configured"}

            recipient = owner or signer_address
            recipient_checksum = self._w3.to_checksum_address(recipient)

            clean_id = str(material_id).strip()
            clean_name = (name or f"Material {clean_id}").strip()
            clean_cat = (category or "General").strip()
            clean_mfg = (manufacturer or "MatterMind Verified").strip()
            mfg_ts = int(manufacture_date) if manufacture_date and manufacture_date > 0 else int(time.time())
            clean_uri = (metadata_uri or f"mattermind://material/{clean_id}").strip()

            tx = self._contract.functions.registerMaterial(
                clean_id,
                clean_name,
                clean_cat,
                clean_mfg,
                mfg_ts,
                clean_uri,
                recipient_checksum,
            ).build_transaction({
                "from": signer_address,
                "nonce": self._w3.eth.get_transaction_count(signer_address),
                "gas": 600000,
                "gasPrice": self._w3.eth.gas_price,
            })

            signed = self._w3.eth.account.sign_transaction(tx, settings.BLOCKCHAIN_PRIVATE_KEY)
            tx_hash_bytes = self._w3.eth.send_raw_transaction(signed.raw_transaction)
            receipt = self._w3.eth.wait_for_transaction_receipt(tx_hash_bytes, timeout=10)

            tx_hash_hex = f"0x{receipt.transactionHash.hex()}" if not receipt.transactionHash.hex().startswith("0x") else receipt.transactionHash.hex()
            is_success = receipt.status == 1

            return {
                "status": "confirmed" if is_success else "failed",
                "tx_hash": tx_hash_hex,
                "block_number": receipt.blockNumber,
                "gas_used": receipt.gasUsed,
            }
        except Exception as e:
            logger.error(f"Error registering material {material_id} on-chain: {e}")
            return {"status": "failed", "tx_hash": None, "error": str(e)}

    def add_lifecycle_event(
        self,
        material_id: str,
        event_type: str,
        description: str,
    ) -> Dict[str, Any]:
        """Appends a lifecycle event to an existing material passport on-chain."""
        if not self.is_available():
            return {"status": "unavailable", "tx_hash": None, "error": "Blockchain node or contract unavailable"}

        try:
            clean_id = str(material_id).strip()

            # Ensure material exists on-chain; if not registered yet, auto-register
            if not self.verify_material(clean_id):
                reg_res = self.register_material(
                    material_id=clean_id,
                    name=f"Material {clean_id}",
                    category="General",
                    manufacturer="MatterMind Verified",
                    manufacture_date=int(time.time()),
                    metadata_uri=f"mattermind://material/{clean_id}",
                )
                if reg_res.get("status") == "failed":
                    return reg_res

            signer_address = self._account.address if self._account else None
            if not signer_address:
                return {"status": "failed", "tx_hash": None, "error": "Server signer not configured"}

            clean_type = (event_type or "LIFECYCLE_UPDATE").strip().upper()
            clean_desc = (description or f"Lifecycle event recorded: {clean_type}").strip()

            tx = self._contract.functions.addLifecycleEvent(
                clean_id,
                clean_type,
                clean_desc,
            ).build_transaction({
                "from": signer_address,
                "nonce": self._w3.eth.get_transaction_count(signer_address),
                "gas": 400000,
                "gasPrice": self._w3.eth.gas_price,
            })

            signed = self._w3.eth.account.sign_transaction(tx, settings.BLOCKCHAIN_PRIVATE_KEY)
            tx_hash_bytes = self._w3.eth.send_raw_transaction(signed.raw_transaction)
            receipt = self._w3.eth.wait_for_transaction_receipt(tx_hash_bytes, timeout=10)

            tx_hash_hex = f"0x{receipt.transactionHash.hex()}" if not receipt.transactionHash.hex().startswith("0x") else receipt.transactionHash.hex()
            is_success = receipt.status == 1

            return {
                "status": "confirmed" if is_success else "failed",
                "tx_hash": tx_hash_hex,
                "block_number": receipt.blockNumber,
                "gas_used": receipt.gasUsed,
            }
        except Exception as e:
            logger.error(f"Error adding lifecycle event for material {material_id}: {e}")
            return {"status": "failed", "tx_hash": None, "error": str(e)}

    def verify_material(self, material_id: str) -> bool:
        """Calls verifyMaterial on the contract (read-only call)."""
        if not self.is_available():
            return False

        try:
            return bool(self._contract.functions.verifyMaterial(str(material_id).strip()).call())
        except Exception as e:
            logger.debug(f"Error calling verifyMaterial({material_id}): {e}")
            return False

    def get_material(self, material_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves material record directly from smart contract."""
        if not self.is_available():
            return None

        try:
            data = self._contract.functions.getMaterial(str(material_id).strip()).call()
            return {
                "material_id": data[0],
                "material_name": data[1],
                "category": data[2],
                "manufacturer": data[3],
                "current_owner": data[4],
                "manufacture_date": data[5],
                "metadata_uri": data[6],
                "status": data[7],
                "exists": data[8],
            }
        except Exception as e:
            logger.debug(f"Error getting material {material_id} from contract: {e}")
            return None

    def get_material_history(self, material_id: str) -> List[Dict[str, Any]]:
        """Retrieves on-chain history events for the material."""
        if not self.is_available():
            return []

        try:
            events = self._contract.functions.getMaterialHistory(str(material_id).strip()).call()
            result = []
            for ev in events:
                result.append({
                    "timestamp": ev[0],
                    "event_type": ev[1],
                    "description": ev[2],
                    "performed_by": ev[3],
                })
            return result
        except Exception as e:
            logger.debug(f"Error getting on-chain history for material {material_id}: {e}")
            return []


# Global singleton adapter instance
web3_adapter = Web3BlockchainAdapter()
