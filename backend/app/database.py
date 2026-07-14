import sqlite3

connection = sqlite3.connect(
    "nesthub.db",
    check_same_thread=False
)

connection.row_factory = sqlite3.Row

cursor = connection.cursor()


# Properties table
cursor.execute("""
CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    city TEXT,
    price INTEGER,
    image TEXT,
    owner_email TEXT
)
""")
try:
    cursor.execute("ALTER TABLE properties ADD COLUMN image TEXT")
except:
    pass


# Users table
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,

    email TEXT UNIQUE NOT NULL,

    password TEXT NOT NULL,

    role TEXT NOT NULL

)
""")

# Favorites table
cursor.execute("""
CREATE TABLE IF NOT EXISTS favorites (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_email TEXT NOT NULL,

    property_id INTEGER NOT NULL

)
""")


connection.commit()
