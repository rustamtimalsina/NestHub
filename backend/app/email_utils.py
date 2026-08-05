from fastapi_mail import FastMail, MessageSchema
from app.mail_config import conf


async def send_reset_email(email: str, token: str):

    reset_link = f"http://localhost:5173/reset-password/{token}"

    message = MessageSchema(
        subject="NestHub Password Reset",
        recipients=[email],
        body=f"""
Hello,

You requested to reset your password.

Click the link below:

{reset_link}

If you didn't request this, ignore this email.

Regards,
NestHub Team
""",
        subtype="plain"
    )

    fm = FastMail(conf)

    await fm.send_message(message)