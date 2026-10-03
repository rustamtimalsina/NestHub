from pydantic import BaseModel, Field, field_validator

class Property(BaseModel):
    title: str = Field(..., max_length=100)
    description: str = Field(..., max_length=1000)
    city: str = Field(..., max_length=100)
    price: int = Field(..., gt=0)
    bedrooms: int = Field(..., ge=0)
    bathrooms: int = Field(..., ge=0)
    area: int = Field(..., gt=0)
    property_type: str = Field(..., max_length=50)
    status: str = "Available"   # ← Add this line
    image: str = Field(..., min_length=1, max_length=255)
    @field_validator("city")
    @classmethod
    def clean_city(cls, value):
        # "  lalitpur " -> "Lalitpur"
        cleaned = " ".join(value.split()).title()

        if not cleaned:
            raise ValueError("City cannot be empty.")

        return cleaned

class User(BaseModel):
    name: str
    email: str
    phone: str
    password: str
    role: str

class UserLogin(BaseModel):
    email: str
    password: str

class ResetPasswordRequest(BaseModel):
    token: str
    password: str = Field(..., min_length=8, max_length=128)
