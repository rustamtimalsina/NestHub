import uuid


def new_user(role="user"):
    n = uuid.uuid4().int
    return {
        "name": "Test User",
        "email": f"test{n}@example.com",
        "phone": str(n)[:10],
        "password": "a-long-password-123",
        "role": role,
    }


def login(client, user, password=None):
    return client.post(
        "/users/login",
        data={
            "username": user["email"],
            "password": password or user["password"],
        },
    )


def verify(client, sent_tokens, user):
    return client.get(
        f"/users/verify?token={sent_tokens[user['email']]}",
        follow_redirects=False,
    )


def test_unverified_user_cannot_login(client, sent_tokens):
    user = new_user()
    assert client.post("/users/", json=user).status_code == 200
    assert login(client, user).status_code == 403


def test_verified_user_can_login(client, sent_tokens):
    user = new_user()
    client.post("/users/", json=user)

    response = verify(client, sent_tokens, user)
    assert "verified=1" in response.headers["location"]

    assert login(client, user).status_code == 200


def test_wrong_password_is_rejected(client, sent_tokens):
    user = new_user()
    client.post("/users/", json=user)
    verify(client, sent_tokens, user)

    assert login(client, user, password="wrong-password").status_code == 401


def test_duplicate_email_is_rejected(client, sent_tokens):
    user = new_user()
    assert client.post("/users/", json=user).status_code == 200

    second = new_user()
    second["email"] = user["email"]
    assert client.post("/users/", json=second).status_code == 400


def test_register_cannot_create_admin(client, sent_tokens):
    user = new_user(role="admin")
    client.post("/users/", json=user)
    verify(client, sent_tokens, user)

    token = login(client, user).json()["access_token"]
    me = client.get("/users/me", headers={"Authorization": f"Bearer {token}"})

    assert me.json()["role"] == "user"