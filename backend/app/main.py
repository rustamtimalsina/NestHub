from fastapi import FastAPI
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.limiter import limiter
from app.schemas import Property
from app.database import connection, cursor
from app.routers.properties import router as property_router
from app.routers.users import router as user_router
from app.routers.admin import router as admin_router
from app.routers.favorites import router as favorites_router
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import os
import sentry_sdk


def scrub_event(event, hint):
    # Remove web address details, cookies and form data before sending
    request = event.get("request")
    if request:
        request.pop("query_string", None)
        request.pop("cookies", None)
        request.pop("data", None)
        if "url" in request:
            request["url"] = request["url"].split("?")[0]
    return event


sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    send_default_pii=False,
    traces_sample_rate=0.0,
    before_send=scrub_event,
)

app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

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


# Wrap the complete ASGI application so CORS headers are also returned for
# unexpected server errors.  Using ``add_middleware`` only covers errors
# handled inside the FastAPI app, which causes browsers to hide a 500 response
# as a misleading CORS error.
app = CORSMiddleware(
    app=app,
    allow_origins=[
        "http://localhost:5173",
        "https://nest-hub-six.vercel.app",
        "https://nest-lkrwukzxd-rustam-timalsinas-projects.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


