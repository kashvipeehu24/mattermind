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


def test_analytics_endpoints():
    with TestClient(app) as client:
        # Create materials
        client.post(
            "/materials/",
            json={
                "material_name": "Aluminum 6061",
                "material_type": "Metal",
                "manufacturer": "Alcoa",
                "health_score": 92.0,
                "carbon_score": 25.0,
                "location": "Factory A",
                "is_recyclable": True,
            },
        )
        client.post(
            "/materials/",
            json={
                "material_name": "Polyethylene",
                "material_type": "Plastic",
                "manufacturer": "Plastix",
                "health_score": 65.0,
                "carbon_score": 45.0,
                "location": "Factory B",
                "is_recyclable": False,
            },
        )

        # 1. Material Analytics
        mat_resp = client.get("/analytics/materials")
        assert mat_resp.status_code == 200
        mat_data = mat_resp.json()
        assert mat_data["total_count"] == 2
        assert mat_data["by_type"]["Metal"] == 1
        assert mat_data["by_type"]["Plastic"] == 1

        # 2. Health Analytics with filter
        health_resp = client.get("/analytics/health?manufacturer=Alcoa")
        assert health_resp.status_code == 200
        health_data = health_resp.json()
        assert health_data["avg_health_score"] == 92.0

        # 3. Carbon Analytics
        carbon_resp = client.get("/analytics/carbon")
        assert carbon_resp.status_code == 200
        carbon_data = carbon_resp.json()
        assert carbon_data["avg_carbon_score"] == 35.0
        assert carbon_data["total_carbon_impact"] == 70.0

        # 4. Sustainability Analytics
        sust_resp = client.get("/analytics/sustainability")
        assert sust_resp.status_code == 200
        sust_data = sust_resp.json()
        assert sust_data["recyclable_count"] == 1
        assert sust_data["non_recyclable_count"] == 1
        assert sust_data["recyclability_rate_percentage"] == 50.0
