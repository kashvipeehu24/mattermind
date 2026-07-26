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


def test_user_management_flow():
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

        # Register Regular User
        user_reg = client.post(
            "/auth/register",
            json={
                "email": "user@example.com",
                "password": "userpassword",
                "full_name": "Regular User",
                "role": "user",
            },
        )
        assert user_reg.status_code == 201

        # Login Admin & User
        admin_token = client.post(
            "/auth/login",
            json={"email": "admin@example.com", "password": "adminpassword"},
        ).json()["access_token"]

        user_token = client.post(
            "/auth/login",
            json={"email": "user@example.com", "password": "userpassword"},
        ).json()["access_token"]

        # Regular user attempt to access GET /users fails with 403
        resp_403 = client.get(
            "/users/", headers={"Authorization": f"Bearer {user_token}"}
        )
        assert resp_403.status_code == 403

        # Admin accesses GET /users
        users_list = client.get(
            "/users/", headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert users_list.status_code == 200
        data = users_list.json()
        assert len(data) == 2

        # Admin search for user
        search_res = client.get(
            "/users/?search=Regular",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert search_res.status_code == 200
        assert len(search_res.json()) == 1
        regular_user_id = search_res.json()[0]["id"]

        # Admin update user
        update_res = client.put(
            f"/users/{regular_user_id}",
            json={"full_name": "Updated Regular User", "role": "user"},
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert update_res.status_code == 200
        assert update_res.json()["full_name"] == "Updated Regular User"

        # Admin delete user
        del_res = client.delete(
            f"/users/{regular_user_id}",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert del_res.status_code == 204

        # Verify deletion
        after_del = client.get(
            "/users/", headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert len(after_del.json()) == 1
