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


def test_report_generation():
    with TestClient(app) as client:
        authenticate_as_admin(client)

        # Create materials
        client.post(
            "/materials/",
            json={
                "material_name": "Titanium Ti-6Al-4V",
                "material_type": "Metal",
                "manufacturer": "Apex Metals",
                "health_score": 98.0,
                "carbon_score": 30.0,
                "is_recyclable": True,
            },
        )

        # 1. JSON Report
        json_resp = client.get("/reports/materials?format=json")
        assert json_resp.status_code == 200
        assert len(json_resp.json()) == 1
        assert json_resp.json()[0]["Material Name"] == "Titanium Ti-6Al-4V"

        # 2. CSV Report
        csv_resp = client.get("/reports/health?format=csv")
        assert csv_resp.status_code == 200
        assert "text/csv" in csv_resp.headers["content-type"]
        assert "Titanium Ti-6Al-4V" in csv_resp.text

        # 3. Excel Report
        excel_resp = client.get("/reports/carbon?format=excel")
        assert excel_resp.status_code == 200
        assert (
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            in excel_resp.headers["content-type"]
        )
        assert len(excel_resp.content) > 0

        # 4. Manufacturer Report (JSON)
        mfg_resp = client.get("/reports/manufacturers?format=json")
        assert mfg_resp.status_code == 200
        assert mfg_resp.json()[0]["Manufacturer"] == "Apex Metals"
