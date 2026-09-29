import os

import httpx
from dotenv import load_dotenv

load_dotenv()

BREVO_URL = "https://api.brevo.com/v3/smtp/email"


async def send_email(to_email: str, subject: str, text: str):
    api_key = os.getenv("BREVO_API_KEY")
    sender_email = os.getenv("BREVO_SENDER_EMAIL")

    if not api_key or not sender_email:
        raise RuntimeError("Brevo settings are missing")

    async with httpx.AsyncClient(timeout=15) as client:
        response = await client.post(
            BREVO_URL,
            headers={"api-key": api_key},
            json={
                "sender": {"name": "NestHub", "email": sender_email},
                "to": [{"email": to_email}],
                "subject": subject,
                "textContent": text,
            },
        )

    response.raise_for_status()


async def send_reset_email(email: str, token: str):
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    reset_link = f"{frontend_url}/reset-password/{token}"

    await send_email(
        email,
        "NestHub Password Reset",
        f"""Hello,

You requested to reset your password.

Click the link below:

{reset_link}

If you didn't request this, ignore this email.

Regards,
NestHub Team
""",
    )