from fastapi import APIRouter, Depends, HTTPException
from app.security.oauth2 import verify_token
from app.database import cursor, connection
from app.schemas import Property
from app.services.property_service import (
    create_property,
    add_property_images,
    get_property_images,
     delete_property_image,
    get_all_properties,
    get_recent_properties,
    get_property_by_id,
    get_similar_properties,
    update_property,
    delete_property,
    search_properties,
    get_my_properties,
    set_cover_image,
)

from fastapi import UploadFile, File
import uuid
from app.database import BASE_DIR

router = APIRouter(
    prefix="/properties",
    tags=["Properties"]
)


@router.post("/")
def add_property(property: Property, current_user: str = Depends(verify_token)):
   create_property(
    property.title,
    property.description,
    property.city,
    property.price,
    property.bedrooms,
    property.bathrooms,
    property.area,
    property.property_type,
    property.status,      # ← add this
    property.image,
    current_user
)

   return {
        "message": "Property saved successfully!"
    }


@router.get("/")
def get_properties(
    page: int = 1,
    limit: int = 5,
    sort: str = "newest",
    city: str = "",
    property_type: str = ""
):

    if page < 1:
        raise HTTPException(status_code=422, detail="page must be at least 1")
    if not 1 <= limit <= 100:
        raise HTTPException(status_code=422, detail="limit must be between 1 and 100")

    return get_all_properties(
        page,
        limit,
        sort,
        city,
        property_type
    )
@router.get("/cities")
def get_cities():

    cursor.execute("""
        SELECT DISTINCT city
        FROM properties
        ORDER BY city
    """)

    cities = cursor.fetchall()

    return [
        city["city"]
        for city in cities
    ]
@router.get("/types")
def get_property_types():

    cursor.execute("""
        SELECT DISTINCT property_type
        FROM properties
        WHERE property_type IS NOT NULL
          AND TRIM(property_type) != ''
        ORDER BY property_type
    """)

    types = cursor.fetchall()

    return [
        item["property_type"]
        for item in types
    ]

@router.get("/me")
def my_properties(
    current_user: str = Depends(verify_token)
):

    return get_my_properties(current_user)

@router.get("/search")
def search(keyword: str):

    return search_properties(keyword)
@router.get("/public/{property_id}")
def get_public_property(property_id: int):

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
        raise HTTPException(
            status_code=404,
            detail="Property not found"
        )

    return dict(property)

@router.get("/recent")
def recent_properties():\
    return get_recent_properties()

@router.get("/{property_id}")
def get_property(property_id: int):
    prop = get_property_by_id(property_id)

    if prop is None:
        raise HTTPException(
            status_code=404,
            detail="Property not found"
        )

    return prop

@router.get("/{property_id}/similar")
def similar_properties(property_id: int):
    return get_similar_properties(property_id)

@router.get("/{property_id}/images")
def property_images(property_id: int):
    return get_property_images(property_id)

@router.put("/{property_id}")
def edit_property(
    property_id: int,
    property: Property,
    current_user: str = Depends(verify_token)
):

    result = update_property(
        property_id,
        property,
        current_user
    )

    if result == "not_found":
        raise HTTPException(
            status_code=404,
            detail="Property not found"
        )

    if result == "unauthorized":
        raise HTTPException(
            status_code=403,
            detail="You are not the owner of this property"
        )

    return {
        "message": "Property updated successfully!"
    }

@router.delete("/{property_id}")
def remove_property(
    property_id: int,
    current_user: str = Depends(verify_token)
):

    result = delete_property(
        property_id,
        current_user
    )

    if result == "not_found":
        raise HTTPException(
            status_code=404,
            detail="Property not found"
        )

    if result == "unauthorized":
        raise HTTPException(
            status_code=403,
            detail="You are not the owner of this property"
        )

    return {
        "message": "Property deleted successfully!"
    }

@router.post("/upload")
async def upload_image(
    file: UploadFile = File(...), current_user: str = Depends(verify_token)
):
    allowed_types = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp"}
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=415, detail="Only JPEG, PNG, and WebP images are allowed.")

    content = await file.read(5 * 1024 * 1024 + 1)
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Image must be 5 MB or smaller.")
    if not content:
        raise HTTPException(status_code=422, detail="Image file is empty.")

    filename = f"{uuid.uuid4()}.{allowed_types[file.content_type]}"
    upload_path = BASE_DIR / "uploads"
    upload_path.mkdir(parents=True, exist_ok=True)
    (upload_path / filename).write_bytes(content)

    return {
        "filename": filename
    }
@router.post("/{property_id}/images")
async def upload_property_images(
    property_id: int,
    files: list[UploadFile] = File(...),
    current_user: str = Depends(verify_token),
):
    # Check property ownership
    cursor.execute(
        """
        SELECT owner_email
        FROM properties
        WHERE id = ?
        """,
        (property_id,)
    )

    property = cursor.fetchone()

    if property is None:
        raise HTTPException(
            status_code=404,
            detail="Property not found"
        )

    if property["owner_email"] != current_user:
        raise HTTPException(
            status_code=403,
            detail="You are not the owner of this property"
        )

    filenames = []

    upload_path = BASE_DIR / "uploads"
    upload_path.mkdir(parents=True, exist_ok=True)

    allowed_types = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
    }

    for file in files:

        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=415,
                detail="Only JPEG, PNG and WebP are allowed."
            )

        content = await file.read(5 * 1024 * 1024 + 1)

        if len(content) > 5 * 1024 * 1024:
            raise HTTPException(
                status_code=413,
                detail="Each image must be less than 5 MB."
            )

        filename = f"{uuid.uuid4()}.{allowed_types[file.content_type]}"

        (upload_path / filename).write_bytes(content)

        filenames.append(filename)

    add_property_images(property_id, filenames)

    return {
        "message": "Images uploaded successfully.",
        "images": filenames
    }
@router.delete("/images/{image_id}")
def remove_property_image(
    image_id: int,
    current_user: str = Depends(verify_token)
):
    result = delete_property_image(image_id, current_user)

    if result == "not_found":
        raise HTTPException(
            status_code=404,
            detail="Image not found"
        )

    if result == "unauthorized":
        raise HTTPException(
            status_code=403,
            detail="Unauthorized"
        )

    return {
        "message": "Image deleted successfully."
    }

@router.put("/images/{image_id}/cover")
def make_cover_image(
    image_id: int,
    current_user: str = Depends(verify_token)
):
    result = set_cover_image(image_id, current_user)

    if result == "not_found":
        raise HTTPException(
            status_code=404,
            detail="Image not found"
        )

    if result == "unauthorized":
        raise HTTPException(
            status_code=403,
            detail="Unauthorized"
        )

    return {
        "message": "Cover image updated successfully."
    }