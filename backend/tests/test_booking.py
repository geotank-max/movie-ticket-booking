from tests.test_auth import register_and_login


def setup_movie_showtime_seats(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}

    movie = client.post("/movies/", json={
        "title": "Test Film", "duration_minutes": 100
    }, headers=headers).json()

    cinema = client.post("/cinemas/", json={
        "name": "Test Cinema"
    }, headers=headers).json()

    client.post("/seats/bulk", json={
        "cinema_id": cinema["id"], "rows": ["A"], "seats_per_row": 3
    }, headers=headers)

    showtime = client.post("/showtimes/", json={
        "movie_id": movie["id"],
        "cinema_id": cinema["id"],
        "start_time": "2026-12-25T19:00:00",
        "price": "10.00",
    }, headers=headers).json()

    seats = client.get(f"/seats/?cinema_id={cinema['id']}", headers=headers).json()

    return showtime, seats


def make_admin(client, db_session, email="admin@test.com"):
    from app.models.user import User
    token = register_and_login(client, email=email, password="adminpass123")
    user = db_session.query(User).filter(User.email == email).first()
    user.is_admin = True
    db_session.commit()
    # re-login to get a fresh check (though token itself doesn't encode is_admin, so no need to re-login here)
    return token


def test_successful_booking(client, db_session):
    admin_token = make_admin(client, db_session)
    showtime, seats = setup_movie_showtime_seats(client, admin_token)

    user_token = register_and_login(client, email="customer@test.com")
    response = client.post(
        "/bookings/",
        json={"showtime_id": showtime["id"], "seat_ids": [seats[0]["id"]]},
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert response.status_code == 201
    assert response.json()["seat_ids"] == [seats[0]["id"]]


def test_cannot_double_book_same_seat(client, db_session):
    admin_token = make_admin(client, db_session)
    showtime, seats = setup_movie_showtime_seats(client, admin_token)
    seat_id = seats[0]["id"]

    alice_token = register_and_login(client, email="alice@test.com")
    bob_token = register_and_login(client, email="bob@test.com")

    # Alice books the seat first
    first_response = client.post(
        "/bookings/",
        json={"showtime_id": showtime["id"], "seat_ids": [seat_id]},
        headers={"Authorization": f"Bearer {alice_token}"},
    )
    assert first_response.status_code == 201

    # Bob tries to book the SAME seat for the SAME showtime
    second_response = client.post(
        "/bookings/",
        json={"showtime_id": showtime["id"], "seat_ids": [seat_id]},
        headers={"Authorization": f"Bearer {bob_token}"},
    )
    assert second_response.status_code == 409


def test_cannot_book_zero_seats(client, db_session):
    admin_token = make_admin(client, db_session)
    showtime, seats = setup_movie_showtime_seats(client, admin_token)

    user_token = register_and_login(client, email="empty@test.com")
    response = client.post(
        "/bookings/",
        json={"showtime_id": showtime["id"], "seat_ids": []},
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert response.status_code == 400


def test_user_cannot_see_others_bookings(client, db_session):
    admin_token = make_admin(client, db_session)
    showtime, seats = setup_movie_showtime_seats(client, admin_token)

    alice_token = register_and_login(client, email="alice2@test.com")
    booking = client.post(
        "/bookings/",
        json={"showtime_id": showtime["id"], "seat_ids": [seats[0]["id"]]},
        headers={"Authorization": f"Bearer {alice_token}"},
    ).json()

    bob_token = register_and_login(client, email="bob2@test.com")
    response = client.get(
        f"/bookings/{booking['id']}",
        headers={"Authorization": f"Bearer {bob_token}"},
    )
    assert response.status_code == 404