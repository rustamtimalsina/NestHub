from fastapi import APIRouter, Depends, HTTPException
from app.security.oauth2 import verify_token
from app.database import cursor, connection
from app.schemas import Property
from app.services.property_service import (
    create_property,
    get_all_properties,
    get_my_properties,
    get_property_by_id,
    update_property,
    delete_property,
    search_properties
)
from fastapi import UploadFile, File
import shutil
import uuid

router = APIRouter(
    prefix="/properties",
    tags=["Properties"]
)


@router.post("/")
def add_property(property: Property, current_user: str = Depends(verify_token)):
   create_property(
     property.title,
     property.city,
     property.price,
     property.image,
     current_user
)
   return {
        "message": "Property saved successfully!"
    }


@router.get("/")
def get_properties(
    page: int = 1,
    limit: int = 5
):

    return get_all_properties(
        page,
        limit
    )

@router.get("/me")
def my_properties(
    current_user: str = Depends(verify_token)
):

    return get_my_properties(current_user)

@router.get("/search")
def search(keyword: str):

    return search_properties(keyword)

@router.get("/{property_id}")
def get_property(
    property_id: int,
    current_user: str = Depends(verify_token)
):
    prop = get_property_by_id(
        property_id,
        current_user
    )

    if prop is None:
        raise HTTPException(
            status_code=404,
            detail="Property not found"
        )

    return prop

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
def upload_image(file: UploadFile = File(...)):

    extension = file.filename.split(".")[-1]

    filename = f"{uuid.uuid4()}.{extension}"

    with open(f"uploads/{filename}", "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "filename": filename
    }