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


def test_dashboard_summary():
    with TestClient(app) as client:
        # Register Admin
        admin_reg = client.post(
            "/auth/register",
            json={
                "email": "admin@example.com",
                "password": "adminpassword",
                "full_name": "Admin User",
                "role": "admin",
            },
        )
        assert admin_reg.status_code == 201
        admin_token = client.post(
            "/auth/login",
            json={"email": "admin@example.com", "password": "adminpassword"},
        ).json()["access_token"]

        # Create materials
        client.post(
            "/materials/",
            json={
                "material_name": "Eco Steel",
                "material_type": "Metal",
                "manufacturer": "GreenCorp",
                "health_score": 85.0,
                "carbon_score": 12.0,
                "status": "Active",
                "is_recyclable": True,
            },
        )
        client.post(
            "/materials/",
            json={
                "material_name": "Bio Polymer",
                "material_type": "Plastic",
                "manufacturer": "EcoPlas",
                "health_score": 95.0,
                "carbon_score": 5.0,
                "status": "Expired",
                "is_recyclable": True,
            },
        )

        # Get dashboard summary
        resp = client.get(
            "/dashboard/summary",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert resp.status_code == 200
        summary = resp.json()
        assert summary["total_materials"] == 2
        assert summary["active_materials"] == 1
        assert summary["expired_materials"] == 1
        assert summary["recyclable_materials"] == 2
        assert summary["avg_health_score"] == 90.0
        assert summary["avg_carbon_score"] == 8.5
        assert summary["total_manufacturers"] == 2
        assert summary["total_users"] == 1
