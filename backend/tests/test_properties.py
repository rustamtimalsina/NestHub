import uuid

from app.routers import properties as properties_module


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


def listing_body(title="Test House"):
    return {
        "title": title,
        "description": "A test listing with enough text.",
        "city": "Lalitpur",
        "price": 1000000,
        "bedrooms": 2,
        "bathrooms": 1,
        "area": 900,
        "property_type": "House",
        "status": "Available",
        "image": "test.jpg",
    }


def create_listing(client, headers, title="Test House"):
    client.post("/properties/", json=listing_body(title), headers=headers)
    mine = client.get("/properties/me", headers=headers).json()
    return max(item["id"] for item in mine)


def test_public_routes_never_leak_owner_contact(client, sent_tokens):
    owner, headers = make_user(client, sent_tokens)
    first = create_listing(client, headers, "Test House One")
    create_listing(client, headers, "Test House Two")

    public_routes = [
        "/properties/?page=1&limit=50&sort=newest",
        "/properties/recent",
        "/properties/search?keyword=Test",
        f"/properties/{first}",
        f"/properties/public/{first}",
        f"/properties/{first}/similar",
    ]

    for route in public_routes:
        response = client.get(route)
        assert response.status_code == 200, route
        assert owner["email"] not in response.text, route
        assert owner["phone"] not in response.text, route


def test_contact_requires_login(client, sent_tokens):
    owner, owner_headers = make_user(client, sent_tokens)
    listing_id = create_listing(client, owner_headers)

    assert client.get(f"/properties/{listing_id}/contact").status_code == 401

    visitor, visitor_headers = make_user(client, sent_tokens)
    response = client.get(
        f"/properties/{listing_id}/contact", headers=visitor_headers
    )

    assert response.status_code == 200
    assert response.json()["owner_phone"] == owner["phone"]


def test_only_the_owner_can_edit_a_listing(client, sent_tokens):
    owner, owner_headers = make_user(client, sent_tokens)
    listing_id = create_listing(client, owner_headers)

    other, other_headers = make_user(client, sent_tokens)
    response = client.put(
        f"/properties/{listing_id}",
        json=listing_body("Hacked title"),
        headers=other_headers,
    )

    assert response.status_code == 403


def test_inquiry_rules(client, sent_tokens, monkeypatch):
    sent = []

    async def fake_inquiry(*args):
        sent.append(args)

    monkeypatch.setattr(properties_module, "send_inquiry_email", fake_inquiry)

    owner, owner_headers = make_user(client, sent_tokens)
    listing_id = create_listing(client, owner_headers)
    message = {"message": "Hello, is this still available?"}
    url = f"/properties/{listing_id}/inquiry"

    # Not logged in
    assert client.post(url, json=message).status_code == 401

    # The owner cannot message themselves
    assert client.post(url, json=message, headers=owner_headers).status_code == 400

    # A visitor can, and exactly one email is sent
    visitor, visitor_headers = make_user(client, sent_tokens)
    assert client.post(url, json=message, headers=visitor_headers).status_code == 200
    assert len(sent) == 1


def test_appointment_booking(client, sent_tokens, monkeypatch):
    appointments_sent = []

    async def fake_appointment(*args, **kwargs):
        appointments_sent.append((args, kwargs))

    monkeypatch.setattr(properties_module, 'send_appointment_email', fake_appointment)
    monkeypatch.setattr(properties_module, 'send_appointment_confirmation_to_buyer', fake_appointment)

    owner, owner_headers = make_user(client, sent_tokens)
    listing_id = create_listing(client, owner_headers)

    url = f'/properties/{listing_id}/appointment'
    body = {
        'tour_type': 'in-person',
        'date': '2026-11-01',
        'time_slot': '10:00 AM - 11:00 AM',
        'phone': '+9779800000000',
        'note': 'Looking forward to seeing the house',
    }

    # Unauthorized
    assert client.post(url, json=body).status_code == 401

    # Authorized visitor
    visitor, visitor_headers = make_user(client, sent_tokens)
    res = client.post(url, json=body, headers=visitor_headers)
    assert res.status_code == 200
    assert 'Private tour request sent' in res.json()['message']
    assert len(appointments_sent) >= 1
