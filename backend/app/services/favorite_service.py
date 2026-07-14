from app.database import cursor, connection


def add_favorite(user_email, property_id):

    cursor.execute(
        """
        INSERT INTO favorites (user_email, property_id)
        VALUES (?, ?)
        """,
        (
            user_email,
            property_id
        )
    )

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

    connection.commit()