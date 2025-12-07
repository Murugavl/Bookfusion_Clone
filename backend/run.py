import os
from app import create_app
from app.config import config

app = create_app()

if __name__ == "__main__":
    # Validate configuration on startup
    try:
        config.validate()
    except ValueError as e:
        print(f"Configuration Error: {e}")
        exit(1)
    
    # Get debug mode from environment variable, default to False in production
    debug_mode = os.getenv("FLASK_DEBUG", "False").lower() == "true"
    port = int(os.getenv("FLASK_PORT", 5000))
    host = os.getenv("FLASK_HOST", "127.0.0.1")
    
    app.run(debug=debug_mode, host=host, port=port)
