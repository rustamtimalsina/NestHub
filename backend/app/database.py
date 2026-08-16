import os
import sqlite3
import threading
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

DATABASE_URL = os.getenv("DATABASE_URL")

# ============================================================
# POSTGRESQL
# ============================================================

if DATABASE_URL:
    import psycopg2
    from psycopg2.extras import DictCursor

    connection = psycopg2.connect(DATABASE_URL)
    cursor = connection.cursor(cursor_factory=DictCursor)

    DATABASE_TYPE = "postgres"

# ============================================================
# SQLITE
# ============================================================

else:
    sqlite_connection = sqlite3.connect(
        BASE_DIR / "nesthub.db",
        check_same_thread=False
    )

    sqlite_connection.row_factory = sqlite3.Row

    connection = sqlite_connection
    cursor = connection.cursor()

    DATABASE_TYPE = "sqlite"


# ============================================================
# THREAD-SAFE CURSOR
# ============================================================

class ThreadSafeCursor:
    """
    Keeps the existing application code compatible with both
    SQLite and PostgreSQL.
    """

    def __init__(self, wrapped_cursor):
        self._cursor = wrapped_cursor
        self._lock = threading.RLock()
        self._owner = None

    def _convert_query(self, query):
        if DATABASE_TYPE == "postgres":

            # Convert SQLite placeholders (?) to PostgreSQL (%s)
            query = query.replace("?", "%s")

            # Convert SQLite last_insert_rowid()
            query = query.replace(
                "SELECT last_insert_rowid()",
                "SELECT lastval()"
            )

        return query

    def execute(self, query, parameters=()):
        current_thread = threading.get_ident()

        if self._owner != current_thread:
            self._lock.acquire()
            self._owner = current_thread

        try:
            query = self._convert_query(query)
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

    def release(self):
        if self._owner == threading.get_ident():
            self._owner = None
            self._lock.release()


# Replace the raw cursor with our compatible cursor
cursor = ThreadSafeCursor(cursor)


# ============================================================
# THREAD-SAFE CONNECTION
# ============================================================

class ThreadSafeConnection:

    def __init__(self, wrapped_connection, wrapped_cursor):
        self._connection = wrapped_connection
        self._cursor = wrapped_cursor

    def commit(self):
        try:
            self._connection.commit()
        finally:
            self._cursor.release()

    def rollback(self):
        try:
            self._connection.rollback()
        finally:
            self._cursor.release()


connection = ThreadSafeConnection(connection, cursor)


# ============================================================
# DATABASE HELPERS
# ============================================================

def column_exists(table: str, column: str) -> bool:

    if DATABASE_TYPE == "sqlite":

        rows = cursor.execute(
            f"PRAGMA table_info({table})"
        ).fetchall()

        return any(row["name"] == column for row in rows)

    else:

        row = cursor.execute(
            """
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = %s
            AND column_name = %s
            """,
            (table, column)
        ).fetchone()

        return row is not None


def ensure_column(
    table: str,
    column: str,
    definition: str
):

    if not column_exists(table, column):

        cursor.execute(
            f"ALTER TABLE {table} ADD COLUMN {column} {definition}"
        )


# ============================================================
# USERS TABLE
# ============================================================

cursor.execute(
    """
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
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


# ============================================================
# PROPERTIES TABLE
# ============================================================

cursor.execute(
    """
    CREATE TABLE IF NOT EXISTS properties (
        id INTEGER PRIMARY KEY,
        title TEXT,
        description TEXT,
        city TEXT,
        price INTEGER,
        bedrooms INTEGER,
        bathrooms INTEGER,
        area INTEGER,
        property_type TEXT,
        image TEXT,
        owner_email TEXT,
        status TEXT DEFAULT 'Available'
    )
    """
)


# ============================================================
# FAVORITES TABLE
# ============================================================

cursor.execute(
    """
    CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY,
        user_email TEXT NOT NULL,
        property_id INTEGER NOT NULL
    )
    """
)


# ============================================================
# PROPERTY IMAGES TABLE
# ============================================================

cursor.execute(
    """
    CREATE TABLE IF NOT EXISTS property_images (
        id INTEGER PRIMARY KEY,
        property_id INTEGER NOT NULL,
        image TEXT NOT NULL
    )
    """
)


# ============================================================
# ENSURE EXISTING COLUMNS
# ============================================================

for column, definition in (
    ("phone", "TEXT"),
    ("reset_token", "TEXT"),
    ("token_expiry", "TEXT"),
):

    ensure_column(
        "users",
        column,
        definition
    )


for column, definition in (
    ("description", "TEXT"),
    ("bedrooms", "INTEGER"),
    ("bathrooms", "INTEGER"),
    ("area", "INTEGER"),
    ("property_type", "TEXT"),
    ("image", "TEXT"),
    ("status", "TEXT DEFAULT 'Available'"),
):

    ensure_column(
        "properties",
        column,
        definition
    )


# ============================================================
# FAVORITES CLEANUP
# ============================================================

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


# ============================================================
# UNIQUE FAVORITE INDEX
# ============================================================

cursor.execute(
    """
    CREATE UNIQUE INDEX IF NOT EXISTS
    idx_favorites_user_property
    ON favorites(user_email, property_id)
    """
)


# ============================================================
# COMMIT INITIALIZATION
# ============================================================

connection.commit()


print(
    f"Database connected successfully: {DATABASE_TYPE}"
)