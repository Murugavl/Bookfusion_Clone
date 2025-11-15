from flask import Flask
from flask_cors import CORS
from .config import config
from .models.db import mongo

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config['SECRET_KEY'] = config.SECRET_KEY
    app.config["MONGO_URI"] = config.MONGO_URI

    mongo.init_app(app)

    from .routes.books import books_bp
    app.register_blueprint(books_bp, url_prefix="/api/books")

    return app
