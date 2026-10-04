import getpass
import re

from app.database import cursor, connection, DATABASE_TYPE
from app.security.hashing import hash_password


def main():
    print(f"Creating an admin account in the {DATABASE_TYPE} database.")

    name = input("Full name: ").strip()
    email = input("Email: ").strip()
    phone = input("Phone (10 digits): ").strip()
    password = getpass.getpass("Password (at least 8 characters): ")

    if len(name) < 3:
        raise SystemExit("Name must be at least 3 characters.")

    if not re.match(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$", email):
        raise SystemExit("Invalid email format.")

    if not re.fullmatch(r"\d{10}", phone):
        raise SystemExit("Phone must be exactly 10 digits.")

    if len(password) < 8:
        raise SystemExit("Password must be at least 8 characters.")

    cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
    if cursor.fetchone():
        raise SystemExit("A user with that email already exists.")

    cursor.execute(
        """
        INSERT INTO users (name, email, phone, password, role, is_verified)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (name, email, phone, hash_password(password), "admin", 1),
    )
    connection.commit()

    print("Admin account created. You can log in now.")


if __name__ == "__main__":
    main()