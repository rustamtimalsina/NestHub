import sqlite3
import threading
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
connection = sqlite3.connect(BASE_DIR / "nesthub.db", check_same_thread=False)
connection.row_factory = sqlite3.Row
cursor = connection.cursor()


cursor.execute(
    """
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        reset_token TEXT,
        token_expiry TEXT
    )
    """
)

cursor.execute(
    """
    CREATE TABLE IF NOT EXISTS properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        city TEXT,
        price INTEGER,
        bedrooms INTEGER,
        bathrooms INTEGER,
        area INTEGER,
        property_type TEXT,
        image TEXT,
        owner_email TEXT
    )
    """
)

cursor.execute(
    """
    CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT NOT NULL,
        property_id INTEGER NOT NULL
    )
    """
)
cursor.execute("""
CREATE TABLE IF NOT EXISTS property_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id INTEGER NOT NULL,
    image TEXT NOT NULL,
    FOREIGN KEY(property_id) REFERENCES properties(id)
)
""")


def ensure_column(table: str, column: str, definition: str) -> None:
    columns = {row["name"] for row in cursor.execute(f"PRAGMA table_info({table})")}
    if column not in columns:
        cursor.execute(f"ALTER TABLE {table} ADD COLUMN {column} {definition}")


for column, definition in (
    ("phone", "TEXT"),
    ("reset_token", "TEXT"),
    ("token_expiry", "TEXT"),
):
    ensure_column("users", column, definition)

for column, definition in (
    ("description", "TEXT"),
    ("bedrooms", "INTEGER"),
    ("bathrooms", "INTEGER"),
    ("area", "INTEGER"),
    ("property_type", "TEXT"),
    ("image", "TEXT"),
    ("status", "TEXT DEFAULT 'Available'"),
):
    ensure_column("properties", column, definition)

# Keep existing databases compatible before enforcing one favorite per property/user.
cursor.execute(
    """
    DELETE FROM favorites
    WHERE id NOT IN (
        SELECT MIN(id)
        FROM favorites
        GROUP BY user_email, property_id
    )
    """
)
cursor.execute(
    """
    CREATE UNIQUE INDEX IF NOT EXISTS idx_favorites_user_property
    ON favorites(user_email, property_id)
    """
)

connection.commit()


class ThreadSafeCursor:
    """Serialize access to SQLite's single shared cursor across request threads."""

    def __init__(self, wrapped_cursor: sqlite3.Cursor) -> None:
        self._cursor = wrapped_cursor
        self._lock = threading.RLock()
        self._owner: int | None = None

    def execute(self, query: str, parameters=()):
        current_thread = threading.get_ident()
        if self._owner != current_thread:
            self._lock.acquire()
            self._owner = current_thread

        try:
            self._cursor.execute(query, parameters)
        except Exception:
            self.release()
            raise
        return self

    def fetchone(self):
        try:
            return self._cursor.fetchone()
        finally:
            self.release()

    def fetchall(self):
        try:
            return self._cursor.fetchall()
        finally:
            self.release()

    def release(self) -> None:
        if self._owner == threading.get_ident():
            self._owner = None
            self._lock.release()


class ThreadSafeConnection:
    def __init__(self, wrapped_connection: sqlite3.Connection, wrapped_cursor: ThreadSafeCursor) -> None:
        self._connection = wrapped_connection
        self._cursor = wrapped_cursor

    def commit(self) -> None:
        try:
            self._connection.commit()
        finally:
            self._cursor.release()


cursor = ThreadSafeCursor(cursor)
connection = ThreadSafeConnection(connection, cursor)
