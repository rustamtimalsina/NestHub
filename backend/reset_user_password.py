import getpass
import re
from app.database import cursor, connection, DATABASE_TYPE
from app.security.hashing import hash_password


def main():
    print(f"--- NestHub Password Reset Tool ({DATABASE_TYPE}) ---")
    email = input("Enter account email: ").strip()

    if not re.match(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$", email):
        raise SystemExit("Invalid email format.")

    cursor.execute("SELECT id, name, role FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()

    if not user:
        raise SystemExit(f"No user found with email: {email}")

    print(f"Found user: {user['name']} (Role: {user['role']})")
    password = getpass.getpass("Enter new password (at least 8 chars): ")

    if len(password) < 8:
        raise SystemExit("Password must be at least 8 characters.")

    cursor.execute(
        "UPDATE users SET password = ?, is_verified = 1 WHERE email = ?",
        (hash_password(password), email),
    )
    connection.commit()
    print(f"Success! Password has been updated for {email}. You can now log in.")


if __name__ == "__main__":
    main()
