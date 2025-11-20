import uuid
from supabase import create_client, Client
from app.config import config

SUPABASE_URL = config.SUPABASE_URL
SUPABASE_KEY = config.SUPABASE_KEY

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def upload_file_to_supabase(file):
    file_bytes = file.read()
    extension = file.filename.split('.')[-1].lower()

    file_name = f"{uuid.uuid4()}.{extension}"

    mime_type = "application/pdf" if extension == "pdf" else "application/octet-stream"

    supabase.storage.from_("books").upload(
        file_name,
        file_bytes,
        file_options={
            "content-type": mime_type,
            "upsert": False
        }
    )

    public_url = f"{SUPABASE_URL}/storage/v1/object/public/books/{file_name}"
    return public_url
