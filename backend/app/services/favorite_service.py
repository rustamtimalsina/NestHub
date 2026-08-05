from app.database import cursor, connection


def add_favorite(user_email, property_id):

    cursor.execute(
        """
        INSERT OR IGNORE INTO favorites (user_email, property_id)
        VALUES (?, ?)
        """,
        (
            user_email,
            property_id
        )
    )
    connection.commit()
def remove_favorite(user_email, property_id):

    cursor.execute(
        """
        DELETE FROM favorites
        WHERE user_email = ?
        AND property_id = ?
        """,
        (
            user_email,
            property_id
        )
    )

    connection.commit()


def get_favorites(user_email):

    cursor.execute(
        """
        SELECT properties.*
        FROM favorites
        JOIN properties
        ON favorites.property_id = properties.id
        WHERE favorites.user_email = ?
        """,
        (user_email,)
    )

    favorites = cursor.fetchall()

    return [dict(property) for property in favorites]

def is_favorite(user_email, property_id):

    cursor.execute(
        """
        SELECT *
        FROM favorites
        WHERE user_email = ?
        AND property_id = ?
        """,
        (
            user_email,
            property_id
        )
    )

    favorite = cursor.fetchone()

    return favorite is not None
