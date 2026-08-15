"""
Seed script — adds cinemas, movies, seats, and showtimes.
Run from the backend/ directory: python seed.py
"""

import requests
from datetime import datetime, timedelta, timezone

BASE = "http://localhost:8000"

# ── Cinemas ──────────────────────────────────────────────────────────────────

new_cinemas = [
    {"name": "Cinema 3 - Uptown",   "location": "789 Uptown Blvd"},
    {"name": "Cinema 4 - Westgate", "location": "321 West Ave"},
]

cinema_ids = {}
existing = {c["name"]: c["id"] for c in requests.get(f"{BASE}/cinemas/").json()}

for c in new_cinemas:
    if c["name"] in existing:
        cinema_ids[c["name"]] = existing[c["name"]]
        print(f"  cinema exists: {c['name']} (id={cinema_ids[c['name']]})")
    else:
        r = requests.post(f"{BASE}/cinemas/", json=c)
        r.raise_for_status()
        cinema_ids[c["name"]] = r.json()["id"]
        print(f"  created cinema: {c['name']} (id={cinema_ids[c['name']]})")

# Also capture existing cinemas
for name, cid in existing.items():
    if name not in cinema_ids:
        cinema_ids[name] = cid

print(f"\nAll cinema IDs: {cinema_ids}\n")

# ── Movies ────────────────────────────────────────────────────────────────────

new_movies = [
    {
        "title": "The Dark Knight",
        "description": "Batman raises the stakes in his war on crime with the help of Lieutenant Jim Gordon and District Attorney Harvey Dent.",
        "duration_minutes": 152,
        "genre": "Action",
        "poster_url": "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    },
    {
        "title": "Parasite",
        "description": "A poor family schemes to become employed by a wealthy family by infiltrating their household and posing as unrelated workers.",
        "duration_minutes": 132,
        "genre": "Thriller",
        "poster_url": "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    },
    {
        "title": "Dune",
        "description": "A noble family becomes embroiled in a war for control over the galaxy's most valuable and dangerous asset.",
        "duration_minutes": 155,
        "genre": "Sci-Fi",
        "poster_url": "https://image.tmdb.org/t/p/w500/d5NXSklpcvwqxynbqKyygaAoYcR.jpg",
    },
    {
        "title": "Oppenheimer",
        "description": "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
        "duration_minutes": 180,
        "genre": "Drama",
        "poster_url": "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    },
]

movie_ids = {}
existing_movies = {m["title"]: m["id"] for m in requests.get(f"{BASE}/movies/").json()}

for m in new_movies:
    if m["title"] in existing_movies:
        movie_ids[m["title"]] = existing_movies[m["title"]]
        print(f"  movie exists: {m['title']} (id={movie_ids[m['title']]})")
    else:
        r = requests.post(f"{BASE}/movies/", json=m)
        r.raise_for_status()
        movie_ids[m["title"]] = r.json()["id"]
        print(f"  created movie: {m['title']} (id={movie_ids[m['title']]})")

for title, mid in existing_movies.items():
    if title not in movie_ids:
        movie_ids[title] = mid

print(f"\nAll movie IDs: {movie_ids}\n")

# ── Seats (only for new cinemas that have no seats yet) ───────────────────────

seat_configs = {
    "Cinema 3 - Uptown":   {"rows": ["A","B","C","D","E","F"],      "seats_per_row": 10},
    "Cinema 4 - Westgate": {"rows": ["A","B","C","D","E","F","G","H"], "seats_per_row": 12},
}

for cinema_name, cfg in seat_configs.items():
    cid = cinema_ids[cinema_name]
    existing_seats = requests.get(f"{BASE}/seats/?cinema_id={cid}").json()
    if existing_seats:
        print(f"  seats exist for {cinema_name}, skipping")
        continue
    r = requests.post(f"{BASE}/seats/bulk", json={"cinema_id": cid, **cfg})
    r.raise_for_status()
    print(f"  created {len(r.json())} seats for {cinema_name}")

print()

# ── Showtimes ─────────────────────────────────────────────────────────────────
# Base date: tomorrow at various times, spread over 3 days

def dt(days_ahead, hour, minute=0):
    d = datetime.now(timezone.utc).replace(hour=hour, minute=minute, second=0, microsecond=0)
    d = d + timedelta(days=days_ahead)
    return d.isoformat()

# cinema_id shorthand
c1 = cinema_ids.get("Cinema 1 - Downtown", 3)
c2 = cinema_ids.get("Cinema 2 - Riverside", 2)
c3 = cinema_ids["Cinema 3 - Uptown"]
c4 = cinema_ids["Cinema 4 - Westgate"]

# movie_id shorthand
matrix      = movie_ids["The Matrix"]
inception   = movie_ids["Inception"]
interstellar= movie_ids["Interstellar"]
dark_knight = movie_ids["The Dark Knight"]
parasite    = movie_ids["Parasite"]
dune        = movie_ids["Dune"]
oppenheimer = movie_ids["Oppenheimer"]

showtimes = [
    # The Matrix
    {"movie_id": matrix,       "cinema_id": c1, "start_time": dt(1, 10),     "price": "12.50"},
    {"movie_id": matrix,       "cinema_id": c1, "start_time": dt(1, 14),     "price": "12.50"},
    {"movie_id": matrix,       "cinema_id": c2, "start_time": dt(1, 18),     "price": "14.00"},
    {"movie_id": matrix,       "cinema_id": c3, "start_time": dt(2, 20, 30), "price": "13.00"},

    # Inception
    {"movie_id": inception,    "cinema_id": c1, "start_time": dt(1, 16),     "price": "12.50"},
    {"movie_id": inception,    "cinema_id": c2, "start_time": dt(1, 20),     "price": "14.00"},
    {"movie_id": inception,    "cinema_id": c4, "start_time": dt(2, 13),     "price": "11.00"},
    {"movie_id": inception,    "cinema_id": c4, "start_time": dt(3, 17),     "price": "11.00"},

    # Interstellar
    {"movie_id": interstellar, "cinema_id": c2, "start_time": dt(1, 11),     "price": "14.00"},
    {"movie_id": interstellar, "cinema_id": c3, "start_time": dt(2, 15),     "price": "13.00"},
    {"movie_id": interstellar, "cinema_id": c4, "start_time": dt(3, 19),     "price": "11.00"},

    # The Dark Knight
    {"movie_id": dark_knight,  "cinema_id": c1, "start_time": dt(1, 12),     "price": "12.50"},
    {"movie_id": dark_knight,  "cinema_id": c2, "start_time": dt(1, 17),     "price": "14.00"},
    {"movie_id": dark_knight,  "cinema_id": c3, "start_time": dt(2, 10),     "price": "13.00"},
    {"movie_id": dark_knight,  "cinema_id": c3, "start_time": dt(2, 20),     "price": "13.00"},
    {"movie_id": dark_knight,  "cinema_id": c4, "start_time": dt(3, 14),     "price": "11.00"},

    # Parasite
    {"movie_id": parasite,     "cinema_id": c1, "start_time": dt(2, 11),     "price": "12.50"},
    {"movie_id": parasite,     "cinema_id": c2, "start_time": dt(2, 16, 30), "price": "14.00"},
    {"movie_id": parasite,     "cinema_id": c4, "start_time": dt(2, 21),     "price": "11.00"},
    {"movie_id": parasite,     "cinema_id": c3, "start_time": dt(3, 13),     "price": "13.00"},

    # Dune
    {"movie_id": dune,         "cinema_id": c2, "start_time": dt(1, 13),     "price": "14.00"},
    {"movie_id": dune,         "cinema_id": c3, "start_time": dt(2, 18),     "price": "13.00"},
    {"movie_id": dune,         "cinema_id": c1, "start_time": dt(3, 10),     "price": "12.50"},
    {"movie_id": dune,         "cinema_id": c4, "start_time": dt(3, 16),     "price": "11.00"},

    # Oppenheimer
    {"movie_id": oppenheimer,  "cinema_id": c1, "start_time": dt(1, 19),     "price": "12.50"},
    {"movie_id": oppenheimer,  "cinema_id": c2, "start_time": dt(2, 14),     "price": "14.00"},
    {"movie_id": oppenheimer,  "cinema_id": c3, "start_time": dt(3, 11),     "price": "13.00"},
    {"movie_id": oppenheimer,  "cinema_id": c4, "start_time": dt(3, 18),     "price": "11.00"},
]

created = 0
for st in showtimes:
    r = requests.post(f"{BASE}/showtimes/", json=st)
    if r.status_code == 201:
        created += 1
    else:
        print(f"  WARNING: {r.status_code} — {r.text}")

print(f"  created {created}/{len(showtimes)} showtimes")
print("\nSeed complete!")
