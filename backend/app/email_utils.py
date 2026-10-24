import os

import httpx
from dotenv import load_dotenv

load_dotenv()

BREVO_URL = "https://api.brevo.com/v3/smtp/email"


async def send_email(to_email: str, subject: str, text: str, reply_to: str | None = None):
    api_key = os.getenv("BREVO_API_KEY")
    sender_email = os.getenv("BREVO_SENDER_EMAIL")

    if not api_key or not sender_email:
        raise RuntimeError("Brevo settings are missing")

    payload = {
        "sender": {"name": "NestHub", "email": sender_email},
        "to": [{"email": to_email}],
        "subject": subject,
        "textContent": text,
    }

    if reply_to:
        payload["replyTo"] = {"email": reply_to}

    async with httpx.AsyncClient(timeout=15) as client:
        response = await client.post(
            BREVO_URL,
            headers={"api-key": api_key},
            json=payload,
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


async def send_verification_email(email: str, token: str):
    backend_url = os.getenv("BACKEND_URL", "http://127.0.0.1:8000")
    link = f"{backend_url}/users/verify?token={token}"

    await send_email(
        email,
        "Verify your NestHub email",
        f"""Hello,

Thanks for signing up for NestHub. Click the link below to verify your email:

{link}

The link works for 24 hours. If you didn't sign up, ignore this email.

Regards,
NestHub Team
""",
    )
async def send_inquiry_email(owner_email: str, property_title: str,
                             buyer_name: str, buyer_email: str, message: str):
    await send_email(
        owner_email,
        f"New inquiry about {property_title}",
        f"""Hello,

{buyer_name} is interested in your listing "{property_title}" on NestHub.

Message:
{message}

You can reply directly to this email to reach them at {buyer_email}.

Regards,
NestHub Team
""",
        reply_to=buyer_email,
    )


async def send_appointment_email(
    to_email: str,
    property_title: str,
    buyer_name: str,
    buyer_email: str,
    tour_type: str,
    date: str,
    time_slot: str,
    phone: str | None = None,
    note: str | None = None,
):
    tour_type_label = "In-Person Walkthrough" if tour_type == "in-person" else "Live Video Call"
    phone_line = f"\nClient Phone: {phone}" if phone else ""
    note_line = f"\nClient Note: {note}" if note else ""

    text = f"""Hello,

You have received a new private viewing request for "{property_title}" on NestHub!

Appointment Details:
- Tour Type: {tour_type_label}
- Preferred Date: {date}
- Preferred Time: {time_slot}

Client Information:
- Name: {buyer_name}
- Email: {buyer_email}{phone_line}{note_line}

You can reply directly to this email to coordinate the appointment with {buyer_name}.

Regards,
NestHub Team
"""
    await send_email(
        to_email=to_email,
        subject=f"Private Tour Request: {property_title} ({date} at {time_slot})",
        text=text,
        reply_to=buyer_email,
    )


async def send_appointment_confirmation_to_buyer(
    buyer_email: str,
    buyer_name: str,
    property_title: str,
    tour_type: str,
    date: str,
    time_slot: str,
):
    tour_type_label = "In-Person Walkthrough" if tour_type == "in-person" else "Live Video Call"
    text = f"""Hello {buyer_name},

Thank you for scheduling a visit with NestHub!

Your tour request for "{property_title}" has been successfully delivered:
- Tour Type: {tour_type_label}
- Date: {date}
- Time Slot: {time_slot}

The host/agent will contact you directly to confirm the visit.

Regards,
NestHub Team
"""
    await send_email(
        to_email=buyer_email,
        subject=f"Viewing Requested: {property_title}",
        text=text,
    )
