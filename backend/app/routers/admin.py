from fastapi import APIRouter, Depends

from app.security.admin import verify_admin
from app.database import cursor

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

    return {
        "total_users": total_users,
        "total_properties": total_properties,
        "total_favorites": total_favorites,
        "properties_by_city": properties_by_city
    }
