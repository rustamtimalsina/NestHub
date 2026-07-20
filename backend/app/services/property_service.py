from app.database import cursor, connection


def create_property(title, description, city, price, bedrooms, bathrooms, area, property_type, image, owner_email):

    cursor.execute(
        """
       INSERT INTO properties
(title, description, city, price, bedrooms, bathrooms, area, property_type, image, owner_email)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            title,
            description,
            city,
            price,
            bedrooms,
            bathrooms,
            area,
            property_type,
            image,
            owner_email
        )
    )
    connection.commit()

def get_property_by_id(property_id, current_user):

    cursor.execute(
        """
        SELECT * FROM properties
        WHERE id = ? AND owner_email = ?
        """,
        (
            property_id,
            current_user
        )
    )

    property = cursor.fetchone()

    if property is None:
        return None

    return dict(property)

def update_property(property_id, property, current_user):

    cursor.execute(
        "SELECT owner_email FROM properties WHERE id = ?",
        (property_id,)
    )

    owner = cursor.fetchone()

    if owner is None:
        return "not_found"

    if owner["owner_email"] != current_user:
        return "unauthorized"

    cursor.execute(
        """
        UPDATE properties
        SET
            title=?,
            description=?,
            city=?,
            price=?,
            bedrooms=?,
            bathrooms=?,
            area=?,
            property_type=?
        WHERE id=?
        """,
        (
            property.title,
            property.description,
            property.city,
            property.price,
            property.bedrooms,
            property.bathrooms,
            property.area,
            property.property_type,
            property_id
        )
    )

    connection.commit()

    return "success"

def delete_property(property_id, current_user):

    cursor.execute(
        "SELECT owner_email FROM properties WHERE id = ?",
        (property_id,)
    )

    owner = cursor.fetchone()

    if owner is None:
        return "not_found"

    if owner["owner_email"] != current_user:
        return "unauthorized"

    cursor.execute(
        "DELETE FROM properties WHERE id = ?",
        (property_id,)
    )

    connection.commit()

    return "success"

def get_all_properties(page, limit):

    offset = (page - 1) * limit

    cursor.execute(
        """
        SELECT *
        FROM properties
        LIMIT ? OFFSET ?
        """,
        (
            limit,
            offset
        )
    )

    properties = cursor.fetchall()

    return [dict(property) for property in properties]

def search_properties(keyword):

    cursor.execute(
        """
        SELECT *
        FROM properties
        WHERE city LIKE ?
        OR title LIKE ?
        """,
        (
            f"%{keyword}%",
            f"%{keyword}%"
        )
    )

    properties = cursor.fetchall()

    return [dict(property) for property in properties]
def get_my_properties(current_user):

    cursor.execute(
        "SELECT * FROM properties WHERE owner_email = ?",
        (current_user,)
    )

    properties = cursor.fetchall()

    return [dict(property) for property in properties]
