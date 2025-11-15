import os
from dotenv import load_dotenv

load_dotenv()

class config:
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY")
    MONGO_URI = os.getenv("MONGODB_URI")
    CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
    CLOUD_API_KEY = os.getenv("CLOUDINARY_API_KEY")
    CLOUD_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")
