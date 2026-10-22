import pytest
from fastapi.testclient import TestClient

from backend.app.core.database import Base, SessionLocal, engine
from backend.app.models.material import Material
from backend.app.services.blockchain_service import BlockchainService
from backend.app.services.web3_adapter import web3_adapter
from backend.main import app


@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def authenticate_as_admin(client):
    client.post(
        "/auth/register",
        json={
            "email": "admin@example.com",
            "password": "adminpassword",
            "full_name": "Admin User",
            "role": "admin",
        },
    )
    token = client.post(
        "/auth/login",
        json={"email": "admin@example.com", "password": "adminpassword"},
    ).json()["access_token"]
    client.headers.update({"Authorization": f"Bearer {token}"})


def test_blockchain_service_integration():
    db = SessionLocal()
    try:
        # Create a test material record
        mat = Material(
            material_name="Aerospace Titanium Ti-6Al-4V",
            material_type="Titanium Alloy",
            manufacturer="Precision Foundries Inc",
            density=4.43,
            health_score=95.0,
            carbon_score=12.5,
            status="Active",
        )
        db.add(mat)
        db.commit()
        db.refresh(mat)

        service = BlockchainService(db)

        # Test registration record
        rec = service.create_record(material_id=mat.id, transaction_type="created")
        assert rec.id is not None
        assert rec.material_id == mat.id
        assert rec.block_hash is not None

        # If web3 is available, verify it produced a confirmed on-chain transaction
        if web3_adapter.is_available():
            assert getattr(rec, "on_chain_status") == "confirmed"
            assert getattr(rec, "is_on_chain") is True
            assert rec.block_hash.startswith("0x")
            assert len(rec.block_hash) == 66

            # Verify on-chain verification method
            assert web3_adapter.verify_material(str(mat.id)) is True

        # Test lifecycle event update
        update_rec = service.create_record(material_id=mat.id, transaction_type="updated")
        assert update_rec.id is not None
        assert update_rec.previous_hash == rec.block_hash

        # Test history retrieval
        history = service.get_history(mat.id)
        assert len(history) == 2
        assert history[0].id == rec.id
        assert history[1].id == update_rec.id

        # Test static remove_material
        BlockchainService.remove_material(mat.id)
    finally:
        db.close()


def test_blockchain_api_endpoints():
    with TestClient(app) as client:
        authenticate_as_admin(client)

        # Create material first
        create_res = client.post(
            "/materials/",
            json={
                "material_name": "Inconel 625",
                "material_type": "Nickel Superalloy",
                "manufacturer": "Special Metals Corp",
                "density": 8.44,
                "health_score": 92.0,
                "carbon_score": 18.0,
            },
        )
        assert create_res.status_code == 201
        material_id = create_res.json()["id"]

        # POST /blockchain/record/{material_id}
        rec_res = client.post(f"/blockchain/record/{material_id}?transaction_type=inspection")
        assert rec_res.status_code == 200
        rec_data = rec_res.json()
        assert rec_data["material_id"] == material_id
        assert rec_data["transaction_type"] == "inspection"
        assert "block_hash" in rec_data

        # GET /blockchain/history/{material_id}
        hist_res = client.get(f"/blockchain/history/{material_id}")
        assert hist_res.status_code == 200
        hist_data = hist_res.json()
        assert isinstance(hist_data, list)
        assert len(hist_data) >= 1
