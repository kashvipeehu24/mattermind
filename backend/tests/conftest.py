import os
import tempfile

import pytest

# Point the application at a throwaway database before any test module imports
# `backend.app.core.database` (and therefore creates the engine), so the test
# suite never touches the development database.
TEST_DB_PATH = os.path.join(tempfile.gettempdir(), "mattermind_test.db")
os.environ["DATABASE_URL"] = f"sqlite:///{TEST_DB_PATH}"


@pytest.fixture(scope="session", autouse=True)
def remove_test_database():
    yield
    if os.path.exists(TEST_DB_PATH):
        os.remove(TEST_DB_PATH)
