from fastapi import APIRouter, Depends, HTTPException
from app.schemas import Property
from app.security.admin import verify_admin
from app.database import connection, cursor
from app.services.property_service import (
    get_all_properties_admin,
    admin_delete_property,
    admin_update_property
)

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

@router.get("/dashboard")
def get_dashboard_stats(
    current_user: str = Depends(verify_admin)
):
    # Total users
    cursor.execute(
        "SELECT COUNT(*) AS total FROM users"
    )
    total_users = cursor.fetchone()["total"]

    # Total properties
    cursor.execute(
        "SELECT COUNT(*) AS total FROM properties"
    )
    total_properties = cursor.fetchone()["total"]

    # Total favorites
    cursor.execute(
        "SELECT COUNT(*) AS total FROM favorites"
    )
    total_favorites = cursor.fetchone()["total"]

    # Properties by city
    cursor.execute(
        """
        SELECT city, COUNT(*) AS total
        FROM properties
        GROUP BY city
        ORDER BY total DESC
        """
    )

    properties_by_city = [
        dict(row)
        for row in cursor.fetchall()
    ]
    # Properties by type
    cursor.execute(
        """
        SELECT property_type, COUNT(*) AS total
        FROM properties
        GROUP BY property_type
        ORDER BY total DESC
        """
    )

    properties_by_type = [
        dict(row)
        for row in cursor.fetchall()
    ]

    # Recent properties
    cursor.execute(
        """
        SELECT id, title, city, price, property_type, owner_email
        FROM properties
        ORDER BY id DESC
        LIMIT 5
        """
    )

    recent_properties = [
        dict(row)
        for row in cursor.fetchall()
    ]

    # Recent users
    cursor.execute(
        """
        SELECT id, name, email, phone, role
        FROM users
        ORDER BY id DESC
        LIMIT 5
        """
    )

    recent_users = [
        dict(row)
        for row in cursor.fetchall()
    ]

    return {
        "total_users": total_users,
        "total_properties": total_properties,
        "total_favorites": total_favorites,
        "properties_by_city": properties_by_city,
        "properties_by_type": properties_by_type,
        "recent_properties": recent_properties,
        "recent_users": recent_users,
    }
@router.get("/users")
def get_all_users(
    current_user: str = Depends(verify_admin)
):
    cursor.execute(
        """
        SELECT id, name, email, phone, role
        FROM users
        ORDER BY id DESC
        """
    )

    users = [
        dict(row)
        for row in cursor.fetchall()
    ]

    return users

@router.put("/users/{user_id}/role")
def change_user_role(
    user_id: int,
    role: str,
    current_user: str = Depends(verify_admin)
):
    if role not in ["user", "admin"]:
        raise HTTPException(
            status_code=400,
            detail="Role must be either user or admin."
        )

    cursor.execute(
        """
        SELECT id, email, role
        FROM users
        WHERE id = ?
        """,
        (user_id,)
    )

    user = cursor.fetchone()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    # Prevent admin from accidentally removing their own admin access
    if user["email"] == current_user:
        raise HTTPException(
            status_code=400,
            detail="You cannot change your own role."
        )

    cursor.execute(
        """
        UPDATE users
        SET role = ?
        WHERE id = ?
        """,
        (role, user_id)
    )

    connection.commit()

    return {
        "message": "User role updated successfully.",
        "user_id": user_id,
        "role": role
    }
@router.get("/properties")
def get_admin_properties(
    current_user: str = Depends(verify_admin)
):
    return get_all_properties_admin()

@router.delete("/properties/{property_id}")
def delete_admin_property(
    property_id: int,
    current_user: str = Depends(verify_admin)
):
    result = admin_delete_property(property_id)

    if result == "not_found":
        raise HTTPException(
            status_code=404,
            detail="Property not found"
        )

    return {
        "message": "Property deleted successfully."
    }
@router.put("/properties/{property_id}")
def update_admin_property(
    property_id: int,
    property: Property,
    current_user: str = Depends(verify_admin)
):
    result = admin_update_property(
        property_id,
        property
    )

    if result == "not_found":
        raise HTTPException(
            status_code=404,
            detail="Property not found"
        )

    return {
        "message": "Property updated successfully."
    }
