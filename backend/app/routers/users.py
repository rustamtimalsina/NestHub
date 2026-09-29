import os
import re
import secrets
import hashlib
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from app.database import cursor, connection
from app.schemas import User, ResetPasswordRequest
from app.security.hashing import hash_password, verify_password
from app.security.token import create_access_token
from app.email_utils import send_reset_email, send_verification_email
router = APIRouter(
    prefix="/users",
    tags=["Users"]
)
from app.security.oauth2 import verify_token
from app.security.admin import verify_admin


@router.post("/")
async def create_user(user: User):
    # Validate name
    if len(user.name.strip()) < 3:
      raise HTTPException(
        status_code=400,
        detail="Name must be at least 3 characters."
    )
    email_pattern = r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"

    if not re.match(email_pattern, user.email):
        raise HTTPException(
            status_code=400,
            detail="Invalid email format."
        )
    if not re.fullmatch(r"\d{10}", user.phone):
        raise HTTPException(
            status_code=400,
            detail="Phone number must contain exactly 10 digits."
        )
    if len(user.password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters.",
        )
    # Check if email already exists
    cursor.execute(
        """
        SELECT * FROM users
        WHERE email = ?
        """,
        (user.email,)
    )

    existing_email = cursor.fetchone()

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already exists."
        )

    # Check if phone already exists
    cursor.execute(
        """
        SELECT * FROM users
        WHERE phone = ?
        """,
        (user.phone,)
    )

    existing_phone = cursor.fetchone()

    if existing_phone:
        raise HTTPException(
            status_code=400,
            detail="Phone number already exists."
        )

    hashed_password = hash_password(user.password)

    token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
    expiry = datetime.utcnow() + timedelta(hours=24)

    try:
        cursor.execute(
            """
            INSERT INTO users
            (name, email, phone, password, role,
             is_verified, verify_token, verify_expiry)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user.name,
                user.email,
                user.phone,
                hashed_password,
                "user",
                0,
                token_hash,
                expiry.isoformat(),
            )
        )

        connection.commit()

    except Exception as error:
        connection.rollback()
        print(f"Registration failed: {type(error).__name__}")

        raise HTTPException(
            status_code=500,
            detail="Database error while creating user."
        )

    try:
        await send_verification_email(user.email, token)
    except Exception as error:
        print(f"Verification email failed: {type(error).__name__}: {str(error)[:200]}")
        return {
            "message": "Account created, but the verification email could not be sent. Please request a new one."
        }

    return {
        "message": "Account created! Please check your email to verify your account."
    }


@router.get("/verify")
def verify_email(token: str):
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()

    cursor.execute(
        "SELECT id, verify_expiry FROM users WHERE verify_token = ?",
        (token_hash,)
    )
    user = cursor.fetchone()

    if user is None or user["verify_expiry"] is None:
        return RedirectResponse(f"{frontend_url}/login?verified=invalid")

    if datetime.utcnow() > datetime.fromisoformat(user["verify_expiry"]):
        return RedirectResponse(f"{frontend_url}/login?verified=expired")

    cursor.execute(
        """
        UPDATE users
        SET is_verified = 1, verify_token = NULL, verify_expiry = NULL
        WHERE id = ?
        """,
        (user["id"],)
    )
    connection.commit()

    return RedirectResponse(f"{frontend_url}/login?verified=1")


@router.post("/resend-verification")
async def resend_verification(email: str):
    reply = {"message": "If that account exists and is not verified, a new link has been sent."}

    cursor.execute(
        "SELECT id, is_verified FROM users WHERE email = ?",
        (email,)
    )
    user = cursor.fetchone()

    if user is None or user["is_verified"]:
        return reply

    token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
    expiry = datetime.utcnow() + timedelta(hours=24)

    cursor.execute(
        "UPDATE users SET verify_token = ?, verify_expiry = ? WHERE id = ?",
        (token_hash, expiry.isoformat(), user["id"])
    )
    connection.commit()

    try:
        await send_verification_email(email, token)
    except Exception as error:
        print(f"Verification email failed: {type(error).__name__}")
        raise HTTPException(
            status_code=502,
            detail="Unable to send the verification email. Please try again later."
        )

    return reply

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends()
):
    cursor.execute(
        """
        SELECT * FROM users
        WHERE email = ?
        """,
       (form_data.username,)
    )

    db_user = cursor.fetchone()

    if db_user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    print("========== LOGIN CALLED ==========")
    print("USER ROLE:", db_user["role"])
    if not verify_password(
        form_data.password,
        db_user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not db_user["is_verified"]:
        raise HTTPException(
            status_code=403,
            detail="Please verify your email before logging in."
        )

    token = create_access_token(
        {
            "sub": db_user["email"]
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.post("/forgot-password")
async def forgot_password(email: str):
    cursor.execute(
        """
        SELECT * FROM users
        WHERE email = ?
        """,
        (email,)
    )

    user = cursor.fetchone()
    if user is None:
        return {"message": "If that email exists, a reset link has been sent."}

    # Generate secure token
    token = secrets.token_urlsafe(32)

    # Token expires in 30 minutes
    expiry = datetime.utcnow() + timedelta(minutes=30)

    token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()

    cursor.execute(
        """
        UPDATE users
        SET reset_token = ?, token_expiry = ?
        WHERE email = ?
        """,
        (
            token_hash,
            expiry.isoformat(),
            email
        )
    )

    connection.commit()

    try:
        await send_reset_email(email, token)
    except Exception as error:
        # Show the reason in the server terminal, never in the response
        print(f"Reset email failed: {type(error).__name__}: {str(error)[:200]}")

        raise HTTPException(
            status_code=502,
            detail="Unable to send the password reset email. Please try again later.",
        ) from error

    return {
        "message": "If that email exists, a reset link has been sent."
    }
@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest):
    token_hash = hashlib.sha256(data.token.encode("utf-8")).hexdigest()

    cursor.execute(
        """
        SELECT * FROM users
        WHERE reset_token = ?
        """,
        (token_hash,)
    )

    user = cursor.fetchone()

    if user is None:
        raise HTTPException(
            status_code=400,
            detail="Invalid reset token."
        )

    expiry = datetime.fromisoformat(user["token_expiry"])

    if datetime.utcnow() > expiry:
        raise HTTPException(
            status_code=400,
            detail="Reset token has expired."
        )

    hashed_password = hash_password(data.password)

    cursor.execute(
        """
        UPDATE users
        SET password = ?,
            reset_token = NULL,
            token_expiry = NULL
        WHERE id = ?
        """,
        (
            hashed_password,
            user["id"]
        )
    )

    connection.commit()

    return {
        "message": "Password reset successful."
    }

@router.get("/admin-test")
def admin_test(current_user: str = Depends(verify_admin)):
    return {
        "message": "Admin access granted!",
        "user": current_user
    }
@router.get("/me")
def get_me(
    current_user: str = Depends(verify_token)
):
    cursor.execute(
        """
        SELECT id, name, email, phone, role
        FROM users
        WHERE email = ?
        """,
        (current_user,)
    )

    user = cursor.fetchone()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    return dict(user)
