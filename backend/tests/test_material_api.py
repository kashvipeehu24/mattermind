import pytest
from fastapi.testclient import TestClient

from backend.app.core.database import Base, engine
from backend.main import app


@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def test_material_crud_flow():
    with TestClient(app) as client:
        create_payload = {
            "material_name": "Steel Alloy",
            "material_type": "Metal",
            "manufacturer": "Acme Industries",
            "density": 7.85,
            "health_score": 90.0,
            "carbon_score": 15.0,
        }

        create_response = client.post("/materials/", json=create_payload)
        assert create_response.status_code == 201
        created = create_response.json()
        assert created["material_name"] == "Steel Alloy"
        material_id = created["id"]

        list_response = client.get("/materials/")
        assert list_response.status_code == 200
        assert len(list_response.json()) == 1

        detail_response = client.get(f"/materials/{material_id}")
        assert detail_response.status_code == 200
        assert detail_response.json()["material_name"] == "Steel Alloy"

        update_payload = {"status": "Damaged", "health_score": 72.0}
        update_response = client.put(f"/materials/{material_id}", json=update_payload)
        assert update_response.status_code == 200
        assert update_response.json()["status"] == "Damaged"
        assert update_response.json()["health_score"] == 72.0

        delete_response = client.delete(f"/materials/{material_id}")
        assert delete_response.status_code == 204

        after_delete = client.get("/materials/")
        assert after_delete.status_code == 200
        assert after_delete.json() == []
