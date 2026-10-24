from tests.test_properties import make_user, create_listing


def test_favorites_and_filters(client, sent_tokens):
    user, headers = make_user(client, sent_tokens)
    prop_id = create_listing(client, headers, "Luxury Penthouse")

    # Add favorite
    res = client.post(f"/favorites/{prop_id}", headers=headers)
    assert res.status_code == 200
    assert res.json()["message"] == "Property added to favorites."

    # Duplicate favorite does not crash (ON CONFLICT test)
    res_dup = client.post(f"/favorites/{prop_id}", headers=headers)
    assert res_dup.status_code == 200

    # Check favorite
    res_check = client.get(f"/favorites/check/{prop_id}", headers=headers)
    assert res_check.status_code == 200
    assert res_check.json()["is_favorite"] is True

    # Get favorites list
    res_list = client.get("/favorites/", headers=headers)
    assert res_list.status_code == 200
    assert len(res_list.json()["favorites"]) == 1
    assert res_list.json()["favorites"][0]["id"] == prop_id

    # Test filtering by city and price
    res_filter = client.get(
        "/properties/?city=Lalitpur&min_price=500000&max_price=2000000"
    )
    assert res_filter.status_code == 200
    data = res_filter.json()
    assert data["total"] >= 1
    assert any(p["id"] == prop_id for p in data["properties"])

    # Remove favorite
    res_del = client.delete(f"/favorites/{prop_id}", headers=headers)
    assert res_del.status_code == 200
    res_check2 = client.get(f"/favorites/check/{prop_id}", headers=headers)
    assert res_check2.json()["is_favorite"] is False
