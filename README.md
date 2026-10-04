# 🏡 NestHub

A full-stack real estate web app: people can browse properties, save favorites, message owners, and list their own properties. Admins manage users and listings from a dashboard.

**Live demo:** https://nest-hub-six.vercel.app
**Demo account:** `demo.user@example.com` / `YourDemoPassword`
(a regular user. The admin panel is shown in the screenshots below)

---

## Features

- **Accounts:** registration with **email verification**, login with JWT tokens, password reset by email, and a profile page (name and phone)
- **Properties:** add, edit and delete listings, with a photo gallery and a cover image (photos are stored on Cloudinary)
- **Browsing:** search, filter by city and type, sort, pagination, and a "similar properties" section
- **Favorites:** logged-in users can save listings
- **Contact owner:** a message form emails the owner, and replies go straight to the visitor. The owner's phone number is shown only to logged-in users, and owners' emails are never sent to the public
- **Admin panel:** dashboard with totals, user management (roles), property management (including status)
- **Input validation** in the backend and the frontend forms
- **Security basics:** hashed passwords, expiring email and reset tokens, rate limits on sensitive routes, role checks, and CORS limited to your own sites
- **Quality:** automated tests (pytest) that run on every push with GitHub Actions, and optional error tracking with Sentry

## Tech stack

| Part | Technology |
|---|---|
| Backend | Python, FastAPI, Pydantic, JWT login tokens, Passlib and bcrypt (password hashing) |
| Frontend | React (Vite), Tailwind CSS, React Router, Axios, Framer Motion |
| Database | SQLite for local use, PostgreSQL (for example Neon) for production |
| Email | Brevo (sent over HTTPS) |
| Photos | Cloudinary |
| Errors (optional) | Sentry |

## Project structure

```
NestHub/
├── backend/
│   ├── app/                 # FastAPI app: routers, services, security
│   ├── tests/               # automated tests
│   ├── create_admin.py      # creates the first admin account
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/                 # React pages, components, services
│   └── .env.example
└── .github/workflows/       # runs the tests on every push
```

---

## Quick start (on your computer)

You need **Python 3.12** and a recent version of **Node.js**.

### 1. Backend

```bash
cd backend
python -m venv venv

# Windows (PowerShell):
venv\Scripts\Activate.ps1
# macOS / Linux:
source venv/bin/activate

pip install -r requirements.txt
```

Create your settings file:

```bash
# Windows:      copy .env.example .env
# macOS/Linux:  cp .env.example .env
```

Open `backend/.env` and fill in the values (see **Settings** below). At the very least, set `SECRET_KEY`. You can make one with:

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

Start the backend:

```bash
uvicorn app.main:app --reload
```

It runs at http://127.0.0.1:8000, and the automatic API docs are at http://127.0.0.1:8000/docs. If `DATABASE_URL` is empty, the app uses a local SQLite file, so you don't need to install a database.

### 2. Create the first admin account

In a second terminal, in the `backend` folder with the virtual environment on:

```bash
python create_admin.py
```

It asks for a name, email, phone number (10 digits) and password. The account is verified automatically, so you can log in right away. **Keep this as a script. Never turn it into a web page.**

### 3. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env` from `frontend/.env.example`. The default points to the local backend:

```
VITE_API_URL=http://127.0.0.1:8000
```

```bash
npm run dev
```

Open http://localhost:5173.

---

## Settings (`backend/.env`)

Never commit your real `.env` file. It holds your passwords and keys. Only `.env.example` belongs in Git.

| Setting | What it is |
|---|---|
| `SECRET_KEY` | Long random value that signs login tokens. **Required.** |
| `DATABASE_URL` | Leave empty for local SQLite. For PostgreSQL, paste the connection string. |
| `FRONTEND_URL` | Address of your frontend, no slash at the end. Used in email links. |
| `BACKEND_URL` | Address of your backend, no slash at the end. Used in verification links. |
| `BREVO_API_KEY` | API key from Brevo, used to send emails. |
| `BREVO_SENDER_EMAIL` | A sender address you verified in Brevo. |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cloudinary account details, used to store photos. |
| `SENTRY_DSN` | Optional. Leave empty to turn error tracking off. |

### Services you need to set up

1. **Brevo** (emails): create an account, verify a sender address, and create an API key. Without it, new users can register but cannot receive their verification email, so they cannot log in. Admins made with `create_admin.py` are not affected. Tip: emails sent "from" a free Gmail address can land in spam. For production, send from an address on your own domain and authenticate that domain in Brevo.
2. **Cloudinary** (photos): create a free account and copy your cloud name, API key and API secret. Without it, photo uploads fail.
3. **A PostgreSQL database** (production only): for example Neon. Paste its connection string as `DATABASE_URL`. Tables are created automatically when the backend starts.

---

## Deploying

This project was deployed with the **backend on Render** and the **frontend on Vercel**.

**Backend (Render, Web Service)**

- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Add every setting from the table above under **Environment**.
- Free Render plans put the service to sleep when idle, so the first request can take up to a minute. An uptime monitor that checks every few minutes helps.

**Frontend (Vercel)**

- Root directory: `frontend`
- Add the environment variable `VITE_API_URL` with your backend's public address.

**Important:** open `backend/app/main.py`, find the CORS settings (`allow_origins`), and put **your own frontend address** in the list. Requests from addresses that are not on the list are blocked.

After the first deploy, run `create_admin.py` against your production database, with its `DATABASE_URL` set only in that terminal session. Be careful: it creates the account in whichever database it is connected to.

---

## Running the tests

```bash
cd backend
pip install pytest
python -m pytest -v
```

The tests use a temporary database and a fake email sender, so they never touch your real data and never send real emails. They cover registration, verification, login, the profile page, owner-only editing, the contact and inquiry rules, and a check that public routes never leak an owner's email or phone number.

---

## Security notes

- Never commit `.env`, and never share your API keys.
- Registering and the profile page cannot create admins or change roles. Only an existing admin can change a role, and not their own.
- Sensitive routes (login, register, password reset, verification email, inquiries) are rate limited.
- Photos in `frontend/public/images/` (for example `hero.jpg`) are sample images. Check their license, or replace them with your own, before you publish or sell the project.

## Support

_Add how buyers can reach you, and what your support includes (for example, answering setup questions and fixing reported bugs)._

## License

See the `LICENSE` file. One license covers one end project.