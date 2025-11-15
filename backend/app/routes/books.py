from flask import Blueprint, request, jsonify

books_bp = Blueprint("books", __name__)

@books_bp.get("/")
def get_books():
    return jsonify({"message": "Books API working"})
