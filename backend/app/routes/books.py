from flask import Blueprint, request, jsonify
from app.services.cloudinary_service import upload_file
from app.models.db import mongo

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

@books_bp.post("/upload")
def upload_book():
    title = request.form.get("title")
    file = request.files.get("file")

    if not file:
        return jsonify({"error": "No file provided"}), 400

    file_url = upload_file(file)

    mongo.db.books.insert_one({
        "title": title,
        "file_url": file_url
    })

    return jsonify({"message": "Uploaded", "file_url": file_url})


@books_bp.route("/all", methods=["GET"])
def get_all_books():
    books = list(mongo.db.books.find({}, {"_id": 0}))
    return jsonify(books)
