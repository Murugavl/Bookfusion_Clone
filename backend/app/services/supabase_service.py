from supabase import create_client, Client
from app.config import config
import uuid

supabase: Client = create_client(config.SUPABASE_URL, config.SUPABASE_KEY)

def upload_file_to_supabase(file):
    # generate a unique file name
    file_extension = file.filename.split(".")[-1]
    unique_name = f"{uuid.uuid4()}.{file_extension}"

    # upload file to "books" bucket
    file_bytes = file.read()
    res = supabase.storage.from_("books").upload(unique_name, file_bytes)

    if res.get("error"):
        raise Exception(res["error"]["message"])

    # return public URL
    return supabase.storage.from_("books").get_public_url(unique_name)
