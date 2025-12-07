import uuid
from supabase import create_client, Client
from app.config import config

SUPABASE_URL = config.SUPABASE_URL
SUPABASE_KEY = config.SUPABASE_KEY

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase URL and Key must be configured in environment variables")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def upload_file_to_supabase(file):
    """
    Upload a file to Supabase storage
    
    Args:
        file: File object from Flask request
        
    Returns:
        str: Public URL of the uploaded file
        
    Raises:
        ValueError: If file is invalid
        Exception: If upload fails
    """
    if not file:
        raise ValueError("File object is required")
    
    if not file.filename:
        raise ValueError("File must have a filename")
    
    try:
        file_bytes = file.read()
        
        if not file_bytes:
            raise ValueError("File is empty")
        
        extension = file.filename.split('.')[-1].lower()
        
        if not extension:
            raise ValueError("File must have an extension")
        
        file_name = f"{uuid.uuid4()}.{extension}"
        
        # Determine MIME type
        mime_type = "application/pdf" if extension == "pdf" else "application/octet-stream"
        
        # Upload to Supabase
        response = supabase.storage.from_(config.SUPABASE_BUCKET).upload(
            file_name,
            file_bytes,
            file_options={
                "content-type": mime_type,
                "upsert": False
            }
        )
        
        # Check if upload was successful
        if not response:
            raise Exception("Upload response was empty")
        
        # Construct public URL
        public_url = f"{SUPABASE_URL}/storage/v1/object/public/{config.SUPABASE_BUCKET}/{file_name}"
        
        return public_url
        
    except Exception as e:
        # Re-raise with more context
        raise Exception(f"Failed to upload file to Supabase: {str(e)}")
