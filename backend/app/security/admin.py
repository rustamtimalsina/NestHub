from fastapi import Depends, HTTPException

from app.security.oauth2 import verify_token
from app.database import cursor


def verify_admin(current_user: str = Depends(verify_token)):
    cursor.execute(
        """
        SELECT role
        FROM users
        WHERE email = ?
        """,
        (current_user,)
    )

    user = cursor.fetchone()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user["role"] != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return current_user