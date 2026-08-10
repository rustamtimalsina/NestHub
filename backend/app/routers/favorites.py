from fastapi import APIRouter, Depends
from app.security.oauth2 import verify_token
from app.services.favorite_service import (
    add_favorite,
    get_favorites,
    remove_favorite,
    is_favorite
)
router = APIRouter(
    prefix="/favorites",
    tags=["Favorites"]
)


@router.post("/{property_id}")
def favorite_property(
    property_id: int,
    current_user: str = Depends(verify_token)
):

    add_favorite(
        current_user,
        property_id
    )

    return {
        "message": "Property added to favorites."
    }

@router.delete("/{property_id}")
def unfavorite_property(
    property_id: int,
    current_user: str = Depends(verify_token)
):

    remove_favorite(
        current_user,
        property_id
    )

    return {
        "message": "Property removed from favorites."
    }

@router.get("/check/{property_id}")
def check_favorite(
    property_id: int,
    current_user: str = Depends(verify_token)
):

    return {
        "is_favorite": is_favorite(
            current_user,
            property_id
        )
    }

@router.get("/")
def get_user_favorites(
    current_user: str = Depends(verify_token)
):
    favorites = get_favorites(current_user)
    return {
        "favorites": favorites
    }