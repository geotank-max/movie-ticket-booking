def test_list_movies_empty(client):
    response = client.get("/movies/")
    assert response.status_code == 200
    assert response.json() == []


def test_create_movie_requires_admin(client):
    response = client.post("/movies/", json={
        "title": "Test Movie",
        "duration_minutes": 120,
    })
    # no auth token provided at all
    assert response.status_code == 401


def test_get_nonexistent_movie_returns_404(client):
    response = client.get("/movies/9999")
    assert response.status_code == 404