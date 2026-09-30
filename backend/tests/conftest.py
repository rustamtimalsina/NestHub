import os
import tempfile
from pathlib import Path

import pytest

# Must run BEFORE the app is imported: use a throwaway SQLite file
# and make sure the live database is never used.
os.environ["DATABASE_URL"] = ""
os.environ["SQLITE_PATH"] = str(Path(tempfile.mkdtemp()) / "test.db")

from fastapi.testclient import TestClient
from app.main import app as fastapi_app
from app.limiter import limiter
from app.routers import users as users_module

limiter.enabled = False  # tests register many users quickly


@pytest.fixture
def client():
    return TestClient(fastapi_app)


@pytest.fixture
def sent_tokens(monkeypatch):
    """Replace the real email sender and remember each verification token."""
    tokens = {}

    async def fake_send(email, token):
        tokens[email] = token

    monkeypatch.setattr(users_module, "send_verification_email", fake_send)
    return tokens