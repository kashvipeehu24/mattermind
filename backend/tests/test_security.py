import pytest
from fastapi import HTTPException, Request
from fastapi.testclient import TestClient

from backend.app.core.database import Base, engine
from backend.app.core.rate_limit import RateLimiter
from backend.app.services.report_service import ReportService
from backend.main import app


@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def register_and_login(client, email, password, role="user"):
    client.post(
        "/auth/register",
        json={"email": email, "password": password, "full_name": email, "role": role},
    )
    token = client.post(
        "/auth/login", json={"email": email, "password": password}
    ).json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def build_request(path="/auth/login", client_host="203.0.113.10"):
    return Request(
        {
            "type": "http",
            "http_version": "1.1",
            "method": "POST",
            "scheme": "http",
            "server": ("testserver", 80),
            "path": path,
            "query_string": b"",
            "headers": [],
            "client": (client_host, 12345),
        }
    )


def test_protected_endpoints_reject_unauthenticated_requests():
    with TestClient(app) as client:
        for path in [
            "/materials/",
            "/materials/search",
            "/manufacturers/",
            "/analytics/materials",
            "/analytics/sustainability",
            "/reports/materials",
            "/dashboard/summary",
            "/users/",
        ]:
            assert client.get(path).status_code == 401, path

        assert client.post("/materials/", json={}).status_code == 401
        assert client.delete("/materials/1").status_code == 401


def test_role_boundaries_for_authenticated_users():
    with TestClient(app) as client:
        admin_headers = register_and_login(
            client, "admin@example.com", "adminpassword", role="admin"
        )
        user_headers = register_and_login(client, "user@example.com", "userpassword")

        created = client.post(
            "/materials/",
            json={"material_name": "Copper Wire", "material_type": "Metal"},
            headers=user_headers,
        )
        assert created.status_code == 201
        material_id = created.json()["id"]

        # Reads are allowed for any authenticated user.
        assert client.get("/materials/", headers=user_headers).status_code == 200
        assert client.get("/manufacturers/", headers=user_headers).status_code == 200
        assert (
            client.get("/analytics/materials", headers=user_headers).status_code == 200
        )

        # Admin-only operations are rejected for regular users.
        assert (
            client.get("/reports/materials", headers=user_headers).status_code == 403
        )
        assert (
            client.post(
                "/manufacturers/", json={"name": "Acme"}, headers=user_headers
            ).status_code
            == 403
        )
        assert (
            client.delete(
                f"/materials/{material_id}", headers=user_headers
            ).status_code
            == 403
        )

        # ...and allowed for admins.
        assert client.get("/reports/materials", headers=admin_headers).status_code == 200
        assert (
            client.post(
                "/manufacturers/", json={"name": "Acme"}, headers=admin_headers
            ).status_code
            == 201
        )
        assert (
            client.delete(
                f"/materials/{material_id}", headers=admin_headers
            ).status_code
            == 204
        )


def test_material_history_records_acting_user():
    with TestClient(app) as client:
        admin_headers = register_and_login(
            client, "admin@example.com", "adminpassword", role="admin"
        )
        user_headers = register_and_login(client, "user@example.com", "userpassword")
        user_id = client.get("/auth/me", headers=user_headers).json()["id"]

        material_id = client.post(
            "/materials/",
            json={"material_name": "Basalt Fiber", "material_type": "Composite"},
            headers=user_headers,
        ).json()["id"]
        client.put(
            f"/materials/{material_id}",
            json={"status": "Damaged"},
            headers=user_headers,
        )

        history = client.get(
            f"/materials/{material_id}/history", headers=admin_headers
        ).json()
        assert {entry["change_type"] for entry in history} == {"CREATED", "UPDATED"}
        assert all(entry["changed_by_user_id"] == user_id for entry in history)


def test_registration_cannot_self_assign_admin_role():
    with TestClient(app) as client:
        # The first account bootstraps the initial admin.
        first = client.post(
            "/auth/register",
            json={
                "email": "first@example.com",
                "password": "firstpassword",
                "role": "admin",
            },
        )
        assert first.json()["role"] == "admin"

        escalated = client.post(
            "/auth/register",
            json={
                "email": "attacker@example.com",
                "password": "attackerpassword",
                "role": "admin",
            },
        )
        assert escalated.json()["role"] == "user"


def test_validation_errors_return_structured_payload():
    with TestClient(app) as client:
        headers = register_and_login(client, "user@example.com", "userpassword")
        resp = client.post("/materials/", json={"material_type": "Metal"}, headers=headers)
        assert resp.status_code == 422
        body = resp.json()
        assert body["detail"] == "Validation error"
        assert body["errors"]


def test_unexpected_errors_return_generic_500(monkeypatch):
    def boom(*args, **kwargs):
        raise RuntimeError("database exploded")

    monkeypatch.setattr(ReportService, "generate_material_report", boom)

    with TestClient(app, raise_server_exceptions=False) as client:
        headers = register_and_login(
            client, "admin@example.com", "adminpassword", role="admin"
        )
        resp = client.get("/reports/materials", headers=headers)
        assert resp.status_code == 500
        assert resp.json() == {"detail": "Internal server error"}


def test_rate_limiter_blocks_bursts_per_client():
    limiter = RateLimiter(max_requests=2, window_seconds=60)
    request = build_request()

    limiter(request)
    limiter(request)
    with pytest.raises(HTTPException) as exc_info:
        limiter(request)
    assert exc_info.value.status_code == 429
    assert exc_info.value.headers["Retry-After"]

    # A different client keeps its own budget.
    limiter(build_request(client_host="198.51.100.7"))
