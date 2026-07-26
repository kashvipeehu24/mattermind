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


def test_auth_full_flow():
    with TestClient(app) as client:
        # 1. Register User
        reg_payload = {
            "email": "testuser@example.com",
            "password": "secretpassword",
            "full_name": "Test User",
            "role": "user",
        }
        reg_resp = client.post("/auth/register", json=reg_payload)
        assert reg_resp.status_code == 201
        user_data = reg_resp.json()
        assert user_data["email"] == "testuser@example.com"
        assert user_data["role"] == "user"

        # 2. Duplicate registration fails
        dup_resp = client.post("/auth/register", json=reg_payload)
        assert dup_resp.status_code == 400

        # 3. Login with wrong password
        bad_login = client.post(
            "/auth/login",
            json={"email": "testuser@example.com", "password": "wrongpassword"},
        )
        assert bad_login.status_code == 401

        # 4. Login successful
        login_resp = client.post(
            "/auth/login",
            json={"email": "testuser@example.com", "password": "secretpassword"},
        )
        assert login_resp.status_code == 200
        tokens = login_resp.json()
        assert "access_token" in tokens
        assert "refresh_token" in tokens
        access_token = tokens["access_token"]
        refresh_token = tokens["refresh_token"]

        # 5. Access /auth/me with valid Bearer token
        me_resp = client.get(
            "/auth/me", headers={"Authorization": f"Bearer {access_token}"}
        )
        assert me_resp.status_code == 200
        assert me_resp.json()["email"] == "testuser@example.com"

        # 6. Access /auth/me without token fails
        no_auth = client.get("/auth/me")
        assert no_auth.status_code == 401

        # 7. Refresh token
        ref_resp = client.post("/auth/refresh", json={"refresh_token": refresh_token})
        assert ref_resp.status_code == 200
        new_tokens = ref_resp.json()
        assert "access_token" in new_tokens

        # 8. Logout
        logout_resp = client.post("/auth/logout", json={"refresh_token": refresh_token})
        assert logout_resp.status_code == 200

        # 9. Using old refresh token after logout fails
        fail_ref = client.post("/auth/refresh", json={"refresh_token": refresh_token})
        assert fail_ref.status_code == 401
