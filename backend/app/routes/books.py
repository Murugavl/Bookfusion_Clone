from flask import Blueprint, request, jsonify
from bson import ObjectId
from bson.errors import InvalidId
from app.models.db import mongo
from app.services.supabase_service import upload_file_to_supabase

books_bp = Blueprint("books", __name__)

# Maximum file size: 50MB
MAX_FILE_SIZE = 50 * 1024 * 1024

def serialize_book(book, use_id_field=False):
    """Helper function to serialize book document"""
    book_dict = {
        "title": book.get("title", ""),
        "file_url": book.get("file_url", ""),
        "cover_url": book.get("cover_url", ""),
        "author": book.get("author", ""),
        "status": book.get("status", "All"),
        "reading_progress": book.get("reading_progress", 0),
        "last_read_page": book.get("last_read_page", 0),
        "notes": book.get("notes", []),
        "highlights": book.get("highlights", [])
    }
    if use_id_field:
        book_dict["id"] = str(book["_id"])
    else:
        book_dict["_id"] = str(book["_id"])
    return book_dict

@books_bp.route("/", methods=["GET"])
def get_books():
    """Get all books - returns with 'id' field"""
    try:
        books = mongo.db.books.find()
        output = [serialize_book(b, use_id_field=True) for b in books]
        return jsonify(output), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch books", "details": str(e)}), 500

@books_bp.route("/all", methods=["GET"])
def get_all_books():
    """Get all books - returns with '_id' field (for backward compatibility)"""
    try:
        books = mongo.db.books.find()
        output = [serialize_book(b, use_id_field=False) for b in books]
        return jsonify(output), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch books", "details": str(e)}), 500

@books_bp.route("/<book_id>", methods=["GET"])
def get_book_by_id(book_id):
    """Get a single book by ID"""
    try:
        # Validate ObjectId format
        if not ObjectId.is_valid(book_id):
            return jsonify({"error": "Invalid book ID format"}), 400
        
        book = mongo.db.books.find_one({"_id": ObjectId(book_id)})
        
        if not book:
            return jsonify({"error": "Book not found"}), 404
        
        return jsonify(serialize_book(book, use_id_field=False)), 200
    except InvalidId:
        return jsonify({"error": "Invalid book ID format"}), 400
    except Exception as e:
        return jsonify({"error": "Failed to fetch book", "details": str(e)}), 500

@books_bp.route("/upload", methods=["POST"])
def upload_book():
    """Upload a new book"""
    try:
        # Validate title
        title = request.form.get("title", "").strip()
        if not title:
            return jsonify({"error": "Title is required"}), 400
        
        # Validate file
        file = request.files.get("file")
        if not file:
            return jsonify({"error": "No file provided"}), 400
        
        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400
        
        # Validate file type
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({"error": "Only PDF files are allowed"}), 400
        
        # Validate file size
        file.seek(0, 2)  # Seek to end
        file_size = file.tell()
        file.seek(0)  # Reset to beginning
        
        if file_size > MAX_FILE_SIZE:
            return jsonify({
                "error": f"File size exceeds maximum allowed size of {MAX_FILE_SIZE / (1024 * 1024)}MB"
            }), 400
        
        if file_size == 0:
            return jsonify({"error": "File is empty"}), 400
        
        # Upload file to Supabase
        try:
            file_url = upload_file_to_supabase(file)
        except Exception as e:
            return jsonify({
                "error": "Failed to upload file to storage",
                "details": str(e)
            }), 500
        
        # Save book to database
        try:
            result = mongo.db.books.insert_one({
                "title": title,
                "file_url": file_url,
                "cover_url": "",
                "author": "",
                "status": "All",
                "reading_progress": 0,
                "last_read_page": 0,
                "notes": [],
                "highlights": []
            })
            
            return jsonify({
                "message": "Book uploaded successfully",
                "file_url": file_url,
                "id": str(result.inserted_id)
            }), 201
        except Exception as e:
            return jsonify({
                "error": "Failed to save book to database",
                "details": str(e)
            }), 500
            
    except Exception as e:
        return jsonify({
            "error": "An unexpected error occurred",
            "details": str(e)
        }), 500

@books_bp.route("/<book_id>", methods=["PATCH", "PUT"])
def update_book(book_id):
    """Update a book by ID"""
    try:
        if not ObjectId.is_valid(book_id):
            return jsonify({"error": "Invalid book ID format"}), 400
        
        data = request.get_json()
        update_data = {}
        
        allowed_fields = ["title", "cover_url", "author", "status", "reading_progress", 
                         "last_read_page", "notes", "highlights"]
        
        for field in allowed_fields:
            if field in data:
                update_data[field] = data[field]
        
        if not update_data:
            return jsonify({"error": "No valid fields to update"}), 400
        
        result = mongo.db.books.update_one(
            {"_id": ObjectId(book_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({"error": "Book not found"}), 404
        
        updated_book = mongo.db.books.find_one({"_id": ObjectId(book_id)})
        return jsonify(serialize_book(updated_book, use_id_field=False)), 200
        
    except InvalidId:
        return jsonify({"error": "Invalid book ID format"}), 400
    except Exception as e:
        return jsonify({"error": "Failed to update book", "details": str(e)}), 500

@books_bp.route("/<book_id>/progress", methods=["POST"])
def update_reading_progress(book_id):
    """Update reading progress for a book"""
    try:
        if not ObjectId.is_valid(book_id):
            return jsonify({"error": "Invalid book ID format"}), 400
        
        data = request.get_json()
        current_page = data.get("current_page", 0)
        total_pages = data.get("total_pages", 1)
        
        if total_pages > 0:
            progress = (current_page / total_pages) * 100
        else:
            progress = 0
        
        mongo.db.books.update_one(
            {"_id": ObjectId(book_id)},
            {
                "$set": {
                    "reading_progress": progress,
                    "last_read_page": current_page
                }
            }
        )
        
        return jsonify({
            "message": "Progress updated",
            "progress": progress,
            "current_page": current_page
        }), 200
        
    except Exception as e:
        return jsonify({"error": "Failed to update progress", "details": str(e)}), 500

@books_bp.route("/<book_id>/notes", methods=["POST"])
def add_note(book_id):
    """Add a note to a book"""
    try:
        if not ObjectId.is_valid(book_id):
            return jsonify({"error": "Invalid book ID format"}), 400
        
        data = request.get_json()
        note = {
            "id": str(ObjectId()),
            "page": data.get("page", 0),
            "text": data.get("text", ""),
            "created_at": data.get("created_at", "")
        }
        
        mongo.db.books.update_one(
            {"_id": ObjectId(book_id)},
            {"$push": {"notes": note}}
        )
        
        return jsonify({"message": "Note added", "note": note}), 200
        
    except Exception as e:
        return jsonify({"error": "Failed to add note", "details": str(e)}), 500

@books_bp.route("/<book_id>/highlights", methods=["POST"])
def add_highlight(book_id):
    """Add a highlight to a book"""
    try:
        if not ObjectId.is_valid(book_id):
            return jsonify({"error": "Invalid book ID format"}), 400
        
        data = request.get_json()
        highlight = {
            "id": str(ObjectId()),
            "page": data.get("page", 0),
            "text": data.get("text", ""),
            "color": data.get("color", "#ffff00"),
            "created_at": data.get("created_at", "")
        }
        
        mongo.db.books.update_one(
            {"_id": ObjectId(book_id)},
            {"$push": {"highlights": highlight}}
        )
        
        return jsonify({"message": "Highlight added", "highlight": highlight}), 200
        
    except Exception as e:
        return jsonify({"error": "Failed to add highlight", "details": str(e)}), 500

@books_bp.route("/<book_id>", methods=["DELETE"])
def delete_book(book_id):
    """Delete a book by ID"""
    try:
        # Validate ObjectId format
        if not ObjectId.is_valid(book_id):
            return jsonify({"error": "Invalid book ID format"}), 400
        
        result = mongo.db.books.delete_one({"_id": ObjectId(book_id)})
        
        if result.deleted_count == 0:
            return jsonify({"error": "Book not found"}), 404
        
        return jsonify({"message": "Book deleted successfully"}), 200
    except InvalidId:
        return jsonify({"error": "Invalid book ID format"}), 400
    except Exception as e:
        return jsonify({"error": "Failed to delete book", "details": str(e)}), 500


