import os
from dotenv import load_dotenv

# Load .env first (default config)
load_dotenv()

# Load .env.local if it exists (overrides for local development)
load_dotenv('.env.local', override=True)

DATABASE_URL = os.getenv("DATABASE_URL")