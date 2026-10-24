import os
import html
import httpx
from dotenv import load_dotenv

load_dotenv()

BREVO_URL = "https://api.brevo.com/v3/smtp/email"


def build_email_wrapper(headline: str, badge: str, inner_html: str, preheader: str = "") -> str:
    """Bulletproof, luxury responsive HTML email layout for NestHub."""
    frontend_url = os.getenv("FRONTEND_URL", "https://nesthub.vercel.app")

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{headline}</title>
  <style>
    body {{ margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }}
    table {{ border-collapse: separate; }}
    a {{ text-decoration: none; }}
  </style>
</head>
<body style="margin: 0; padding: 32px 12px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <span style="display: none !important; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">{preheader}</span>
  
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(15, 23, 42, 0.05);">
    <!-- Brand Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 36px 36px 28px 36px; text-align: left;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <div style="font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff; margin-bottom: 4px;">
                Nest<span style="color: #3b82f6;">Hub</span>
              </div>
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; color: #94a3b8;">
                Luxury Living & Premium Real Estate
              </div>
            </td>
            <td align="right" valign="middle">
              <span style="background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(147, 197, 253, 0.25); color: #93c5fd; font-size: 11px; font-weight: 700; padding: 6px 14px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px;">
                {badge}
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Main Content Area -->
    <tr>
      <td style="padding: 36px;">
        {inner_html}
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #f8fafc; padding: 24px 36px; border-top: 1px solid #e2e8f0; text-align: center;">
        <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b; font-weight: 500;">
          NestHub Real Estate • Kathmandu, Nepal
        </p>
        <p style="margin: 0; font-size: 11px; color: #94a3b8; line-height: 1.5;">
          You received this email because of an inquiry or tour request on <a href="{frontend_url}" style="color: #2563eb; text-decoration: underline;">NestHub</a>.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>"""


async def send_email(
    to_email: str,
    subject: str,
    text: str,
    reply_to: str | None = None,
    html_content: str | None = None,
):
    api_key = os.getenv("BREVO_API_KEY")
    sender_email = os.getenv("BREVO_SENDER_EMAIL")

    if not api_key or not sender_email:
        raise RuntimeError("Brevo settings are missing")

    payload = {
        "sender": {"name": "NestHub Real Estate", "email": sender_email},
        "to": [{"email": to_email}],
        "subject": subject,
        "textContent": text,
    }

    if html_content:
        payload["htmlContent"] = html_content

    if reply_to:
        payload["replyTo"] = {"email": reply_to}

    async with httpx.AsyncClient(timeout=15) as client:
        response = await client.post(
            BREVO_URL,
            headers={"api-key": api_key},
            json=payload,
        )

    response.raise_for_status()


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

    safe_title = html.escape(property_title)
    safe_name = html.escape(buyer_name)
    safe_email = html.escape(buyer_email)
    safe_phone = html.escape(phone) if phone else None
    safe_note = html.escape(note) if note else None

    html_content = build_email_wrapper(
        headline=f"Tour Request: {safe_title}",
        badge="New Tour Request",
        preheader=f"{safe_name} requested a private viewing for {safe_title} on {date}.",
        inner_html=f"""
          <h1 style="margin: 0 0 10px 0; font-size: 22px; font-weight: 800; color: #0f172a; line-height: 1.3;">
            Private Tour Requested
          </h1>
          <p style="margin: 0 0 24px 0; font-size: 14px; color: #64748b; line-height: 1.5;">
            A potential buyer has scheduled a viewing appointment for your property listing.
          </p>

          <!-- Property Card -->
          <div style="background-color: #f1f5f9; border-radius: 14px; padding: 20px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; color: #2563eb; margin-bottom: 6px;">
              Property
            </div>
            <div style="font-size: 17px; font-weight: 800; color: #0f172a; margin-bottom: 12px;">
              {safe_title}
            </div>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding: 6px 0; font-size: 13px; color: #64748b; width: 40%;">Tour Type:</td>
                <td style="padding: 6px 0; font-size: 13px; font-weight: 700; color: #0f172a;">
                  <span style="background: #e0f2fe; color: #0369a1; padding: 3px 10px; border-radius: 9999px; font-size: 11px;">
                    {tour_type_label}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Requested Date:</td>
                <td style="padding: 6px 0; font-size: 13px; font-weight: 700; color: #0f172a;">{date}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Preferred Time:</td>
                <td style="padding: 6px 0; font-size: 13px; font-weight: 700; color: #0f172a;">{time_slot}</td>
              </tr>
            </table>
          </div>

          <!-- Client Details Card -->
          <div style="background-color: #ffffff; border-radius: 14px; padding: 20px; margin-bottom: 28px; border: 1px solid #e2e8f0;">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; color: #475569; margin-bottom: 12px;">
              Client Information
            </div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding: 4px 0; font-size: 13px; color: #64748b; width: 40%;">Client Name:</td>
                <td style="padding: 4px 0; font-size: 13px; font-weight: 700; color: #0f172a;">{safe_name}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; font-size: 13px; color: #64748b;">Client Email:</td>
                <td style="padding: 4px 0; font-size: 13px; font-weight: 700; color: #2563eb;">
                  <a href="mailto:{safe_email}" style="color: #2563eb; text-decoration: none;">{safe_email}</a>
                </td>
              </tr>
              {f'<tr><td style="padding: 4px 0; font-size: 13px; color: #64748b;">Phone Number:</td><td style="padding: 4px 0; font-size: 13px; font-weight: 700; color: #0f172a;">{safe_phone}</td></tr>' if safe_phone else ''}
            </table>

            {f'<div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid #f1f5f9; font-size: 13px; color: #475569; font-style: italic; line-height: 1.5;">"{safe_note}"</div>' if safe_note else ''}
          </div>

          <!-- Action Button -->
          <div style="text-align: center; margin-bottom: 12px;">
            <a href="mailto:{safe_email}?subject=Regarding Your NestHub Tour Request for {safe_title}" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);">
              Reply to {safe_name}
            </a>
          </div>
          <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
            You can also simply hit "Reply" to this email.
          </p>
        """
    )

    await send_email(
        to_email=to_email,
        subject=f"Private Tour Request: {property_title} ({date} at {time_slot})",
        text=text,
        reply_to=buyer_email,
        html_content=html_content,
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
    safe_title = html.escape(property_title)
    safe_name = html.escape(buyer_name)

    html_content = build_email_wrapper(
        headline=f"Viewing Confirmed: {safe_title}",
        badge="Booking Received",
        preheader=f"Your viewing request for {safe_title} on {date} has been confirmed.",
        inner_html=f"""
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="display: inline-block; width: 54px; height: 54px; line-height: 54px; border-radius: 9999px; background-color: #ecfdf5; color: #059669; font-size: 26px; font-weight: bold; margin-bottom: 12px;">
              ✓
            </div>
            <h1 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 800; color: #0f172a;">
              Tour Request Received!
            </h1>
            <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.5;">
              Hi {safe_name}, your request has been sent to the property landlord.
            </p>
          </div>

          <div style="background-color: #f8fafc; border-radius: 16px; padding: 22px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
            <div style="font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 12px; text-align: center;">
              {safe_title}
            </div>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Tour Format:</td>
                <td style="padding: 6px 0; font-size: 13px; font-weight: 700; color: #0f172a; text-align: right;">{tour_type_label}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Scheduled Date:</td>
                <td style="padding: 6px 0; font-size: 13px; font-weight: 700; color: #0f172a; text-align: right;">{date}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Time Window:</td>
                <td style="padding: 6px 0; font-size: 13px; font-weight: 700; color: #0f172a; text-align: right;">{time_slot}</td>
              </tr>
            </table>
          </div>

          <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 14px 18px; border-radius: 0 10px 10px 0; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 13px; color: #1e40af; line-height: 1.5;">
              <strong>What's Next?</strong> The host or listing agent will contact you via email or phone to confirm the meeting details.
            </p>
          </div>
        """
    )

    await send_email(
        to_email=buyer_email,
        subject=f"Viewing Requested: {property_title}",
        text=text,
        html_content=html_content,
    )


async def send_inquiry_email(owner_email: str, property_title: str,
                             buyer_name: str, buyer_email: str, message: str):
    text = f"""Hello,

{buyer_name} is interested in your listing "{property_title}" on NestHub.

Message:
{message}

You can reply directly to this email to reach them at {buyer_email}.

Regards,
NestHub Team
"""

    safe_title = html.escape(property_title)
    safe_name = html.escape(buyer_name)
    safe_email = html.escape(buyer_email)
    safe_msg = html.escape(message)

    html_content = build_email_wrapper(
        headline=f"Inquiry: {safe_title}",
        badge="Property Inquiry",
        preheader=f"{safe_name} sent a message regarding {safe_title}",
        inner_html=f"""
          <h1 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 800; color: #0f172a;">
            New Client Inquiry
          </h1>
          <p style="margin: 0 0 20px 0; font-size: 14px; color: #64748b;">
            Regarding your listing: <strong style="color: #0f172a;">{safe_title}</strong>
          </p>

          <div style="background-color: #f8fafc; border-radius: 14px; padding: 20px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; color: #64748b; margin-bottom: 8px;">
              From {safe_name} ({safe_email})
            </div>
            <div style="font-size: 14px; color: #1e293b; line-height: 1.6; white-space: pre-wrap; font-style: italic;">
              "{safe_msg}"
            </div>
          </div>

          <div style="text-align: center; margin-bottom: 12px;">
            <a href="mailto:{safe_email}?subject=Regarding your NestHub inquiry for {safe_title}" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none;">
              Reply to {safe_name}
            </a>
          </div>
        """
    )

    await send_email(
        owner_email,
        f"New inquiry about {property_title}",
        text,
        reply_to=buyer_email,
        html_content=html_content,
    )


async def send_reset_email(email: str, token: str):
    frontend_url = os.getenv("FRONTEND_URL", "https://nesthub.vercel.app")
    reset_link = f"{frontend_url}/reset-password/{token}"

    text = f"""Hello,

You requested to reset your password.

Click the link below:
{reset_link}

If you didn't request this, ignore this email.

Regards,
NestHub Team
"""

    html_content = build_email_wrapper(
        headline="Reset Your NestHub Password",
        badge="Security",
        preheader="Reset your password for NestHub Real Estate.",
        inner_html=f"""
          <h1 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 800; color: #0f172a;">
            Password Reset Request
          </h1>
          <p style="margin: 0 0 24px 0; font-size: 14px; color: #64748b; line-height: 1.5;">
            We received a request to reset your NestHub account password. Click the button below to choose a new password:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="{reset_link}" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);">
              Reset My Password
            </a>
          </div>

          <p style="margin: 0 0 8px 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
            This link is valid for 24 hours. If you did not request a password reset, you can safely disregard this email.
          </p>
        """
    )

    await send_email(
        email,
        "NestHub Password Reset",
        text,
        html_content=html_content,
    )


async def send_verification_email(email: str, token: str):
    backend_url = os.getenv("BACKEND_URL", "https://nesthub-backend.onrender.com")
    link = f"{backend_url}/users/verify?token={token}"

    text = f"""Hello,

Thanks for signing up for NestHub. Click the link below to verify your email:
{link}

The link works for 24 hours. If you didn't sign up, ignore this email.

Regards,
NestHub Team
"""

    html_content = build_email_wrapper(
        headline="Verify Your NestHub Account",
        badge="Welcome",
        preheader="Confirm your email to complete your NestHub registration.",
        inner_html=f"""
          <h1 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 800; color: #0f172a;">
            Welcome to NestHub!
          </h1>
          <p style="margin: 0 0 24px 0; font-size: 14px; color: #64748b; line-height: 1.5;">
            Thank you for creating an account with NestHub. Please verify your email address to activate your full privileges.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="{link}" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);">
              Verify My Email
            </a>
          </div>

          <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
            This link is active for 24 hours. If you didn't create an account, you can ignore this email.
          </p>
        """
    )

    await send_email(
        email,
        "Verify your NestHub email",
        text,
        html_content=html_content,
    )

