import cloudinary
import cloudinary.uploader
from app.config import config

cloudinary.config(
    cloud_name=config.CLOUD_NAME,
    api_key=config.CLOUD_API_KEY,
    api_secret=config.CLOUD_API_SECRET,
    secure=True
)

def upload_file(file):
    response = cloudinary.uploader.upload(
        file,
        resource_type="raw"
    )
    return response["secure_url"]
