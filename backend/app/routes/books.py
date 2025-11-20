from flask import Blueprint, request, jsonify
from app.models.db import mongo
from app.services.supabase_service import upload_file_to_supabase

books_bp = Blueprint("books", __name__)

@books_bp.get("/")
def get_books():
    books = mongo.db.books.find()
    output = []
    for b in books:
        output.append({
            "id": str(b["_id"]),
            "title": b["title"],
            "file_url": b["file_url"]
        })
    return jsonify(output)

@books_bp.route("/upload", methods=["POST"])
def upload_book():
    title = request.form.get("title")
    file = request.files.get("file")

    if not file:
        return jsonify({"error": "No file provided"}), 400

    file_url = upload_file_to_supabase(file)

    mongo.db.books.insert_one({
        "title": title,
        "file_url": file_url
    })

    return jsonify({"message": "Uploaded", "file_url": file_url})


@books_bp.route("/all", methods=["GET"])
def get_all_books():
    books = mongo.db.books.find()
    output = []
    for b in books:
        output.append({
            "_id": str(b["_id"]),
            "title": b["title"],
            "file_url": b["file_url"]
        })
    return jsonify(output)


