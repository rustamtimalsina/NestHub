from app.database import cursor, connection


def create_property(
    title,
    description,
    city,
    price,
    bedrooms,
    bathrooms,
    area,
    property_type,
    status,
    image,
    owner_email
):
    cursor.execute(
        """
        INSERT INTO properties
        (
            title,
            description,
            city,
            price,
            bedrooms,
            bathrooms,
            area,
            property_type,
            status,
            image,
            owner_email
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            status,
            image,
            owner_email
        )
    )

    property_id = cursor.execute(
    "SELECT last_insert_rowid()"
).fetchone()[0]

    # Add the initial property image to the gallery
    if image:
        cursor.execute(
            """
            INSERT INTO property_images
            (property_id, image)
            VALUES (?, ?)
            """,
            (property_id, image)
        )

    connection.commit()
def get_property_by_id(property_id):

    cursor.execute(
        """
        SELECT
            properties.*,
            users.name AS owner_name,
            users.phone AS owner_phone
        FROM properties
        JOIN users
            ON properties.owner_email = users.email
        WHERE properties.id = ?
        """,
        (property_id,)
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
    property_type=?,
    status=?,
    image=?
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
    property.status,
    property.image,
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

    # Delete property images
    cursor.execute(
        "DELETE FROM property_images WHERE property_id = ?",
        (property_id,)
    )

    # Delete favorites for this property
    cursor.execute(
        "DELETE FROM favorites WHERE property_id = ?",
        (property_id,)
    )

    # Delete the property
    cursor.execute(
        "DELETE FROM properties WHERE id = ?",
        (property_id,)
    )

    connection.commit()

    return "success"

def get_all_properties(page, limit, sort, city, property_type):

    offset = (page - 1) * limit

    order_by = "id DESC"

    if sort == "oldest":
        order_by = "id ASC"

    elif sort == "price_low":
        order_by = "price ASC"

    elif sort == "price_high":
        order_by = "price DESC"

    query = """
        SELECT *
        FROM properties
        WHERE status = 'Available'
        AND id NOT IN (
            SELECT id
            FROM properties
            WHERE status = 'Available'
            ORDER BY id DESC
            LIMIT 3
        )
    """

    params = []

    if city:
        query += " AND city = ?"
        params.append(city)

    if property_type:
        query += " AND property_type = ?"
        params.append(property_type)

    # Count filtered properties
    count_query = query.replace("SELECT *", "SELECT COUNT(*)")

    cursor.execute(count_query, params)
    total = cursor.fetchone()[0]

    query += f"""
        ORDER BY {order_by}
        LIMIT ? OFFSET ?
    """

    params.extend([limit, offset])

    cursor.execute(query, params)

    properties = cursor.fetchall()

    return {
        "properties": [dict(property) for property in properties],
        "total": total,
        "page": page,
        "total_pages": (total + limit - 1) // limit
    }
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
def get_all_properties_admin():
    cursor.execute(
        """
        SELECT
            properties.*,
            users.name AS owner_name,
            users.phone AS owner_phone
        FROM properties
        LEFT JOIN users
            ON properties.owner_email = users.email
        ORDER BY properties.id DESC
        """
    )

    properties = cursor.fetchall()

    return [
        dict(property)
        for property in properties
    ]
def get_recent_properties():

    cursor.execute(
        """
        SELECT *
        FROM properties
        WHERE status = 'Available'
        ORDER BY id DESC
        LIMIT 3
        """
    )

    properties = cursor.fetchall()

    return [dict(property) for property in properties]
def get_similar_properties(property_id):

    cursor.execute(
        """
        SELECT city, property_type
        FROM properties
        WHERE id = ?
        """,
        (property_id,)
    )

    current = cursor.fetchone()

    if current is None:
        return []

    cursor.execute(
        """
        SELECT *
        FROM properties
        WHERE id != ?
        AND status = 'Available'
        AND (
            city = ?
            OR property_type = ?
        )
        ORDER BY id DESC
        LIMIT 3
        """,
        (
            property_id,
            current["city"],
            current["property_type"]
        )
    )

    properties = cursor.fetchall()

    return [dict(property) for property in properties]

def add_property_images(property_id, images):
    for image in images:
        cursor.execute(
            """
            INSERT INTO property_images (property_id, image)
            VALUES (?, ?)
            """,
            (property_id, image)
        )

    connection.commit()

def get_property_images(property_id):

    cursor.execute(
        """
        SELECT id, image
        FROM property_images
        WHERE property_id = ?
        ORDER BY id DESC
        """,
        (property_id,)
    )

    images = cursor.fetchall()

    return [
        dict(image)
        for image in images
    ]
def delete_property_image(image_id: int, current_user: str):
    cursor.execute("""
        SELECT property_id
        FROM property_images
        WHERE id = ?
    """, (image_id,))

    image = cursor.fetchone()

    if image is None:
        return "not_found"

    cursor.execute("""
        SELECT owner_email
        FROM properties
        WHERE id = ?
    """, (image["property_id"],))

    property = cursor.fetchone()

    if property["owner_email"] != current_user:
        return "unauthorized"

    cursor.execute("""
        DELETE FROM property_images
        WHERE id = ?
    """, (image_id,))

    connection.commit()

    return "success"
def set_cover_image(image_id: int, current_user: str):
    cursor.execute("""
        SELECT property_id, image
        FROM property_images
        WHERE id = ?
    """, (image_id,))

    image = cursor.fetchone()

    if image is None:
        return "not_found"

    cursor.execute("""
        SELECT owner_email
        FROM properties
        WHERE id = ?
    """, (image["property_id"],))

    property = cursor.fetchone()

    if property["owner_email"] != current_user:
        return "unauthorized"

    cursor.execute("""
        UPDATE properties
        SET image = ?
        WHERE id = ?
    """, (
        image["image"],
        image["property_id"]
    ))

    connection.commit()

    return "success"
def admin_delete_property(property_id):
    cursor.execute(
        """
        SELECT id
        FROM properties
        WHERE id = ?
        """,
        (property_id,)
    )

    property = cursor.fetchone()

    if property is None:
        return "not_found"

    # Delete property images
    cursor.execute(
        """
        DELETE FROM property_images
        WHERE property_id = ?
        """,
        (property_id,)
    )

    # Delete favorites
    cursor.execute(
        """
        DELETE FROM favorites
        WHERE property_id = ?
        """,
        (property_id,)
    )

    # Delete property
    cursor.execute(
        """
        DELETE FROM properties
        WHERE id = ?
        """,
        (property_id,)
    )

    connection.commit()

    return "success"
def admin_update_property(property_id, property):
    cursor.execute(
        """
        SELECT id
        FROM properties
        WHERE id = ?
        """,
        (property_id,)
    )

    existing_property = cursor.fetchone()

    if existing_property is None:
        return "not_found"

    cursor.execute(
        """
        UPDATE properties
        SET
            title = ?,
            description = ?,
            city = ?,
            price = ?,
            bedrooms = ?,
            bathrooms = ?,
            area = ?,
            property_type = ?,
            status = ?,
            image = ?
        WHERE id = ?
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
            property.status,
            property.image,
            property_id
        )
    )

    connection.commit()

    return "success"