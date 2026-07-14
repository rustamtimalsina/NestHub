from pydantic import BaseModel, Field

class Property(BaseModel):
    title: str = Field(..., max_length=100)
    city: str = Field(..., max_length=100)
    price: int = Field(..., gt=0)
    image: str

class User(BaseModel):
    name: str
    email: str
    password: str
    role: str

class UserLogin(BaseModel):
    email: str
    password: str