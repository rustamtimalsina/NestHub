from pydantic import BaseModel, Field

class Property(BaseModel):
    title: str = Field(..., max_length=100)
    description: str = Field(..., max_length=1000)
    city: str = Field(..., max_length=100)
    price: int = Field(..., gt=0)
    bedrooms: int = Field(..., ge=0)
    bathrooms: int = Field(..., ge=0)
    area: int = Field(..., gt=0)
    property_type: str = Field(..., max_length=50)
    image: str

class User(BaseModel):
    name: str
    email: str
    password: str
    role: str

class UserLogin(BaseModel):
    email: str
    password: str