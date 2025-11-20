import os
from dotenv import load_dotenv

load_dotenv()

class config:
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY")
    MONGO_URI = os.getenv("MONGODB_URI")
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY")

