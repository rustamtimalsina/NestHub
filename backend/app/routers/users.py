from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.database import cursor, connection
from app.schemas import User
from app.security.hashing import hash_password, verify_password
from app.security.token import create_access_token
router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.post("/")
def create_user(user: User):

    print("Password received:", user.password)
    print("Password length:", len(user.password.encode("utf-8")))

    hashed_password = hash_password(
        user.password
    )



    cursor.execute(
        """
        INSERT INTO users
        (name, email, password, role)

        VALUES (?, ?, ?, ?)
        """,
        (
            user.name,
            user.email,
            hashed_password,
            user.role
        )
    )

    connection.commit()

    return {
        "message": "User created successfully!"
    }

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

    if not verify_password(
        form_data.password,
        db_user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
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
