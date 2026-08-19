"""
Seed script — adds cinemas, movies, seats, and showtimes.
Run from the backend/ directory: python seed.py
"""

import requests
from datetime import datetime, timedelta, timezone

BASE = "http://localhost:8000"

# ── Cinemas ──────────────────────────────────────────────────────────────────

new_cinemas = [
    {"name": "Cinema 3 - Uptown",      "location": "789 Uptown Blvd"},
    {"name": "Cinema 4 - Westgate",    "location": "321 West Ave"},
    {"name": "Cinema 5 - Lakeside",    "location": "555 Lakeshore Dr"},
    {"name": "Cinema 6 - Eastpark",    "location": "900 East Park Rd"},
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
    {
        "title": "Spider-Man: Across the Spider-Verse",
        "description": "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
        "duration_minutes": 140,
        "genre": "Animation",
        "poster_url": "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy0Of61Lnj5Xj704m8.jpg",
    },
    {
        "title": "The Shawshank Redemption",
        "description": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        "duration_minutes": 142,
        "genre": "Drama",
        "poster_url": "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    },
    {
        "title": "Interstellar",
        "description": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        "duration_minutes": 169,
        "genre": "Sci-Fi",
        "poster_url": "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    },
    {
        "title": "The Matrix",
        "description": "A computer hacker learns about the true nature of his reality and his role in the war against its controllers.",
        "duration_minutes": 136,
        "genre": "Sci-Fi",
        "poster_url": "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    },
    {
        "title": "Avengers: Endgame",
        "description": "After devastating events wipe out half of all life, the remaining Avengers must do what's necessary to undo Thanos' actions.",
        "duration_minutes": 181,
        "genre": "Action",
        "poster_url": "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    },
    {
        "title": "Spirited Away",
        "description": "During her family's move to the suburbs, a young girl wanders into a world ruled by gods, witches, and spirits.",
        "duration_minutes": 125,
        "genre": "Animation",
        "poster_url": "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    },
    {
        "title": "John Wick: Chapter 4",
        "description": "John Wick uncovers a path to defeating The High Table, but must face a new enemy with powerful alliances across the globe.",
        "duration_minutes": 169,
        "genre": "Action",
        "poster_url": "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VKF5A6TnTkJ.jpg",
    },
    {
        "title": "Everything Everywhere All at Once",
        "description": "An aging Chinese immigrant is swept up in an insane adventure where she alone can save the multiverse.",
        "duration_minutes": 139,
        "genre": "Sci-Fi",
        "poster_url": "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
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

# ── Seats (for all cinemas that don't have seats yet) ─────────────────────────

seat_configs = {
    "Cinema 1 - Downtown":   {"rows": ["A","B","C","D","E"],             "seats_per_row": 8},
    "Cinema 2 - Riverside":  {"rows": ["A","B","C","D","E","F"],         "seats_per_row": 10},
    "Cinema 3 - Uptown":     {"rows": ["A","B","C","D","E","F"],         "seats_per_row": 10},
    "Cinema 4 - Westgate":   {"rows": ["A","B","C","D","E","F","G","H"], "seats_per_row": 12},
    "Cinema 5 - Lakeside":   {"rows": ["A","B","C","D","E","F","G"],     "seats_per_row": 10},
    "Cinema 6 - Eastpark":   {"rows": ["A","B","C","D","E","F","G","H","I","J"], "seats_per_row": 14},
}

for cinema_name, cfg in seat_configs.items():
    if cinema_name not in cinema_ids:
        print(f"  skipping seats for {cinema_name} (cinema not found)")
        continue
    cid = cinema_ids[cinema_name]
    existing_seats = requests.get(f"{BASE}/seats/?cinema_id={cid}").json()
    if existing_seats:
        print(f"  seats exist for {cinema_name} ({len(existing_seats)} seats), skipping")
        continue
    r = requests.post(f"{BASE}/seats/bulk", json={"cinema_id": cid, **cfg})
    r.raise_for_status()
    print(f"  created {len(r.json())} seats for {cinema_name}")

print()

# ── Showtimes ─────────────────────────────────────────────────────────────────

def dt(days_ahead, hour, minute=0):
    d = datetime.now(timezone.utc).replace(hour=hour, minute=minute, second=0, microsecond=0)
    d = d + timedelta(days=days_ahead)
    return d.isoformat()

# cinema_id shorthand
c1 = cinema_ids.get("Cinema 1 - Downtown")
c2 = cinema_ids.get("Cinema 2 - Riverside")
c3 = cinema_ids.get("Cinema 3 - Uptown")
c4 = cinema_ids.get("Cinema 4 - Westgate")
c5 = cinema_ids.get("Cinema 5 - Lakeside")
c6 = cinema_ids.get("Cinema 6 - Eastpark")

# movie_id shorthand
dark_knight   = movie_ids.get("The Dark Knight")
parasite      = movie_ids.get("Parasite")
dune          = movie_ids.get("Dune")
oppenheimer   = movie_ids.get("Oppenheimer")
spiderverse   = movie_ids.get("Spider-Man: Across the Spider-Verse")
shawshank     = movie_ids.get("The Shawshank Redemption")
interstellar  = movie_ids.get("Interstellar")
matrix        = movie_ids.get("The Matrix")
endgame       = movie_ids.get("Avengers: Endgame")
spirited      = movie_ids.get("Spirited Away")
john_wick     = movie_ids.get("John Wick: Chapter 4")
everything    = movie_ids.get("Everything Everywhere All at Once")
inception     = movie_ids.get("Inception")
toy_story     = movie_ids.get("Toy story")
up            = movie_ids.get("Up")

showtimes = [
    # The Dark Knight
    {"movie_id": dark_knight,  "cinema_id": c1, "start_time": dt(1, 12),     "price": "12.50"},
    {"movie_id": dark_knight,  "cinema_id": c2, "start_time": dt(1, 17),     "price": "14.00"},
    {"movie_id": dark_knight,  "cinema_id": c3, "start_time": dt(2, 10),     "price": "13.00"},
    {"movie_id": dark_knight,  "cinema_id": c3, "start_time": dt(2, 20),     "price": "13.00"},
    {"movie_id": dark_knight,  "cinema_id": c4, "start_time": dt(3, 14),     "price": "11.00"},
    {"movie_id": dark_knight,  "cinema_id": c6, "start_time": dt(1, 21),     "price": "15.00"},

    # Parasite
    {"movie_id": parasite,     "cinema_id": c1, "start_time": dt(2, 11),     "price": "12.50"},
    {"movie_id": parasite,     "cinema_id": c2, "start_time": dt(2, 16, 30), "price": "14.00"},
    {"movie_id": parasite,     "cinema_id": c4, "start_time": dt(2, 21),     "price": "11.00"},
    {"movie_id": parasite,     "cinema_id": c3, "start_time": dt(3, 13),     "price": "13.00"},
    {"movie_id": parasite,     "cinema_id": c5, "start_time": dt(1, 19),     "price": "12.00"},

    # Dune
    {"movie_id": dune,         "cinema_id": c2, "start_time": dt(1, 13),     "price": "14.00"},
    {"movie_id": dune,         "cinema_id": c3, "start_time": dt(2, 18),     "price": "13.00"},
    {"movie_id": dune,         "cinema_id": c1, "start_time": dt(3, 10),     "price": "12.50"},
    {"movie_id": dune,         "cinema_id": c4, "start_time": dt(3, 16),     "price": "11.00"},
    {"movie_id": dune,         "cinema_id": c6, "start_time": dt(2, 14),     "price": "15.00"},

    # Oppenheimer
    {"movie_id": oppenheimer,  "cinema_id": c1, "start_time": dt(1, 19),     "price": "12.50"},
    {"movie_id": oppenheimer,  "cinema_id": c2, "start_time": dt(2, 14),     "price": "14.00"},
    {"movie_id": oppenheimer,  "cinema_id": c3, "start_time": dt(3, 11),     "price": "13.00"},
    {"movie_id": oppenheimer,  "cinema_id": c4, "start_time": dt(3, 18),     "price": "11.00"},
    {"movie_id": oppenheimer,  "cinema_id": c5, "start_time": dt(1, 15),     "price": "12.00"},
    {"movie_id": oppenheimer,  "cinema_id": c6, "start_time": dt(2, 19),     "price": "15.00"},

    # Spider-Man: Across the Spider-Verse
    {"movie_id": spiderverse,  "cinema_id": c1, "start_time": dt(1, 10),     "price": "12.50"},
    {"movie_id": spiderverse,  "cinema_id": c2, "start_time": dt(1, 14),     "price": "14.00"},
    {"movie_id": spiderverse,  "cinema_id": c3, "start_time": dt(2, 16),     "price": "13.00"},
    {"movie_id": spiderverse,  "cinema_id": c5, "start_time": dt(2, 11),     "price": "12.00"},
    {"movie_id": spiderverse,  "cinema_id": c6, "start_time": dt(3, 13),     "price": "15.00"},

    # The Shawshank Redemption
    {"movie_id": shawshank,    "cinema_id": c1, "start_time": dt(2, 15),     "price": "12.50"},
    {"movie_id": shawshank,    "cinema_id": c4, "start_time": dt(1, 11),     "price": "11.00"},
    {"movie_id": shawshank,    "cinema_id": c5, "start_time": dt(3, 17),     "price": "12.00"},
    {"movie_id": shawshank,    "cinema_id": c6, "start_time": dt(1, 16),     "price": "15.00"},

    # Interstellar
    {"movie_id": interstellar, "cinema_id": c2, "start_time": dt(1, 11),     "price": "14.00"},
    {"movie_id": interstellar, "cinema_id": c3, "start_time": dt(2, 15),     "price": "13.00"},
    {"movie_id": interstellar, "cinema_id": c4, "start_time": dt(3, 19),     "price": "11.00"},
    {"movie_id": interstellar, "cinema_id": c5, "start_time": dt(1, 20),     "price": "12.00"},
    {"movie_id": interstellar, "cinema_id": c6, "start_time": dt(2, 10),     "price": "15.00"},

    # The Matrix
    {"movie_id": matrix,       "cinema_id": c1, "start_time": dt(1, 14),     "price": "12.50"},
    {"movie_id": matrix,       "cinema_id": c2, "start_time": dt(1, 18),     "price": "14.00"},
    {"movie_id": matrix,       "cinema_id": c3, "start_time": dt(2, 20, 30), "price": "13.00"},
    {"movie_id": matrix,       "cinema_id": c4, "start_time": dt(3, 12),     "price": "11.00"},
    {"movie_id": matrix,       "cinema_id": c6, "start_time": dt(1, 22),     "price": "15.00"},

    # Avengers: Endgame
    {"movie_id": endgame,      "cinema_id": c1, "start_time": dt(1, 16),     "price": "12.50"},
    {"movie_id": endgame,      "cinema_id": c2, "start_time": dt(2, 12),     "price": "14.00"},
    {"movie_id": endgame,      "cinema_id": c4, "start_time": dt(2, 18),     "price": "11.00"},
    {"movie_id": endgame,      "cinema_id": c5, "start_time": dt(3, 14),     "price": "12.00"},
    {"movie_id": endgame,      "cinema_id": c6, "start_time": dt(1, 19),     "price": "15.00"},

    # Spirited Away
    {"movie_id": spirited,     "cinema_id": c1, "start_time": dt(2, 10),     "price": "12.50"},
    {"movie_id": spirited,     "cinema_id": c3, "start_time": dt(1, 15),     "price": "13.00"},
    {"movie_id": spirited,     "cinema_id": c5, "start_time": dt(2, 13),     "price": "12.00"},
    {"movie_id": spirited,     "cinema_id": c6, "start_time": dt(3, 11),     "price": "15.00"},

    # John Wick: Chapter 4
    {"movie_id": john_wick,    "cinema_id": c2, "start_time": dt(1, 20),     "price": "14.00"},
    {"movie_id": john_wick,    "cinema_id": c3, "start_time": dt(2, 22),     "price": "13.00"},
    {"movie_id": john_wick,    "cinema_id": c4, "start_time": dt(3, 20),     "price": "11.00"},
    {"movie_id": john_wick,    "cinema_id": c5, "start_time": dt(1, 17),     "price": "12.00"},
    {"movie_id": john_wick,    "cinema_id": c6, "start_time": dt(2, 21),     "price": "15.00"},

    # Everything Everywhere All at Once
    {"movie_id": everything,   "cinema_id": c1, "start_time": dt(3, 13),     "price": "12.50"},
    {"movie_id": everything,   "cinema_id": c2, "start_time": dt(3, 16),     "price": "14.00"},
    {"movie_id": everything,   "cinema_id": c4, "start_time": dt(1, 15),     "price": "11.00"},
    {"movie_id": everything,   "cinema_id": c5, "start_time": dt(2, 18),     "price": "12.00"},
    {"movie_id": everything,   "cinema_id": c6, "start_time": dt(3, 20),     "price": "15.00"},

    # Inception (already exists)
    {"movie_id": inception,    "cinema_id": c1, "start_time": dt(1, 16, 30), "price": "12.50"},
    {"movie_id": inception,    "cinema_id": c2, "start_time": dt(1, 20),     "price": "14.00"},
    {"movie_id": inception,    "cinema_id": c4, "start_time": dt(2, 13),     "price": "11.00"},
    {"movie_id": inception,    "cinema_id": c5, "start_time": dt(3, 15),     "price": "12.00"},
    {"movie_id": inception,    "cinema_id": c6, "start_time": dt(2, 17),     "price": "15.00"},

    # Toy Story (already exists)
    {"movie_id": toy_story,    "cinema_id": c1, "start_time": dt(2, 10, 30), "price": "10.00"},
    {"movie_id": toy_story,    "cinema_id": c3, "start_time": dt(1, 12),     "price": "11.00"},
    {"movie_id": toy_story,    "cinema_id": c5, "start_time": dt(3, 10),     "price": "10.00"},

    # Up (already exists)
    {"movie_id": up,           "cinema_id": c2, "start_time": dt(2, 11),     "price": "10.00"},
    {"movie_id": up,           "cinema_id": c4, "start_time": dt(1, 13),     "price": "9.50"},
    {"movie_id": up,           "cinema_id": c6, "start_time": dt(3, 15),     "price": "12.00"},
]

# Filter out showtimes with None movie_id or cinema_id
showtimes = [st for st in showtimes if st["movie_id"] is not None and st["cinema_id"] is not None]

created = 0
for st in showtimes:
    r = requests.post(f"{BASE}/showtimes/", json=st)
    if r.status_code in (200, 201):
        created += 1
    else:
        print(f"  WARNING: {r.status_code} — {r.text[:100]}")

print(f"  created {created}/{len(showtimes)} showtimes")
print("\nSeed complete!")
