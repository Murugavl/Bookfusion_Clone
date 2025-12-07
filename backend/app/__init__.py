from flask import Flask, jsonify
from flask_cors import CORS
from .config import config
from .models.db import mongo

def create_app():
    # Validate configuration
    try:
        config.validate()
    except ValueError as e:
        print(f"Warning: Configuration validation failed: {e}")
        # In production, you might want to raise this instead
    
    app = Flask(__name__)
    
    # Configure CORS - allow all origins for development
    # In production, specify allowed origins
    CORS(app, supports_credentials=True, resources={
        r"/api/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    app.config['SECRET_KEY'] = config.SECRET_KEY
    app.config['MONGO_URI'] = config.MONGO_URI

    # Initialize MongoDB
    mongo.init_app(app)

    # Register blueprints
    from .routes.books import books_bp
    app.register_blueprint(books_bp, url_prefix="/api/books")

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Endpoint not found"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Internal server error"}), 500

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({"error": "Bad request"}), 400

    return app
