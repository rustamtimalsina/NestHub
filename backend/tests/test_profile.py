import uuid


def make_user(client, sent_tokens):
    n = uuid.uuid4().int
    user = {
        "name": "Test User",
        "email": f"test{n}@example.com",
        "phone": str(n)[:10],
        "password": "a-long-password-123",
        "role": "user",
    }
    client.post("/users/", json=user)
    client.get(
        f"/users/verify?token={sent_tokens[user['email']]}",
        follow_redirects=False,
    )
    response = client.post(
        "/users/login",
        data={"username": user["email"], "password": user["password"]},
    )
    token = response.json()["access_token"]
    return user, {"Authorization": f"Bearer {token}"}


def test_profile_update_requires_login(client):
    response = client.put(
        "/users/me", json={"name": "New Name", "phone": "9800000001"}
    )
    assert response.status_code == 401


def test_user_can_update_name_and_phone(client, sent_tokens):
    user, headers = make_user(client, sent_tokens)
    new_phone = str(uuid.uuid4().int)[:10]

    response = client.put(
        "/users/me",
        json={"name": "Changed Name", "phone": new_phone},
        headers=headers,
    )
    assert response.status_code == 200

    me = client.get("/users/me", headers=headers).json()
    assert me["name"] == "Changed Name"
    assert me["phone"] == new_phone
    assert me["email"] == user["email"]


def test_profile_rejects_bad_input(client, sent_tokens):
    user, headers = make_user(client, sent_tokens)

    short_name = client.put(
        "/users/me",
        json={"name": "ab", "phone": "9800000002"},
        headers=headers,
    )
    assert short_name.status_code == 400

    bad_phone = client.put(
        "/users/me",
        json={"name": "Valid Name", "phone": "12345"},
        headers=headers,
    )
    assert bad_phone.status_code == 400


def test_cannot_take_another_users_phone(client, sent_tokens):
    first, first_headers = make_user(client, sent_tokens)
    second, second_headers = make_user(client, sent_tokens)

    response = client.put(
        "/users/me",
        json={"name": "Second User", "phone": first["phone"]},
        headers=second_headers,
    )
    assert response.status_code == 400


def test_profile_update_cannot_change_role_or_email(client, sent_tokens):
    user, headers = make_user(client, sent_tokens)

    client.put(
        "/users/me",
        json={
            "name": "Sneaky User",
            "phone": str(uuid.uuid4().int)[:10],
            "role": "admin",
            "email": "someone-else@example.com",
        },
        headers=headers,
    )

    me = client.get("/users/me", headers=headers).json()
    assert me["role"] == "user"
    assert me["email"] == user["email"]