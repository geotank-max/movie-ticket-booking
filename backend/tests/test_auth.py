def register_and_login(client, email="test@example.com", password="testpass123"):
    client.post("/auth/register", json={"email": email, "password": password})
    login_response = client.post("/auth/login", data={"username": email, "password": password})
    return login_response.json()["access_token"]


def test_register_creates_user(client):
    response = client.post("/auth/register", json={
        "email": "alice@test.com",
        "password": "securepass123",
    })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "alice@test.com"
    assert "hashed_password" not in data  # never leak this


def test_cannot_register_duplicate_email(client):
    client.post("/auth/register", json={"email": "bob@test.com", "password": "pass12345"})
    response = client.post("/auth/register", json={"email": "bob@test.com", "password": "differentpass"})
    assert response.status_code == 400


def test_login_wrong_password_fails(client):
    client.post("/auth/register", json={"email": "carol@test.com", "password": "correctpass"})
    response = client.post("/auth/login", data={"username": "carol@test.com", "password": "wrongpass"})
    assert response.status_code == 401


def test_me_endpoint_with_valid_token(client):
    token = register_and_login(client, email="dave@test.com")
    response = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["email"] == "dave@test.com"


def test_me_endpoint_without_token_fails(client):
    response = client.get("/auth/me")
    assert response.status_code == 401