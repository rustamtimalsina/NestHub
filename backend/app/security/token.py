import os
import secrets
import warnings
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from jose import jwt


load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    SECRET_KEY = secrets.token_urlsafe(64)
    warnings.warn(
        "SECRET_KEY is not configured; generated an ephemeral key. "
        "Set SECRET_KEY in backend/.env before deployment.",
        RuntimeWarning,
        stacklevel=2,
    )

ALGORITHM = "HS256"
# Default to 24 hours (1440 minutes) for a smooth production UX, configurable via env
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    to_encode["exp"] = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
