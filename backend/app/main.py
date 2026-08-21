from fastapi import FastAPI
from app.schemas import Property
from app.database import connection, cursor
from app.routers.properties import router as property_router
from app.routers.users import router as user_router
from app.routers.admin import router as admin_router
from app.routers.favorites import router as favorites_router
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://nesthub-seven.vercel.app",
        "https://nest-lkrwukzxd-rustam-timalsinas-projects.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(property_router)
app.include_router(user_router)
app.include_router(favorites_router)
app.include_router(admin_router)
uploads_dir = Path(__file__).resolve().parent.parent / "uploads"
uploads_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

print("Database connected successfully!")


@app.get("/")
def home():
    return {"message": "Welcome to NestHub!"}


@app.get("/about")
def about():
    return {"message": "This is the NestHub Backend."}


@app.get("/contact")
def contact():
    return {
        "email": "support@nesthub.com",
        "phone": "9800000000"
    }





@app.get("/hello/{name}")
def say_hello(name: str):
    return {
        "message": f"Hello {name}! Welcome to NestHub."
    }
 
@app.get("/search")
def search(city: str):
    return {
        "city": city
    }


