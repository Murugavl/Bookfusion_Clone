import os
from dotenv import load_dotenv

load_dotenv()

class config:
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY")
    MONGO_URI = os.getenv("MONGODB_URI")
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY")    
    SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
    SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET", "books")
    
    @classmethod
    def validate(cls):
        """Validate that all required configuration variables are set"""
        required_vars = {
            "SECRET_KEY": cls.SECRET_KEY,
            "MONGO_URI": cls.MONGO_URI,
            "SUPABASE_URL": cls.SUPABASE_URL,
            "SUPABASE_KEY": cls.SUPABASE_KEY
        }
        
        missing_vars = [var for var, value in required_vars.items() if not value]
        
        if missing_vars:
            raise ValueError(
                f"Missing required environment variables: {', '.join(missing_vars)}. "
                "Please check your .env file."
            )
        
        return True


